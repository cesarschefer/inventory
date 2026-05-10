<?php

namespace Tests\Unit\Actions\PurchaseInvoice;

use App\Actions\PurchaseInvoice\GetPaginatedPurchaseInvoices;
use App\Enums\InvoiceStatus;
use App\Models\PurchaseInvoice;
use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('purchase-invoice')]
class GetPaginatedPurchaseInvoicesTest extends TestCase
{
    use RefreshDatabase;

    private GetPaginatedPurchaseInvoices $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(GetPaginatedPurchaseInvoices::class);
    }

    private function defaultFilters(array $overrides = []): array
    {
        return array_merge([
            'number'   => '',
            'status'   => '',
            'dateFrom' => '',
            'dateTo'   => '',
            'page'     => 1,
        ], $overrides);
    }

    public function test_it_can_get_paginated_purchase_invoices(): void
    {
        PurchaseInvoice::factory()->count(15)->create();

        $result = $this->action->execute($this->defaultFilters());

        $this->assertCount(10, $result['purchaseInvoices']['data']);
        $this->assertEquals(15, $result['purchaseInvoices']['total']);
    }

    public function test_it_can_get_paginated_purchase_invoices_second_page(): void
    {
        PurchaseInvoice::factory()->count(15)->create();

        $result = $this->action->execute($this->defaultFilters(['page' => 2]));

        $this->assertCount(5, $result['purchaseInvoices']['data']);
        $this->assertEquals(15, $result['purchaseInvoices']['total']);
    }

    public function test_it_can_filter_by_invoice_number(): void
    {
        PurchaseInvoice::factory()->create(['invoice_number' => 'INV-0001']);
        PurchaseInvoice::factory()->create(['invoice_number' => 'INV-9999']);

        $result = $this->action->execute($this->defaultFilters(['number' => 'INV-0001']));

        $this->assertCount(1, $result['purchaseInvoices']['data']);
        $this->assertEquals('INV-0001', $result['purchaseInvoices']['data'][0]['number']);
    }

    public function test_it_can_filter_by_invoice_number_partial_match(): void
    {
        PurchaseInvoice::factory()->create(['invoice_number' => 'INV-ABC-001']);
        PurchaseInvoice::factory()->create(['invoice_number' => 'ORD-XYZ-999']);

        $result = $this->action->execute($this->defaultFilters(['number' => 'ABC']));

        $this->assertCount(1, $result['purchaseInvoices']['data']);
    }

    public function test_it_can_filter_by_created_status(): void
    {
        PurchaseInvoice::factory()->count(3)->create(['status' => InvoiceStatus::CREATED->value]);
        PurchaseInvoice::factory()->count(2)->confirmed()->create();
        PurchaseInvoice::factory()->count(1)->cancelled()->create();

        $result = $this->action->execute($this->defaultFilters(['status' => '0']));

        $this->assertCount(3, $result['purchaseInvoices']['data']);
    }

    public function test_it_can_filter_by_confirmed_status(): void
    {
        PurchaseInvoice::factory()->count(2)->create(['status' => InvoiceStatus::CREATED->value]);
        PurchaseInvoice::factory()->count(4)->confirmed()->create();

        $result = $this->action->execute($this->defaultFilters(['status' => '1']));

        $this->assertCount(4, $result['purchaseInvoices']['data']);
    }

    public function test_it_can_filter_by_cancelled_status(): void
    {
        PurchaseInvoice::factory()->count(2)->create(['status' => InvoiceStatus::CREATED->value]);
        PurchaseInvoice::factory()->count(3)->cancelled()->create();

        $result = $this->action->execute($this->defaultFilters(['status' => '2']));

        $this->assertCount(3, $result['purchaseInvoices']['data']);
    }

    public function test_it_returns_all_statuses_when_no_status_filter(): void
    {
        PurchaseInvoice::factory()->count(2)->create(['status' => InvoiceStatus::CREATED->value]);
        PurchaseInvoice::factory()->count(2)->confirmed()->create();
        PurchaseInvoice::factory()->count(2)->cancelled()->create();

        $result = $this->action->execute($this->defaultFilters(['status' => '']));

        $this->assertCount(6, $result['purchaseInvoices']['data']);
    }

    public function test_it_can_filter_by_date_from(): void
    {
        PurchaseInvoice::factory()->create(['invoice_date' => '2024-01-01']);
        PurchaseInvoice::factory()->create(['invoice_date' => '2025-06-01']);

        $result = $this->action->execute($this->defaultFilters(['dateFrom' => '2025-01-01']));

        $this->assertCount(1, $result['purchaseInvoices']['data']);
        $this->assertStringContainsString('2025', $result['purchaseInvoices']['data'][0]['date']);
    }

    public function test_it_can_filter_by_date_to(): void
    {
        PurchaseInvoice::factory()->create(['invoice_date' => '2024-01-01']);
        PurchaseInvoice::factory()->create(['invoice_date' => '2025-06-01']);

        $result = $this->action->execute($this->defaultFilters(['dateTo' => '2024-12-31']));

        $this->assertCount(1, $result['purchaseInvoices']['data']);
    }

    public function test_it_can_filter_by_date_range(): void
    {
        PurchaseInvoice::factory()->create(['invoice_date' => '2024-03-01']);
        PurchaseInvoice::factory()->create(['invoice_date' => '2024-07-15']);
        PurchaseInvoice::factory()->create(['invoice_date' => '2025-01-01']);

        $result = $this->action->execute($this->defaultFilters([
            'dateFrom' => '2024-01-01',
            'dateTo'   => '2024-12-31',
        ]));

        $this->assertCount(2, $result['purchaseInvoices']['data']);
    }

    public function test_it_returns_filters_in_result(): void
    {
        $filters = $this->defaultFilters(['number' => 'TEST']);

        $result = $this->action->execute($filters);

        $this->assertEquals($filters, $result['filters']);
    }

    public function test_it_returns_invoices_ordered_by_date_desc(): void
    {
        PurchaseInvoice::factory()->create(['invoice_date' => '2024-01-01', 'invoice_number' => 'OLDEST']);
        PurchaseInvoice::factory()->create(['invoice_date' => '2025-06-01', 'invoice_number' => 'NEWEST']);

        $result = $this->action->execute($this->defaultFilters());

        $this->assertEquals('NEWEST', $result['purchaseInvoices']['data'][0]['number']);
        $this->assertEquals('OLDEST', $result['purchaseInvoices']['data'][1]['number']);
    }

    public function test_it_loads_supplier_relationship(): void
    {
        $supplier = Supplier::factory()->create(['name' => 'Test Supplier SA']);
        PurchaseInvoice::factory()->create(['supplier_id' => $supplier->id]);

        $result = $this->action->execute($this->defaultFilters());

        $this->assertArrayHasKey('supplier', $result['purchaseInvoices']['data'][0]);
        $this->assertEquals('Test Supplier SA', $result['purchaseInvoices']['data'][0]['supplier']['name']);
    }
}
