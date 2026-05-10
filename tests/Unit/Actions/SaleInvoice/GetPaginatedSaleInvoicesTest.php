<?php

namespace Tests\Unit\Actions\SaleInvoice;

use App\Actions\SaleInvoice\GetPaginatedSaleInvoices;
use App\Enums\InvoiceStatus;
use App\Models\Customer;
use App\Models\SaleInvoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('sale-invoice')]
class GetPaginatedSaleInvoicesTest extends TestCase
{
    use RefreshDatabase;

    private GetPaginatedSaleInvoices $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(GetPaginatedSaleInvoices::class);
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

    public function test_it_can_get_paginated_sale_invoices(): void
    {
        SaleInvoice::factory()->count(15)->create();

        $result = $this->action->execute($this->defaultFilters());

        $this->assertCount(10, $result['saleInvoices']['data']);
        $this->assertEquals(15, $result['saleInvoices']['total']);
    }

    public function test_it_can_get_paginated_sale_invoices_second_page(): void
    {
        SaleInvoice::factory()->count(15)->create();

        $result = $this->action->execute($this->defaultFilters(['page' => 2]));

        $this->assertCount(5, $result['saleInvoices']['data']);
        $this->assertEquals(15, $result['saleInvoices']['total']);
    }

    public function test_it_can_filter_by_invoice_number(): void
    {
        SaleInvoice::factory()->create(['invoice_number' => 'SALE-0001']);
        SaleInvoice::factory()->create(['invoice_number' => 'SALE-9999']);

        $result = $this->action->execute($this->defaultFilters(['number' => 'SALE-0001']));

        $this->assertCount(1, $result['saleInvoices']['data']);
        $this->assertEquals('SALE-0001', $result['saleInvoices']['data'][0]['number']);
    }

    public function test_it_can_filter_by_invoice_number_partial_match(): void
    {
        SaleInvoice::factory()->create(['invoice_number' => 'SALE-ABC-001']);
        SaleInvoice::factory()->create(['invoice_number' => 'ORD-XYZ-999']);

        $result = $this->action->execute($this->defaultFilters(['number' => 'ABC']));

        $this->assertCount(1, $result['saleInvoices']['data']);
    }

    public function test_it_can_filter_by_created_status(): void
    {
        SaleInvoice::factory()->count(3)->create(['status' => InvoiceStatus::CREATED->value]);
        SaleInvoice::factory()->count(2)->confirmed()->create();
        SaleInvoice::factory()->count(1)->cancelled()->create();

        $result = $this->action->execute($this->defaultFilters(['status' => '0']));

        $this->assertCount(3, $result['saleInvoices']['data']);
    }

    public function test_it_can_filter_by_confirmed_status(): void
    {
        SaleInvoice::factory()->count(2)->create(['status' => InvoiceStatus::CREATED->value]);
        SaleInvoice::factory()->count(4)->confirmed()->create();

        $result = $this->action->execute($this->defaultFilters(['status' => '1']));

        $this->assertCount(4, $result['saleInvoices']['data']);
    }

    public function test_it_can_filter_by_cancelled_status(): void
    {
        SaleInvoice::factory()->count(2)->create(['status' => InvoiceStatus::CREATED->value]);
        SaleInvoice::factory()->count(3)->cancelled()->create();

        $result = $this->action->execute($this->defaultFilters(['status' => '2']));

        $this->assertCount(3, $result['saleInvoices']['data']);
    }

    public function test_it_returns_all_statuses_when_no_status_filter(): void
    {
        SaleInvoice::factory()->count(2)->create(['status' => InvoiceStatus::CREATED->value]);
        SaleInvoice::factory()->count(2)->confirmed()->create();
        SaleInvoice::factory()->count(2)->cancelled()->create();

        $result = $this->action->execute($this->defaultFilters(['status' => '']));

        $this->assertCount(6, $result['saleInvoices']['data']);
    }

    public function test_it_can_filter_by_date_from(): void
    {
        SaleInvoice::factory()->create(['invoice_date' => '2024-01-01']);
        SaleInvoice::factory()->create(['invoice_date' => '2025-06-01']);

        $result = $this->action->execute($this->defaultFilters(['dateFrom' => '2025-01-01']));

        $this->assertCount(1, $result['saleInvoices']['data']);
        $this->assertStringContainsString('2025', $result['saleInvoices']['data'][0]['date']);
    }

    public function test_it_can_filter_by_date_to(): void
    {
        SaleInvoice::factory()->create(['invoice_date' => '2024-01-01']);
        SaleInvoice::factory()->create(['invoice_date' => '2025-06-01']);

        $result = $this->action->execute($this->defaultFilters(['dateTo' => '2024-12-31']));

        $this->assertCount(1, $result['saleInvoices']['data']);
    }

    public function test_it_can_filter_by_date_range(): void
    {
        SaleInvoice::factory()->create(['invoice_date' => '2024-03-01']);
        SaleInvoice::factory()->create(['invoice_date' => '2024-07-15']);
        SaleInvoice::factory()->create(['invoice_date' => '2025-01-01']);

        $result = $this->action->execute($this->defaultFilters([
            'dateFrom' => '2024-01-01',
            'dateTo'   => '2024-12-31',
        ]));

        $this->assertCount(2, $result['saleInvoices']['data']);
    }

    public function test_it_returns_filters_in_result(): void
    {
        $filters = $this->defaultFilters(['number' => 'TEST']);

        $result = $this->action->execute($filters);

        $this->assertEquals($filters, $result['filters']);
    }

    public function test_it_returns_invoices_ordered_by_date_desc(): void
    {
        SaleInvoice::factory()->create(['invoice_date' => '2024-01-01', 'invoice_number' => 'OLDEST']);
        SaleInvoice::factory()->create(['invoice_date' => '2025-06-01', 'invoice_number' => 'NEWEST']);

        $result = $this->action->execute($this->defaultFilters());

        $this->assertEquals('NEWEST', $result['saleInvoices']['data'][0]['number']);
        $this->assertEquals('OLDEST', $result['saleInvoices']['data'][1]['number']);
    }

    public function test_it_loads_customer_relationship(): void
    {
        $customer = Customer::factory()->create(['name' => 'Test Customer SA']);
        SaleInvoice::factory()->create(['customer_id' => $customer->id]);

        $result = $this->action->execute($this->defaultFilters());

        $this->assertArrayHasKey('customer', $result['saleInvoices']['data'][0]);
        $this->assertEquals('Test Customer SA', $result['saleInvoices']['data'][0]['customer']['name']);
    }
}