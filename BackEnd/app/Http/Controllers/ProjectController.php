<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->role === 'admin') {
            return Project::with('creator', 'users')->get();
        }
        if ($user->role === 'manager') {
            return Project::with('creator', 'users')
                ->where('created_by', $user->id)
                ->get();
        }
        return Project::with('creator', 'users')
            ->whereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();
    }

    public function assignUsers(Request $request, Project $project)
    {
        $request->validate([
            'users' => 'required|array'
        ]);
        $users = array_merge([auth()->id()], $request->users);
        $project->users()->sync($users);
        foreach ($request->users as $userId) {
            if ($userId != auth()->id()) {
                Notification::create([
                    'user_id' => $userId,
                    'message' => "Vous avez été ajouté au projet : {$project->title}",
                    'is_read' => false
                ]);
            }
        }
        return response()->json($project->load('creator', 'users'));
    }
    public function store(Request $request)
    {
        $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'start_date' => 'required|date',
        'end_date' => 'required|date',
        'status' => 'required|in:todo,in_progress,completed',
        ]);
        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'created_by' => auth()->id(),
        ]);
            $project->users()->attach(
        auth()->id()
    );

    return response()->json(
        $project->load(
            'creator',
            'users'
            ),201
        );
    }
    public function show(Project $project)
    {
        return $project->load('creator', 'users', 'tasks', 'meetings');
    }
    public function update(Request $request, Project $project)
    {
        $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'start_date' => 'required|date',
        'end_date' => 'required|date',
        'status' => 'required|in:todo,in_progress,completed',
        ]);
        $project->update([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);
        return response()->json($project);
    }
    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json([
            'message' => 'Projet supprimé'
        ]);
    }
}
