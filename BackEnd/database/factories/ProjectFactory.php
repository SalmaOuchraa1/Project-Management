<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status' => 'todo',
            'start_date' => now(),
            'end_date' => now()->addDays(30),
            'created_by' => User::factory(),
        ];
    }
}
