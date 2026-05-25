<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\Organization;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function myMemberships(Request $request)
    {
        return $request->user()
            ->memberships()
            ->with('organization')
            ->orderByDesc('created_at')
            ->get();
    }

    public function join(Request $request, Organization $organization)
    {
        $data = $request->validate([
            'message' => 'nullable|string|max:500',
        ]);

        $existing = Membership::where('user_id', $request->user()->id)
            ->where('organization_id', $organization->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already applied or are a member'], 422);
        }

        $membership = Membership::create([
            'user_id' => $request->user()->id,
            'organization_id' => $organization->id,
            'role' => 'member',
            'status' => 'pending',
            'message' => $data['message'] ?? null,
        ]);

        return response()->json($membership->load('organization'), 201);
    }

    public function pending(Request $request, Organization $organization)
    {
        $this->authorizeOfficer($request, $organization);

        return Membership::with('user')
            ->where('organization_id', $organization->id)
            ->where('status', 'pending')
            ->orderBy('created_at')
            ->get();
    }

    public function updateStatus(Request $request, Membership $membership)
    {
        $this->authorizeOfficer($request, $membership->organization);

        $data = $request->validate([
            'status' => 'required|in:approved,rejected',
            'role' => 'nullable|in:member,officer,president',
        ]);

        $membership->update([
            'status' => $data['status'],
            'role' => $data['role'] ?? $membership->role,
        ]);

        return $membership->load(['user', 'organization']);
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
