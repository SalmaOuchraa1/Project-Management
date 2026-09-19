<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectUserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::get('/registration-status', [AuthController::class, 'checkRegistrationStatus']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/project-user', [ProjectUserController::class, 'index']);
    Route::apiResource('users', UserController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::post('/projects/{project}/assign-users', [ProjectController::class, 'assignUsers']);
    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/{task}/attachments', [TaskController::class, 'uploadAttachment']);
    Route::apiResource('notifications', NotificationController::class);
    Route::apiResource('meetings', MeetingController::class);
});
