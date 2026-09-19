<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [

            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status' => 'todo',
            'deadline' => now()->addDays(7),
            'project_id' => Project::factory(),
            'assigned_to' => User::factory(),
        ];
    }
}
