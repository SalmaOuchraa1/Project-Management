<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Notification;
use App\Models\Project;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function index(){
        return Meeting::all();
    }
    public function store(Request $request){
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'project_id' => 'required|exists:projects,id',
        ]);
        $meeting = Meeting::create([
            'title' => $request->title,
            'description' => $request->description,
            'date' => $request->date,
            'time' => $request->time,
            'project_id' => $request->project_id,
            'created_by' => auth()->id(),
        ]);
        $project = Project::find($request->project_id);
        foreach ($project->users as $user) {
         if ($user->id == auth()->id()) {
            continue;
        }
            Notification::create([
                'message' => 'Nouvelle réunion programmée',
                'user_id' => $user->id,
            ]);
        }
        return response()->json($meeting, 201);
    }
    public function show(Meeting $meeting)
    {
        return $meeting;
    }
    public function update(Request $request, Meeting $meeting)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required',
            'project_id' => 'sometimes|required|exists:projects,id',
        ]);

        $meeting->update([
            'title' => $request->title,
            'description' => $request->description,
            'date' => $request->date,
            'time' => $request->time,
            'project_id' => $request->project_id,
        ]);
        return response()->json($meeting);
    }
    public function destroy(Meeting $meeting)
    {
        $meeting->delete();
        return response()->json([
            'message' => 'Réunion supprimée'
        ]);
    }
}
