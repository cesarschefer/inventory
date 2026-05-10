<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('import')]
class ImportTest extends TestCase
{
    private User $user;

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_import_page(): void
    {
        $this->get(route('import.index'))->assertRedirect(route('login'));
    }

    public function test_users_without_permission_cannot_access_import_page(): void
    {
        $this->actingAs($this->user)->get(route('import.index'))->assertForbidden();
    }

    public function test_authorized_users_can_view_import_page(): void
    {
        $this->user->givePermissionTo('import-data');

        $response = $this->actingAs($this->user)->get(route('import.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('import/index')
        );
    }

    public function test_guests_cannot_import(): void
    {
        $this->post(route('import.import'))->assertRedirect(route('login'));
    }

    public function test_users_without_permission_cannot_import(): void
    {
        $this->actingAs($this->user)->post(route('import.import'))->assertForbidden();
    }

    public function test_import_requires_import_type(): void
    {
        $this->user->givePermissionTo('import-data');

        $response = $this->actingAs($this->user)->post(route('import.import'), []);

        $response->assertSessionHasErrors('import_type');
    }

    public function test_import_requires_file(): void
    {
        $this->user->givePermissionTo('import-data');

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'categories',
        ]);

        $response->assertSessionHasErrors('file');
    }

    public function test_import_requires_valid_import_type(): void
    {
        $this->user->givePermissionTo('import-data');

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'invalid_type',
            'file' => UploadedFile::fake()->create('test.csv'),
        ]);

        $response->assertSessionHasErrors('import_type');
    }

    public function test_import_requires_csv_file(): void
    {
        $this->user->givePermissionTo('import-data');

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'categories',
            'file' => UploadedFile::fake()->create('test.txt', 100),
        ]);

        $response->assertSessionHasErrors('file');
    }

    public function test_import_categories_success(): void
    {
        $this->user->givePermissionTo('import-data');

        $file = UploadedFile::fake()->createWithContent('categories.csv', "name\nElectronics\nClothing\nBooks");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'categories',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['imported', 'skipped', 'errors']);
        $this->assertDatabaseHas('categories', ['name' => 'Electronics']);
        $this->assertDatabaseHas('categories', ['name' => 'Clothing']);
        $this->assertDatabaseHas('categories', ['name' => 'Books']);
    }

    public function test_import_categories_with_duplicate_skips(): void
    {
        $this->user->givePermissionTo('import-data');
        Category::factory()->create(['name' => 'Electronics']);

        $file = UploadedFile::fake()->createWithContent('categories.csv', "name\nElectronics\nClothing");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'categories',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('imported'));
        $this->assertEquals(1, $response->json('skipped'));
    }

    public function test_import_products_success(): void
    {
        $this->user->givePermissionTo('import-data');
        Category::factory()->create(['name' => 'Electronics']);
        Category::factory()->create(['name' => 'Clothing']);

        $file = UploadedFile::fake()->createWithContent('products.csv', "name,sku,category,detail\nProduct 1,SKU001,Electronics,Detail 1\nProduct 2,SKU002,Clothing,Detail 2");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'products',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(2, $response->json('imported'));
        $this->assertDatabaseHas('products', ['name' => 'Product 1', 'sku' => 'SKU001']);
        $this->assertDatabaseHas('products', ['name' => 'Product 2', 'sku' => 'SKU002']);
    }

    public function test_import_products_skips_when_category_not_found(): void
    {
        $this->user->givePermissionTo('import-data');

        $file = UploadedFile::fake()->createWithContent('products.csv', "name,sku,category,detail\nProduct 1,SKU001,NonExistent,Detail 1");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'products',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(0, $response->json('imported'));
        $this->assertEquals(1, $response->json('skipped'));
    }

    public function test_import_products_skips_duplicate_sku(): void
    {
        $this->user->givePermissionTo('import-data');
        Category::factory()->create(['name' => 'Electronics']);
        Product::factory()->create(['sku' => 'SKU001']);

        $file = UploadedFile::fake()->createWithContent('products.csv', "name,sku,category,detail\nProduct 1,SKU001,Electronics,Detail 1");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'products',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(0, $response->json('imported'));
        $this->assertEquals(1, $response->json('skipped'));
    }

    public function test_import_products_skips_missing_required_fields(): void
    {
        $this->user->givePermissionTo('import-data');
        Category::factory()->create(['name' => 'Electronics']);

        $file = UploadedFile::fake()->createWithContent('products.csv', "name,sku,category,detail\n,SKU001,Electronics,Detail 1\nProduct 2,,Electronics,Detail 2");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'products',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(0, $response->json('imported'));
        $this->assertEquals(2, $response->json('skipped'));
    }

    public function test_import_suppliers_success(): void
    {
        $this->user->givePermissionTo('import-data');

        $file = UploadedFile::fake()->createWithContent('suppliers.csv', "name,tax_id,email,phone,state,city,address\nSupplier 1,TX001,supplier1@test.com,123456789,State 1,City 1,Address 1\nSupplier 2,TX002,supplier2@test.com,987654321,State 2,City 2,Address 2");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'suppliers',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(2, $response->json('imported'));
        $this->assertDatabaseHas('suppliers', ['name' => 'Supplier 1', 'tax_id' => 'TX001']);
        $this->assertDatabaseHas('suppliers', ['name' => 'Supplier 2', 'tax_id' => 'TX002']);
    }

    public function test_import_suppliers_skips_duplicate_tax_id(): void
    {
        $this->user->givePermissionTo('import-data');
        Supplier::factory()->create(['tax_id' => 'TX001']);

        $file = UploadedFile::fake()->createWithContent('suppliers.csv', "name,tax_id,email,phone\nSupplier 1,TX001,supplier1@test.com,123456789\nSupplier 2,TX002,supplier2@test.com,987654321");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'suppliers',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('imported'));
        $this->assertEquals(1, $response->json('skipped'));
    }

    public function test_import_suppliers_skips_missing_required_fields(): void
    {
        $this->user->givePermissionTo('import-data');

        $file = UploadedFile::fake()->createWithContent('suppliers.csv', "name,tax_id,email,phone\n, TX001,supplier1@test.com,123456789\nSupplier 2,,supplier2@test.com,987654321");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'suppliers',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(0, $response->json('imported'));
        $this->assertEquals(2, $response->json('skipped'));
    }

    public function test_import_customers_success(): void
    {
        $this->user->givePermissionTo('import-data');

        $file = UploadedFile::fake()->createWithContent('customers.csv', "name,email,customer_type,tax_id,phone,state,city,address\nCustomer 1,customer1@test.com,1,,123456789,State 1,City 1,Address 1\nCustomer 2,customer2@test.com,2,TX002,987654321,State 2,City 2,Address 2");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'customers',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(2, $response->json('imported'));
        $this->assertDatabaseHas('customers', ['name' => 'Customer 1', 'email' => 'customer1@test.com']);
        $this->assertDatabaseHas('customers', ['name' => 'Customer 2', 'email' => 'customer2@test.com']);
    }

    public function test_import_customers_skips_duplicate_email(): void
    {
        $this->user->givePermissionTo('import-data');
        Customer::factory()->create(['email' => 'customer1@test.com']);

        $file = UploadedFile::fake()->createWithContent('customers.csv', "name,email,customer_type\nCustomer 1,customer1@test.com,1\nCustomer 2,customer2@test.com,1");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'customers',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('imported'));
        $this->assertEquals(1, $response->json('skipped'));
    }

    public function test_import_customers_skips_missing_required_fields(): void
    {
        $this->user->givePermissionTo('import-data');

        $file = UploadedFile::fake()->createWithContent('customers.csv', "name,email,customer_type\n, customer1@test.com,1\nCustomer 2,,1");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'customers',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(0, $response->json('imported'));
        $this->assertEquals(2, $response->json('skipped'));
    }

    public function test_import_customers_requires_tax_id_for_company(): void
    {
        $this->user->givePermissionTo('import-data');

        $file = UploadedFile::fake()->createWithContent('customers.csv', "name,email,customer_type,tax_id\nIndividual,customer1@test.com,1,\nCompany,customer2@test.com,2,");

        $response = $this->actingAs($this->user)->post(route('import.import'), [
            'import_type' => 'customers',
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('imported'));
        $this->assertEquals(1, $response->json('skipped'));
    }
}