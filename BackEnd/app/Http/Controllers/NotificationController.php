<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{

    public function index()
    {
        return Notification::where('user_id', auth()->id())->get();
    }

    public function show(Notification $notification)
    {
        return $notification;
    }

    public function update(Request $request, Notification $notification)
    {
        $notification->update(['is_read' => true]);
        return response()->json($notification);
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return response()->json([
            'message' => 'Notification supprimée'
        ]);
    }
}
