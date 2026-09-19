<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->role === 'manager') {

            $tasks = Task::with(['project', 'user', 'attachments'])
                ->whereHas('project', function ($query) use ($user) {
                    $query->where('created_by', $user->id);
                })
                ->get();
            return response()->json($tasks);
        }
        $tasks = Task::with(['project', 'user', 'attachments'])
            ->where('assigned_to', $user->id)
            ->get();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:todo,in_progress,completed',
            'deadline' => 'required|date',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
        ]);
        $project = Project::findOrFail($request->project_id);
        $isMember = $project->users()->where('user_id', auth()->id())->exists();
        if (auth()->user()->role !== 'manager' && !$isMember) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'deadline' => $request->deadline,
            'project_id' => $request->project_id,
            'assigned_to' => $request->assigned_to,
        ]);
        Notification::create([
            'user_id' => $request->assigned_to,
            'message' => "Vous avez été assigné à la tâche : {$task->title}",
        ]);

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $user = auth()->user();
        $project = $task->project;
        $isMember = $project->users()->where('user_id', $user->id)->exists();
        if ($user->role !== 'manager' && !$isMember) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        return $task->load(['project', 'user', 'attachments']);
    }
    public function update(Request $request, Task $task)
    {
        $user = auth()->user();
        if ($user->role === 'member') {
        $project = $task->project;
        $isMember = $project->users()->where('user_id', $user->id)->exists();
        if ($user->role !== 'manager' && !$isMember) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
            $request->validate([
                'status' => 'required|in:todo,in_progress,completed'
            ]);
            $task->update([
                'status' => $request->status
            ]);
            return response()->json($task);
        }
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:todo,in_progress,completed',
            'deadline' => 'sometimes|required|date',
            'assigned_to' => 'sometimes|required|exists:users,id',
        ]);
        $task->update($request->only([
            'title',
            'description',
            'status',
            'deadline',
            'assigned_to',
        ]));
        return response()->json($task);
    }

    public function uploadAttachment(Request $request, Task $task)
    {
        $user = auth()->user();
        $project = $task->project;
        $isMember = $project->users()->where('user_id', $user->id)->exists();
        if ($user->role !== 'manager' && !$isMember) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $request->validate(['file' => 'required|file|mimes:doc,docx,jpg,jpeg,png|max:2000480']);
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('attachments', 'public');
            $attachment = $task->attachments()->create([
                'filename' => $file->getClientOriginalName(),
                'path' => $path,
            ]);
            Notification::create([
                'user_id' => $task->project->created_by,
                'message' => "Un fichier a été ajouté à la tâche : {$task->title}",
            ]);
            return response()->json($attachment, 201);
        }
        return response()->json([
            'message' => 'No file uploaded'
        ], 400);
    }
    public function destroy(Task $task)
    {
        $user = auth()->user();
        if ($user->role !== 'manager') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        $task->delete();
        return response()->json([
            'message' => 'Tâche supprimée'
        ]);
    }
}
