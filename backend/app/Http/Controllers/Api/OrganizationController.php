<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        $query = Organization::with(['adviser', 'memberships'])
            ->withCount(['memberships as members_count' => function ($q) {
                $q->where('status', 'approved');
            }]);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return $query->orderBy('name')->paginate(12);
    }

    public function show(Organization $organization)
    {
        return $organization->load([
            'adviser',
            'memberships.user',
            'events' => fn ($q) => $q->orderBy('starts_at')->limit(5),
            'announcements' => fn ($q) => $q->orderByDesc('is_pinned')->orderByDesc('created_at')->limit(5),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate($this->rules());

        $slug = Str::slug($data['name']);
        $base = $slug;
        $i = 1;
        while (Organization::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        $org = Organization::create(array_merge($data, [
            'slug' => $slug,
            'status' => $data['status'] ?? 'active',
        ]));

        return response()->json($org->load('adviser'), 201);
    }

    public function update(Request $request, Organization $organization)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate($this->rules(true));

        $organization->update($data);

        return $organization->fresh()->load('adviser');
    }

    public function destroy(Request $request, Organization $organization)
    {
        $this->authorizeAdmin($request);
        $organization->delete();

        return response()->json(['message' => 'Organization deleted']);
    }

    private function authorizeAdmin(Request $request): void
    {
        if (! $request->user()?->isAdmin()) {
            abort(403, 'Admin access required');
        }
    }

    private function rules(bool $partial = false): array
    {
        $prefix = $partial ? 'sometimes|' : '';
        return [
            'name' => $prefix.'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'org_type' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'founded_year' => 'nullable|integer|min:1900|max:'.(date('Y') + 1),
            'mission' => 'nullable|string',
            'vision' => 'nullable|string',
            'objectives' => 'nullable|string',
            'membership_requirements' => 'nullable|string',
            'meeting_schedule' => 'nullable|string|max:255',
            'office_location' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'adviser_id' => 'nullable|exists:users,id',
            'status' => 'nullable|in:active,inactive',
        ];
    }
}
