<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Event;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
         $admin = User::create([
             'name' => 'Rey Inoc',
             'email' => 'admin@school.edu',
             'password' => Hash::make('password'),
             'student_id' => 'ADMIN001',
             'role' => 'admin',
         ]);

         $student = User::create([
             'name' => 'jemar lee',
             'email' => 'student@school.edu',
             'password' => Hash::make('password'),
             'student_id' => '2024-0001',
             'role' => 'student',
         ]);

         $officer = User::create([
             'name' => 'Louige Pogoy',
             'email' => 'officer@school.edu',
             'password' => Hash::make('password'),
             'student_id' => '2024-0002',
             'role' => 'officer',
         ]);

        $orgs = [
            [
                'name' => 'Computer Science Society',
                'slug' => 'computer-science-society',
                'description' => 'The official academic organization of BS Computer Science students, accredited by the College of Computing and the Office of Student Affairs.',
                'category' => 'Academic',
                'org_type' => 'Academic / Professional',
                'department' => 'College of Computing',
                'founded_year' => 2015,
                'mission' => 'To develop competent, ethical, and innovative computing professionals through collaborative learning and industry engagement.',
                'vision' => 'A leading student-led computing community recognized for excellence in technology and service.',
                'objectives' => "1. Conduct technical workshops and hackathons\n2. Represent CS students in college councils\n3. Partner with IT companies for career talks\n4. Support members in capstone and internship preparation",
                'membership_requirements' => "Enrolled BS Computer Science student\nGPA of 2.0 or higher\nAttend orientation and pay semester membership fee\nNo major disciplinary record",
                'meeting_schedule' => 'Every Friday, 4:00 PM – Room CC-201',
                'office_location' => 'CC Building, Room 105 (Org Office)',
                'contact_email' => 'css@school.edu',
                'contact_phone' => '0917-000-0001',
            ],
            [
                'name' => 'Supreme Student Council',
                'slug' => 'student-council',
                'description' => 'The highest student governing body on campus, elected by the student population and working with school administration on policies, activities, and student welfare.',
                'category' => 'Governance',
                'org_type' => 'Governance',
                'department' => 'Institutional (All Colleges)',
                'founded_year' => 1998,
                'mission' => 'To uphold student rights, promote transparent leadership, and coordinate meaningful campus-wide programs.',
                'vision' => 'Empowered students actively shaping a just, inclusive, and progressive school community.',
                'objectives' => "1. Pass student resolutions and feedback to administration\n2. Manage school-wide events (Foundation Week, elections)\n3. Oversee recognition of college-based student organizations\n4. Operate grievance and suggestion channels",
                'membership_requirements' => "Elected or appointed SSC officer per COMELEC guidelines\nEnrolled student in good standing\nCompletion of leadership training\nCommitment to full academic load compliance",
                'meeting_schedule' => 'Executive board: Monday 3:00 PM · General assembly: monthly',
                'office_location' => 'Student Center, 2nd Floor – SSC Office',
                'contact_email' => 'ssc@school.edu',
                'contact_phone' => '0917-000-0002',
            ],
            [
                'name' => 'Green Earth Advocates',
                'slug' => 'environmental-club',
                'description' => 'A university-wide advocacy organization focused on environmental education, waste reduction, and sustainable campus practices.',
                'category' => 'Advocacy',
                'org_type' => 'Advocacy & Service',
                'department' => 'Cross-college',
                'founded_year' => 2010,
                'mission' => 'To inspire environmental stewardship among students through action, education, and community partnerships.',
                'vision' => 'A carbon-conscious campus where every student practices sustainability daily.',
                'objectives' => "1. Tree planting and coastal clean-up drives\n2. Campus recycling and zero-waste campaigns\n3. Environmental awareness seminars\n4. Policy recommendations to school facilities office",
                'membership_requirements' => "Open to all enrolled students\nAttend one orientation session\nParticipate in at least one service activity per semester",
                'meeting_schedule' => 'Wednesdays, 5:30 PM – Eco Park Pavilion',
                'office_location' => 'Student Affairs Annex, Room 12',
                'contact_email' => 'greenearth@school.edu',
                'contact_phone' => '0917-000-0003',
            ],
        ];

        foreach ($orgs as $data) {
            $org = Organization::create([
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'],
                'category' => $data['category'],
                'org_type' => $data['org_type'],
                'department' => $data['department'],
                'founded_year' => $data['founded_year'],
                'mission' => $data['mission'],
                'vision' => $data['vision'],
                'objectives' => $data['objectives'],
                'membership_requirements' => $data['membership_requirements'],
                'meeting_schedule' => $data['meeting_schedule'],
                'office_location' => $data['office_location'],
                'contact_email' => $data['contact_email'],
                'contact_phone' => $data['contact_phone'],
                'adviser_id' => $admin->id,
                'status' => 'active',
            ]);

            Membership::create([
                'user_id' => $officer->id,
                'organization_id' => $org->id,
                'role' => 'president',
                'status' => 'approved',
            ]);

            Event::create([
                'organization_id' => $org->id,
                'created_by' => $officer->id,
                'title' => 'General Assembly – '.$org->name,
                'description' => 'Mandatory orientation for members: constitution review, activity calendar, and officer introductions.',
                'location' => 'Main Auditorium',
                'starts_at' => now()->addDays(14),
                'ends_at' => now()->addDays(14)->addHours(2),
                'status' => 'scheduled',
            ]);

            Announcement::create([
                'organization_id' => $org->id,
                'author_id' => $officer->id,
                'title' => 'Membership drive – '.$org->name,
                'body' => "We are now accepting new members for this semester.\n\nPlease review membership requirements on our organization profile before applying through the Student Organization System.",
                'is_pinned' => true,
            ]);
        }

        Membership::create([
            'user_id' => $student->id,
            'organization_id' => Organization::first()->id,
            'role' => 'member',
            'status' => 'approved',
        ]);
    }
}
