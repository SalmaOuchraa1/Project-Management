<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class ProjectUserController extends Controller
{

    public function index()
    {
        $projectUsers = DB::table('project_user')->get();
        return response()->json($projectUsers);
    }

    
}
