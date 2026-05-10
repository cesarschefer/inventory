<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('report')]
class ReportTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_reports(): void
    {
        $this->get(route('reports.index'))->assertRedirect(route('login'));
    }

    public function test_authorized_users_can_view_reports_index(): void
    {
        $this->user->givePermissionTo('view-reports');
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('report/index')
            ->has('filters')
            ->where('filters.report_type', 'purchases')
            ->has('filters.date_from')
            ->has('filters.date_to')
        );
    }

    public function test_export_rejects_guests(): void
    {
        $this->get(route('reports.export'))->assertRedirect(route('login'));
    }

    public function test_export_validates_required_fields(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export'), []);

        $response->assertStatus(422)
            ->assertJson(['message' => 'You must select a report type.']);
    }

    public function test_export_validates_invalid_report_type(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export'), [
            'report_type' => 'invalid_type',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);
    }

    public function test_export_validates_invalid_format(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export'), [
            'report_type' => 'purchases',
            'format' => 'csv',
        ]);

        $response->assertStatus(422);
    }

    public function test_export_validates_date_order(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export'), [
            'report_type' => 'purchases',
            'date_from' => '2024-01-31',
            'date_to' => '2024-01-01',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);
    }

    public function test_export_returns_excel_file_for_purchases(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export') . '?' . http_build_query([
            'report_type' => 'purchases',
            'format' => 'excel',
            'date_from' => '2024-01-01',
            'date_to' => '2024-01-31',
        ]));

        $response->assertStatus(200);
        $response->assertDownload('purchases.xlsx');
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_export_returns_excel_file_for_sales(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export') . '?' . http_build_query([
            'report_type' => 'sales',
            'format' => 'excel',
            'date_from' => '2024-01-01',
            'date_to' => '2024-01-31',
        ]));

        $response->assertStatus(200);
        $response->assertDownload('sales.xlsx');
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_export_returns_excel_file_for_profit(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export') . '?' . http_build_query([
            'report_type' => 'profit',
            'format' => 'excel',
            'date_from' => '2024-01-01',
            'date_to' => '2024-01-31',
        ]));

        $response->assertStatus(200);
        $response->assertDownload('profit.xlsx');
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_export_returns_pdf_file_for_purchases(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export') . '?' . http_build_query([
            'report_type' => 'purchases',
            'format' => 'pdf',
            'date_from' => '2024-01-01',
            'date_to' => '2024-01-31',
        ]));

        $response->assertStatus(200);
        $response->assertDownload('purchases_report.pdf');
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_export_returns_pdf_file_for_sales(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export') . '?' . http_build_query([
            'report_type' => 'sales',
            'format' => 'pdf',
            'date_from' => '2024-01-01',
            'date_to' => '2024-01-31',
        ]));

        $response->assertStatus(200);
        $response->assertDownload('sales_report.pdf');
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_export_returns_pdf_file_for_profit(): void
    {
        $this->user->givePermissionTo('export-reports');

        $response = $this->actingAs($this->user)->get(route('reports.export') . '?' . http_build_query([
            'report_type' => 'profit',
            'format' => 'pdf',
            'date_from' => '2024-01-01',
            'date_to' => '2024-01-31',
        ]));

        $response->assertStatus(200);
        $response->assertDownload('profit.pdf');
        $response->assertHeader('content-type', 'application/pdf');
    }
}
