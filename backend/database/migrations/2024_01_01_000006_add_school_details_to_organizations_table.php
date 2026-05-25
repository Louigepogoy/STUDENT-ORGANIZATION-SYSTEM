<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('org_type')->nullable()->after('category');
            $table->string('department')->nullable()->after('org_type');
            $table->unsignedSmallInteger('founded_year')->nullable()->after('department');
            $table->text('mission')->nullable()->after('description');
            $table->text('vision')->nullable()->after('mission');
            $table->text('objectives')->nullable()->after('vision');
            $table->text('membership_requirements')->nullable()->after('objectives');
            $table->string('meeting_schedule')->nullable()->after('membership_requirements');
            $table->string('office_location')->nullable()->after('meeting_schedule');
            $table->string('contact_email')->nullable()->after('office_location');
            $table->string('contact_phone')->nullable()->after('contact_email');
        });
    }

    public function down()
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn([
                'org_type',
                'department',
                'founded_year',
                'mission',
                'vision',
                'objectives',
                'membership_requirements',
                'meeting_schedule',
                'office_location',
                'contact_email',
                'contact_phone',
            ]);
        });
    }
};
