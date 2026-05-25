<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Organization;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with(['organization', 'author'])
            ->orderByDesc('is_pinned')
            ->orderByDesc('created_at');

        if ($orgId = $request->query('organization_id')) {
            $query->where('organization_id', $orgId);
        }

        return $query->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'is_pinned' => 'boolean',
        ]);

        $org = Organization::findOrFail($data['organization_id']);
        $this->authorizeOfficer($request, $org);

        $announcement = Announcement::create(array_merge($data, [
            'author_id' => $request->user()->id,
            'is_pinned' => $data['is_pinned'] ?? false,
        ]));

        return response()->json($announcement->load(['organization', 'author']), 201);
    }

    public function destroy(Request $request, Announcement $announcement)
    {
        $this->authorizeOfficer($request, $announcement->organization);
        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted']);
    }

    private function authorizeOfficer(Request $request, Organization $organization): void
    {
        $user = $request->user();
        if ($user->isAdmin() || $user->isOfficerOf($organization)) {
            return;
        }
        abort(403, 'Officer access required');
    }
}
