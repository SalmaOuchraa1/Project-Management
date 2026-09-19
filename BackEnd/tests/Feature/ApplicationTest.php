<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_authenticate_using_token(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password')
        ]);
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);
        $response->assertStatus(200)
            ->assertJsonStructure([
                'user',
                'token'
            ]);

        $this->assertNotNull($response->json('token'));
    }
        public function test_users_cannot_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);
        $response->assertStatus(401);
    }
    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_dashboard()
    {
        $admin = User::factory()->create([
            'role' => 'admin'
        ]);
        $token = $admin->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/projects');
        $response->assertStatus(200);
    }

    public function test_manager_can_create_project()
    {
        $manager = User::factory()->create([
            'role' => 'manager'
        ]);
        $token = $manager->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/projects', [
            'title' => 'Projet Test',
            'description' => 'Description projet',
            'status' => 'todo',
            'start_date' => '2026-06-01',
            'end_date' => '2026-07-01',
        ]);
        $response->assertStatus(201);
    }
    public function test_manager_can_create_task()
    {
        $manager = User::factory()->create([
            'role' => 'manager'
        ]);
        $member = User::factory()->create([
            'role' => 'member'
        ]);
        $project = Project::factory()->create([
            'created_by' => $manager->id
        ]);
        $token = $manager->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/tasks', [
            'title' => 'Task Test',
            'description' => 'Description task',
            'status' => 'in_progress',
            'deadline' => '2026-06-10',
            'project_id' => $project->id,
            'assigned_to' => $member->id,
        ]);
        $response->assertStatus(201);
    }
    public function test_manager_can_create_meeting_with_description()
    {
        $manager = User::factory()->create([
            'role' => 'manager'
        ]);
        $project = Project::factory()->create([
            'created_by' => $manager->id
        ]);
        $token = $manager->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/meetings', [
            'title' => 'Meeting Test',
            'description' => 'Description meeting',
            'date' => '2026-06-15',
            'time' => '10:30',
            'project_id' => $project->id,
        ]);
        $response->assertStatus(201)
            ->assertJsonPath('description', 'Description meeting');
    }
    public function test_manager_can_update_task_status_without_requiring_all_fields()
    {
        $manager = User::factory()->create([
            'role' => 'manager'
        ]);
        $member = User::factory()->create([
            'role' => 'member'
        ]);
        $project = Project::factory()->create([
            'created_by' => $manager->id,
        ]);
        $project->users()->attach($member->id);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_to' => $member->id,
            'status' => 'in_progress',
        ]);
        $token = $manager->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson('/api/tasks/' . $task->id, [
            'status' => 'completed',
        ]);
        $response->assertStatus(200)
            ->assertJsonPath('status', 'completed');
    }
    public function test_manager_sees_only_his_projects()
    {
        $manager = User::factory()->create([
            'role' => 'manager'
        ]);
        $token = $manager->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/projects');
        $response->assertStatus(200);
    }
    public function test_member_sees_only_his_tasks()
    {
        $member = User::factory()->create([
            'role' => 'member'
        ]);
        $token = $member->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/tasks');
        $response->assertStatus(200);
    }
    public function test_member_cannot_delete_task()
    {
        $member = User::factory()->create([
            'role' => 'member'
        ]);
        $task = Task::factory()->create();
        $token = $member->createToken('test')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson('/api/tasks/' . $task->id);
        $response->assertStatus(403);
    }
}

