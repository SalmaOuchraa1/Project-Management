<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $authUser = auth()->user();
        if ($authUser->role === 'admin') {
            return User::where('role', '!=', 'admin')->get();
        }
        if ($authUser->role === 'manager') {
            return User::where('role', 'member')->get();
        }
        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:manager,member',
        ]);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);
        return response()->json($user, 201);
    }
    public function show(User $user)
    {
        return $user;
    }
    public function update(Request $request, User $user)
    {
        $authUser = auth()->user();
        if (
            $authUser->role !== 'admin' &&
            $authUser->id !== $user->id
        ) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
            'role' => 'nullable|in:manager,member',
        ]);
        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];
        if (
            $authUser->role === 'admin' &&
            isset($validated['role'])
        ) {
            $data['role'] = $validated['role'];
        }
        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }
        $user->update($data);
        return response()->json($user);
    }
    public function destroy(User $user)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        $user->delete();
        return response()->json([
            'message' => 'Utilisateur supprimé'
        ]);
    }
}
