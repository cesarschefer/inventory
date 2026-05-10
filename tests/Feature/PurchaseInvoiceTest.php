<?php

namespace Tests\Feature;

use App\Enums\InvoiceStatus;
use App\Models\Product;
use App\Models\PurchaseInvoice;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('purchase-invoice')]
class PurchaseInvoiceTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ─── Authorization ────────────────────────────────────────────────────────

    public function test_guests_cannot_access_purchase_invoices(): void
    {
        $this->get(route('purchase-invoices.index'))->assertRedirect(route('login'));
    }

    public function test_unauthorized_users_cannot_view_purchase_invoices(): void
    {
        $this->actingAs($this->user)
            ->get(route('purchase-invoices.index'))
            ->assertForbidden();
    }

    public function test_unauthorized_users_cannot_access_create_form(): void
    {
        $this->actingAs($this->user)
            ->get(route('purchase-invoices.create'))
            ->assertForbidden();
    }

    // ─── Index ────────────────────────────────────────────────────────────────

    public function test_authorized_users_can_view_purchase_invoices_index(): void
    {
        $this->user->givePermissionTo('view-purchases');
        PurchaseInvoice::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get(route('purchase-invoices.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('purchase-invoice/index')
            ->has('purchaseInvoices.data', 5)
        );
    }

    // ─── Create / Store ───────────────────────────────────────────────────────

    public function test_authorized_users_can_access_create_form(): void
    {
        $this->user->givePermissionTo('create-purchases');

        $response = $this->actingAs($this->user)->get(route('purchase-invoices.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('purchase-invoice/create')
            ->has('suppliers')
            ->has('products')
        );
    }

    public function test_authorized_users_can_create_purchase_invoices(): void
    {
        $this->user->givePermissionTo('create-purchases');
        $supplier = Supplier::factory()->create();
        $product  = Product::factory()->create();

        $response = $this->actingAs($this->user)->post(route('purchase-invoices.store'), [
            'supplier_id'    => $supplier->id,
            'invoice_number' => 'INV-0001',
            'invoice_date'   => '2025-01-15',
            'total'          => 500.00,
            'invoiceItems'   => [
                [
                    'product_id' => $product->id,
                    'quantity'   => 5,
                    'unit_price' => 100.00,
                    'subtotal'   => 500.00,
                ],
            ],
        ]);

        $response->assertRedirect(route('purchase-invoices.index'));
        $this->assertDatabaseHas('purchase_invoices', [
            'invoice_number' => 'INV-0001',
            'supplier_id'    => $supplier->id,
            'status'         => InvoiceStatus::CREATED->value,
        ]);
        $this->assertDatabaseHas('purchase_invoice_items', [
            'product_id' => $product->id,
            'quantity'   => 5,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type'       => 'purchase',
            'quantity'   => 5,
        ]);
    }

    public function test_creating_purchase_invoice_moves_stock(): void
    {
        $this->user->givePermissionTo('create-purchases');
        $supplier = Supplier::factory()->create();
        $product1 = Product::factory()->create();
        $product2 = Product::factory()->create();

        $this->actingAs($this->user)->post(route('purchase-invoices.store'), [
            'supplier_id'    => $supplier->id,
            'invoice_number' => 'INV-0002',
            'invoice_date'   => '2025-01-15',
            'total'          => 700.00,
            'invoiceItems'   => [
                [
                    'product_id' => $product1->id,
                    'quantity'   => 3,
                    'unit_price' => 100.00,
                    'subtotal'   => 300.00,
                ],
                [
                    'product_id' => $product2->id,
                    'quantity'   => 4,
                    'unit_price' => 100.00,
                    'subtotal'   => 400.00,
                ],
            ],
        ]);

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product1->id,
            'type'       => 'purchase',
            'quantity'   => 3,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product2->id,
            'type'       => 'purchase',
            'quantity'   => 4,
        ]);
    }

    public function test_updating_purchase_invoice_updates_stock_movements(): void
    {
        $this->user->givePermissionTo('edit-purchases');
        $invoice = PurchaseInvoice::factory()->create(['status' => InvoiceStatus::CREATED->value]);
        $product1 = Product::factory()->create();
        $product2 = Product::factory()->create();

        $this->actingAs($this->user)->put(route('purchase-invoices.update', $invoice), [
            'supplier_id'    => $invoice->supplier_id,
            'invoice_number' => 'INV-UPDATED',
            'invoice_date'   => '2025-06-01',
            'total'          => 250.00,
            'invoiceItems'   => [
                [
                    'product_id' => $product1->id,
                    'quantity'   => 2,
                    'unit_price' => 125.00,
                    'subtotal'   => 250.00,
                ],
            ],
        ]);

        $this->assertDatabaseMissing('stock_movements', [
            'product_id' => $product1->id,
            'quantity'   => 5,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product1->id,
            'type'       => 'purchase',
            'quantity'   => 2,
        ]);
        $this->assertDatabaseMissing('stock_movements', [
            'product_id' => $product2->id,
            'quantity'   => 4,
        ]);
    }

    public function test_cancelling_purchase_invoice_deletes_stock_movements(): void
    {
        $this->user->givePermissionTo('delete-purchases');
        $supplier = Supplier::factory()->create();
        $product = Product::factory()->create();
        $invoice = PurchaseInvoice::factory()->create([
            'supplier_id' => $supplier->id,
            'status' => InvoiceStatus::CREATED->value,
        ]);
        $invoice->items()->create([
            'product_id' => $product->id,
            'quantity' => 5,
            'unit_price' => 100.00,
            'subtotal' => 500.00,
        ]);
        $stockMovement = $invoice->stockMovements()->create([
            'product_id' => $product->id,
            'type' => 'purchase',
            'quantity' => 5,
        ]);

        $this->actingAs($this->user)
            ->delete(route('purchase-invoices.destroy', $invoice));

        $this->assertDatabaseMissing('stock_movements', [
            'id' => $stockMovement->id,
        ]);
    }

    // ─── Show ─────────────────────────────────────────────────────────────────

    public function test_authorized_users_can_view_a_purchase_invoice(): void
    {
        $this->user->givePermissionTo('view-purchases');
        $invoice = PurchaseInvoice::factory()->create();

        $response = $this->actingAs($this->user)->get(route('purchase-invoices.show', $invoice));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('purchase-invoice/show')
            ->has('purchase_invoice')
        );
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    public function test_authorized_users_can_update_purchase_invoices(): void
    {
        $this->user->givePermissionTo('edit-purchases');
        $invoice = PurchaseInvoice::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($this->user)->put(route('purchase-invoices.update', $invoice), [
            'supplier_id'    => $invoice->supplier_id,
            'invoice_number' => 'INV-UPDATED',
            'invoice_date'   => '2025-06-01',
            'total'          => 250.00,
            'invoiceItems'   => [
                [
                    'product_id' => $product->id,
                    'quantity'   => 2,
                    'unit_price' => 125.00,
                    'subtotal'   => 250.00,
                ],
            ],
        ]);

        $response->assertRedirect(route('purchase-invoices.index'));
        $this->assertDatabaseHas('purchase_invoices', [
            'id'             => $invoice->id,
            'invoice_number' => 'INV-UPDATED',
        ]);
    }

    // ─── Confirm ──────────────────────────────────────────────────────────────

    public function test_authorized_users_can_confirm_a_created_invoice(): void
    {
        $this->user->givePermissionTo('edit-purchases');
        $invoice = PurchaseInvoice::factory()->create(['status' => InvoiceStatus::CREATED->value]);

        $response = $this->actingAs($this->user)
            ->put(route('purchase-invoices.confirm', $invoice));

        $response->assertRedirect(route('purchase-invoices.index'));
        $this->assertDatabaseHas('purchase_invoices', [
            'id'     => $invoice->id,
            'status' => InvoiceStatus::CONFIRMED->value,
        ]);
    }

    public function test_confirmed_invoices_cannot_be_confirmed_again(): void
    {
        $this->user->givePermissionTo('edit-purchases');
        $invoice = PurchaseInvoice::factory()->confirmed()->create();

        $response = $this->actingAs($this->user)
            ->put(route('purchase-invoices.confirm', $invoice));

        $response->assertSessionHasErrors('message');
        $this->assertDatabaseHas('purchase_invoices', [
            'id'     => $invoice->id,
            'status' => InvoiceStatus::CONFIRMED->value,
        ]);
    }

    // ─── Cancel / Destroy ────────────────────────────────────────────────────

    public function test_authorized_users_can_cancel_a_created_invoice(): void
    {
        $this->user->givePermissionTo('delete-purchases');
        $invoice = PurchaseInvoice::factory()->create(['status' => InvoiceStatus::CREATED->value]);

        $response = $this->actingAs($this->user)
            ->delete(route('purchase-invoices.destroy', $invoice));

        $response->assertRedirect(route('purchase-invoices.index'));
        $this->assertDatabaseHas('purchase_invoices', [
            'id'     => $invoice->id,
            'status' => InvoiceStatus::CANCELLED->value,
        ]);
    }

    public function test_confirmed_invoices_cannot_be_cancelled(): void
    {
        $this->user->givePermissionTo('delete-purchases');
        $invoice = PurchaseInvoice::factory()->confirmed()->create();

        $response = $this->actingAs($this->user)
            ->delete(route('purchase-invoices.destroy', $invoice));

        $response->assertSessionHasErrors('message');
        $this->assertDatabaseHas('purchase_invoices', [
            'id'     => $invoice->id,
            'status' => InvoiceStatus::CONFIRMED->value,
        ]);
    }

    public function test_unauthorized_users_cannot_cancel_invoices(): void
    {
        $invoice = PurchaseInvoice::factory()->create();

        $this->actingAs($this->user)
            ->delete(route('purchase-invoices.destroy', $invoice))
            ->assertForbidden();
    }
}
