<?php

namespace Tests\Unit\Actions\User;

use App\Actions\User\GetPaginatedUsers;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Group;
use Tests\TestCase;

#[Group('valid')]
#[Group('user')]
class GetPaginatedUsersTest extends TestCase
{
    use RefreshDatabase;

    private GetPaginatedUsers $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = app(GetPaginatedUsers::class);
    }

    public function test_it_can_get_paginated_users(): void
    {
        User::factory()->count(15)->create();

        $result = $this->action->execute([
            'name' => '',
            'email' => '',
            'page' => 1,
        ]);

        $this->assertCount(10, $result['users']['data']);
        $this->assertEquals(15, $result['users']['total']);
    }

    public function test_it_can_filter_users_by_name(): void
    {
        User::factory()->create(['name' => 'John Doe']);
        User::factory()->create(['name' => 'Jane Smith']);

        $result = $this->action->execute([
            'name' => 'John',
            'email' => '',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['users']['data']);
        $this->assertEquals('John Doe', $result['users']['data'][0]['name']);
    }


    public function test_it_can_filter_users_by_email(): void
    {
        User::factory()->create(['email' => 'john.doe@example.com']);
        User::factory()->create(['email' => 'jane.smith@example.com']);

        $result = $this->action->execute([
            'name' => '',
            'email' => 'john',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['users']['data']);
        $this->assertEquals('john.doe@example.com', $result['users']['data'][0]['email']);
    }

    public function test_it_can_filter_users_by_multiple_filters(): void
    {
        User::factory()->create(['name' => 'John', 'email' => 'john.doe@example.com']);
        User::factory()->create(['name' => 'John', 'email' => 'other@example.com']);
        User::factory()->create(['name' => 'Jane', 'email' => 'jane.doe@example.com']);

        $result = $this->action->execute([
            'name' => 'John',
            'email' => 'john.doe',
            'page' => 1,
        ]);

        $this->assertCount(1, $result['users']['data']);
        $this->assertEquals('John', $result['users']['data'][0]['name']);
        $this->assertEquals('john.doe@example.com', $result['users']['data'][0]['email']);
    }

    public function test_it_returns_empty_results_when_no_matches(): void
    {
        User::factory()->count(3)->create();

        $result = $this->action->execute([
            'name' => 'NonExistent',
            'email' => '',
            'page' => 1,
        ]);

        $this->assertCount(0, $result['users']['data']);
        $this->assertEquals(0, $result['users']['total']);
    }

    public function test_it_returns_pagination_metadata(): void
    {
        User::factory()->count(25)->create();

        $result = $this->action->execute([
            'name' => '',
            'email' => '',
            'page' => 1,
        ]);

        $this->assertEquals(1, $result['users']['current_page']);
        $this->assertEquals(3, $result['users']['last_page']);
        $this->assertEquals(10, $result['users']['per_page']);
    }

    public function test_it_can_paginate_through_results(): void
    {
        User::factory()->count(25)->create();

        $page1 = $this->action->execute([
            'name' => '',
            'email' => '',
            'page' => 1,
        ]);

        $page2 = $this->action->execute([
            'name' => '',
            'email' => '',
            'page' => 2,
        ]);

        $this->assertNotEquals(
            $page1['users']['data'][0]['id'],
            $page2['users']['data'][0]['id']
        );
    }

    public function test_it_orders_users_by_name(): void
    {
        User::factory()->create(['name' => 'Zebra']);
        User::factory()->create(['name' => 'Alpha']);
        User::factory()->create(['name' => 'Beta']);

        $result = $this->action->execute([
            'name' => '',
            'email' => '',
            'page' => 1,
        ]);

        $this->assertEquals('Alpha', $result['users']['data'][0]['name']);
        $this->assertEquals('Beta', $result['users']['data'][1]['name']);
        $this->assertEquals('Zebra', $result['users']['data'][2]['name']);
    }

    public function test_it_loads_roles_with_users(): void
    {
        $user = User::factory()->create();
        $role = \Spatie\Permission\Models\Role::create(['name' => 'admin']);
        $user->assignRole($role);

        $result = $this->action->execute([
            'name' => '',
            'email' => '',
            'page' => 1,
        ]);

        $this->assertArrayHasKey('roles', $result['users']['data'][0]);
    }
}