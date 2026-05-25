<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Organization;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with(['organization', 'creator'])
            ->orderBy('starts_at');

        if ($orgId = $request->query('organization_id')) {
            $query->where('organization_id', $orgId);
        }

        if ($request->query('upcoming')) {
            $query->where('starts_at', '>=', now());
        }

        return $query->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'status' => 'nullable|in:scheduled,cancelled,completed',
        ]);

        $org = Organization::findOrFail($data['organization_id']);
        $this->authorizeOfficer($request, $org);

        $event = Event::create(array_merge($data, [
            'created_by' => $request->user()->id,
            'status' => $data['status'] ?? 'scheduled',
        ]));

        return response()->json($event->load(['organization', 'creator']), 201);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorizeOfficer($request, $event->organization);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'starts_at' => 'sometimes|date',
            'ends_at' => 'nullable|date',
            'status' => 'nullable|in:scheduled,cancelled,completed',
        ]);

        $event->update($data);

        return $event->fresh()->load(['organization', 'creator']);
    }

    public function destroy(Request $request, Event $event)
    {
        $this->authorizeOfficer($request, $event->organization);
        $event->delete();

        return response()->json(['message' => 'Event deleted']);
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
