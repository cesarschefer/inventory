<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Group;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

#[Group('valid')]
#[Group('user')]
class UserTest extends TestCase
{
    private User $user;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_guests_cannot_access_users(): void
    {
        $this->get(route('users.index'))->assertRedirect(route('login'));
    }

    public function test_authorized_users_can_view_users_index(): void
    {
        $this->user->givePermissionTo('manage-users');
        User::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->get(route('users.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('user/index')
            ->has('users.data', 6)
        );
    }

    public function test_authorized_users_can_view_users_with_pagination(): void
    {
        $this->user->givePermissionTo('manage-users');
        User::factory()->count(25)->create();

        $response = $this->actingAs($this->user)->get(route('users.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('user/index')
            ->has('users.data', 10)
            ->where('users.current_page', 1)
            ->where('users.last_page', 3)
        );
    }

    public function test_users_index_returns_available_roles(): void
    {
        $this->user->givePermissionTo('manage-users');

        $response = $this->actingAs($this->user)->get(route('users.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('availableRoles')
            ->where('availableRoles', fn ($roles) => count($roles) > 0)
        );
    }

    public function test_users_can_be_filtered_by_name(): void
    {
        $this->user->givePermissionTo('manage-users');
        User::factory()->create(['name' => 'John Doe']);
        User::factory()->create(['name' => 'Jane Smith']);

        $response = $this->actingAs($this->user)->get(route('users.index', ['name' => 'John']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'John Doe')
        );
    }

    public function test_users_can_be_filtered_by_email(): void
    {
        $this->user->givePermissionTo('manage-users');
        User::factory()->create(['email' => 'john.doe@example.com']);
        User::factory()->create(['email' => 'jane.smith@example.com']);

        $response = $this->actingAs($this->user)->get(route('users.index', ['email' => 'john']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.email', 'john.doe@example.com')
        );
    }

    public function test_users_can_be_filtered_by_multiple_filters(): void
    {
        $this->user->givePermissionTo('manage-users');
        User::factory()->create(['name' => 'John', 'email' => 'john.doe@test.com']);
        User::factory()->create(['name' => 'John', 'email' => 'other@test.com']);
        User::factory()->create(['name' => 'Jane', 'email' => 'jane@test.com']);

        $response = $this->actingAs($this->user)->get(route('users.index', [
            'name' => 'John',
            'email' => 'john.doe',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'John')
            ->where('users.data.0.email', 'john.doe@test.com')
        );
    }

    public function test_authorized_user_can_assign_roles_to_user(): void
    {
        $this->user->givePermissionTo('manage-users');
        $targetUser = User::factory()->create();
        $role = Role::create(['name' => 'admin']);

        $response = $this->actingAs($this->user)->put(route('users.roles.update', $targetUser), [
            'roles' => [$role->id],
        ]);

        $response->assertRedirectBack();
        $this->assertTrue($targetUser->hasRole('admin'));
    }

    public function test_authorized_user_can_assign_multiple_roles_to_user(): void
    {
        $this->user->givePermissionTo('manage-users');
        $targetUser = User::factory()->create();
        $role1 = Role::create(['name' => 'admin']);
        $role2 = Role::create(['name' => 'editor']);

        $response = $this->actingAs($this->user)->put(route('users.roles.update', $targetUser), [
            'roles' => [$role1->id, $role2->id],
        ]);

        $response->assertRedirectBack();
        $this->assertTrue($targetUser->hasRole('admin'));
        $this->assertTrue($targetUser->hasRole('editor'));
    }

    public function test_authorized_user_can_sync_roles_to_user(): void
    {
        $this->user->givePermissionTo('manage-users');
        $targetUser = User::factory()->create();
        $oldRole = Role::create(['name' => 'old-role']);
        $targetUser->assignRole($oldRole);
        $newRole = Role::create(['name' => 'new-role']);

        $response = $this->actingAs($this->user)->put(route('users.roles.update', $targetUser), [
            'roles' => [$newRole->id],
        ]);

        $response->assertRedirectBack();
        $this->assertFalse($targetUser->hasRole('old-role'));
        $this->assertTrue($targetUser->hasRole('new-role'));
    }

    public function test_unauthorized_user_cannot_assign_roles(): void
    {
        $targetUser = User::factory()->create();
        $role = Role::create(['name' => 'admin']);

        $response = $this->actingAs($this->user)->put(route('users.roles.update', $targetUser), [
            'roles' => [$role->id],
        ]);

        $response->assertStatus(403);
    }
}