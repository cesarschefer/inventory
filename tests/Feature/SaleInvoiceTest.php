<?php

namespace Tests\Feature;

use App\Enums\InvoiceStatus;
use App\Models\Customer;
use App\Models\Product;
use App\Models\PurchaseInvoice;
use App\Models\SaleInvoice;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('sale-invoice')]
class SaleInvoiceTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function createStock(Product $product, int $quantity): void
    {
        $supplier = Supplier::factory()->create();
        $invoice = PurchaseInvoice::factory()->create([
            'supplier_id' => $supplier->id,
            'invoice_number' => 'STOCK-' . uniqid(),
        ]);
        $invoice->items()->create([
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price' => 100.00,
            'subtotal' => $quantity * 100.00,
        ]);
        $invoice->stockMovements()->create([
            'product_id' => $product->id,
            'type' => 'purchase',
            'quantity' => $quantity,
        ]);
    }

    // ─── Authorization ────────────────────────────────────────────────────────

    public function test_guests_cannot_access_sale_invoices(): void
    {
        $this->get(route('sale-invoices.index'))->assertRedirect(route('login'));
    }

    public function test_unauthorized_users_cannot_view_sale_invoices(): void
    {
        $this->actingAs($this->user)
            ->get(route('sale-invoices.index'))
            ->assertForbidden();
    }

    public function test_unauthorized_users_cannot_access_create_form(): void
    {
        $this->actingAs($this->user)
            ->get(route('sale-invoices.create'))
            ->assertForbidden();
    }

    // ─── Index ────────────────────────────────────────────────────────────────

    public function test_authorized_users_can_view_sale_invoices_index(): void
    {
        $this->user->givePermissionTo('view-sales');
        SaleInvoice::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get(route('sale-invoices.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('sale-invoice/index')
            ->has('saleInvoices.data', 5)
        );
    }

    // ─── Create / Store ───────────────────────────────────────────────────────

    public function test_authorized_users_can_access_create_form(): void
    {
        $this->user->givePermissionTo('create-sales');

        $response = $this->actingAs($this->user)->get(route('sale-invoices.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('sale-invoice/create')
            ->has('customers')
            ->has('products')
        );
    }

    public function test_authorized_users_can_create_sale_invoices(): void
    {
        $this->user->givePermissionTo('create-sales');
        $customer = Customer::factory()->create();
        $product  = Product::factory()->create();

        $this->createStock($product, 10);

        $response = $this->actingAs($this->user)->post(route('sale-invoices.store'), [
            'customer_id'   => $customer->id,
            'invoice_number'=> 'SALE-0001',
            'invoice_date'  => '2025-01-15',
            'total'          => 500.00,
            'invoiceItems'   => [
                [
                    'product_id'   => $product->id,
                    'quantity'     => 5,
                    'unit_price'   => 100.00,
                    'subtotal'     => 500.00,
                    'discount_type'=> 0,
                    'discount'     => 0,
                    'total'        => 500.00,
                ],
            ],
        ]);

        $response->assertRedirect(route('sale-invoices.index'));
        $this->assertDatabaseHas('sale_invoices', [
            'invoice_number' => 'SALE-0001',
            'customer_id'    => $customer->id,
            'status'         => InvoiceStatus::CREATED->value,
        ]);
        $this->assertDatabaseHas('sale_invoice_items', [
            'product_id' => $product->id,
            'quantity'   => 5,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type'       => 'sale',
            'quantity'   => -5,
        ]);
    }

    public function test_creating_sale_invoice_moves_stock(): void
    {
        $this->user->givePermissionTo('create-sales');
        $customer = Customer::factory()->create();
        $product1 = Product::factory()->create();
        $product2 = Product::factory()->create();

        $this->createStock($product1, 10);
        $this->createStock($product2, 8);

        $this->actingAs($this->user)->post(route('sale-invoices.store'), [
            'customer_id'   => $customer->id,
            'invoice_number'=> 'SALE-0001B',
            'invoice_date'  => '2025-01-15',
            'total'          => 600.00,
            'invoiceItems'   => [
                [
                    'product_id'   => $product1->id,
                    'quantity'     => 3,
                    'unit_price'   => 100.00,
                    'subtotal'     => 300.00,
                    'discount_type'=> 0,
                    'discount'     => 0,
                    'total'        => 300.00,
                ],
                [
                    'product_id'   => $product2->id,
                    'quantity'     => 3,
                    'unit_price'   => 100.00,
                    'subtotal'     => 300.00,
                    'discount_type'=> 0,
                    'discount'     => 0,
                    'total'        => 300.00,
                ],
            ],
        ]);

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product1->id,
            'type'       => 'sale',
            'quantity'   => -3,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product2->id,
            'type'       => 'sale',
            'quantity'   => -3,
        ]);
    }

    public function test_updating_sale_invoice_updates_stock_movements(): void
    {
        $this->user->givePermissionTo('edit-sales');
        $invoice = SaleInvoice::factory()->create(['status' => InvoiceStatus::CREATED->value]);
        $product = Product::factory()->create();

        $this->createStock($product, 20);

        $this->actingAs($this->user)->put(route('sale-invoices.update', $invoice), [
            'customer_id'   => $invoice->customer_id,
            'invoice_number'=> 'SALE-UPDATED',
            'invoice_date'  => '2025-06-01',
            'total'          => 200.00,
            'invoiceItems'   => [
                [
                    'product_id'   => $product->id,
                    'quantity'     => 2,
                    'unit_price'   => 100.00,
                    'subtotal'     => 200.00,
                    'discount_type'=> 0,
                    'discount'     => 0,
                    'total'        => 200.00,
                ],
            ],
        ]);

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type'       => 'sale',
            'quantity'   => -2,
        ]);
    }

    public function test_cancelling_sale_invoice_deletes_stock_movements(): void
    {
        $this->user->givePermissionTo('delete-sales');
        $product = Product::factory()->create();
        $invoice = SaleInvoice::factory()->create(['status' => InvoiceStatus::CREATED->value]);
        $stockMovement = $invoice->stockMovements()->create([
            'product_id' => $product->id,
            'type' => 'sale',
            'quantity' => -5,
        ]);

        $this->actingAs($this->user)
            ->delete(route('sale-invoices.destroy', $invoice));

        $this->assertDatabaseMissing('stock_movements', [
            'id' => $stockMovement->id,
        ]);
    }

    public function test_cannot_create_sale_invoice_without_sufficient_stock(): void
    {
        $this->user->givePermissionTo('create-sales');
        $customer = Customer::factory()->create();
        $product  = Product::factory()->create();

        $this->createStock($product, 3);

        $response = $this->actingAs($this->user)->post(route('sale-invoices.store'), [
            'customer_id'   => $customer->id,
            'invoice_number'=> 'SALE-0002',
            'invoice_date'  => '2025-01-15',
            'total'          => 500.00,
            'invoiceItems'   => [
                [
                    'product_id'   => $product->id,
                    'quantity'     => 10,
                    'unit_price'   => 100.00,
                    'subtotal'     => 1000.00,
                    'discount_type'=> 0,
                    'discount'     => 0,
                    'total'        => 1000.00,
                ],
            ],
        ]);

        $response->assertSessionHasErrors('message');
        $this->assertDatabaseMissing('sale_invoices', [
            'invoice_number' => 'SALE-0002',
        ]);
    }

    // ─── Show ─────────────────────────────────────────────────────────────────

    public function test_authorized_users_can_view_a_sale_invoice(): void
    {
        $this->user->givePermissionTo('view-sales');
        $invoice = SaleInvoice::factory()->create();

        $response = $this->actingAs($this->user)->get(route('sale-invoices.show', $invoice));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('sale-invoice/show')
            ->has('sale_invoice')
        );
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    public function test_authorized_users_can_update_sale_invoices(): void
    {
        $this->user->givePermissionTo('edit-sales');
        $invoice = SaleInvoice::factory()->create();
        $product = Product::factory()->create();

        $this->createStock($product, 10);

        $response = $this->actingAs($this->user)->put(route('sale-invoices.update', $invoice), [
            'customer_id'   => $invoice->customer_id,
            'invoice_number'=> 'SALE-UPDATED',
            'invoice_date'  => '2025-06-01',
            'total'          => 250.00,
            'invoiceItems'   => [
                [
                    'product_id'   => $product->id,
                    'quantity'     => 2,
                    'unit_price'   => 125.00,
                    'subtotal'     => 250.00,
                    'discount_type'=> 0,
                    'discount'     => 0,
                    'total'        => 250.00,
                ],
            ],
        ]);

        $response->assertRedirect(route('sale-invoices.index'));
        $this->assertDatabaseHas('sale_invoices', [
            'id'             => $invoice->id,
            'invoice_number' => 'SALE-UPDATED',
        ]);
    }

    public function test_cannot_update_sale_invoice_without_sufficient_stock(): void
    {
        $this->user->givePermissionTo('edit-sales');
        $invoice = SaleInvoice::factory()->create();
        $product = Product::factory()->create();

        $this->createStock($product, 5);

        $response = $this->actingAs($this->user)->put(route('sale-invoices.update', $invoice), [
            'customer_id'   => $invoice->customer_id,
            'invoice_number'=> 'SALE-0003',
            'invoice_date'  => '2025-06-01',
            'total'          => 1000.00,
            'invoiceItems'   => [
                [
                    'product_id'   => $product->id,
                    'quantity'     => 20,
                    'unit_price'   => 100.00,
                    'subtotal'     => 2000.00,
                    'discount_type'=> 0,
                    'discount'     => 0,
                    'total'        => 2000.00,
                ],
            ],
        ]);

        $response->assertSessionHasErrors('message');
    }

    // ─── Confirm ──────────────────────────────────────────────────────────────

    public function test_authorized_users_can_confirm_a_created_invoice(): void
    {
        $this->user->givePermissionTo('edit-sales');
        $invoice = SaleInvoice::factory()->create(['status' => InvoiceStatus::CREATED->value]);

        $response = $this->actingAs($this->user)
            ->put(route('sale-invoices.confirm', $invoice));

        $response->assertRedirect(route('sale-invoices.index'));
        $this->assertDatabaseHas('sale_invoices', [
            'id'     => $invoice->id,
            'status' => InvoiceStatus::CONFIRMED->value,
        ]);
    }

    public function test_confirmed_invoices_cannot_be_confirmed_again(): void
    {
        $this->user->givePermissionTo('edit-sales');
        $invoice = SaleInvoice::factory()->confirmed()->create();

        $response = $this->actingAs($this->user)
            ->put(route('sale-invoices.confirm', $invoice));

        $response->assertSessionHasErrors('message');
        $this->assertDatabaseHas('sale_invoices', [
            'id'     => $invoice->id,
            'status' => InvoiceStatus::CONFIRMED->value,
        ]);
    }

    // ─── Cancel / Destroy ────────────────────────────────────────────────────

    public function test_authorized_users_can_cancel_a_created_invoice(): void
    {
        $this->user->givePermissionTo('delete-sales');
        $invoice = SaleInvoice::factory()->create(['status' => InvoiceStatus::CREATED->value]);

        $response = $this->actingAs($this->user)
            ->delete(route('sale-invoices.destroy', $invoice));

        $response->assertRedirect(route('sale-invoices.index'));
        $this->assertDatabaseHas('sale_invoices', [
            'id'     => $invoice->id,
            'status' => InvoiceStatus::CANCELLED->value,
        ]);
    }

    public function test_confirmed_invoices_cannot_be_cancelled(): void
    {
        $this->user->givePermissionTo('delete-sales');
        $invoice = SaleInvoice::factory()->confirmed()->create();

        $response = $this->actingAs($this->user)
            ->delete(route('sale-invoices.destroy', $invoice));

        $response->assertSessionHasErrors('message');
        $this->assertDatabaseHas('sale_invoices', [
            'id'     => $invoice->id,
            'status' => InvoiceStatus::CONFIRMED->value,
        ]);
    }

    public function test_unauthorized_users_cannot_cancel_invoices(): void
    {
        $invoice = SaleInvoice::factory()->create();

        $this->actingAs($this->user)
            ->delete(route('sale-invoices.destroy', $invoice))
            ->assertForbidden();
    }
}