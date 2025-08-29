<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       if (!Schema::hasColumn('bookmarks', 'deleted_at')) {
            Schema::table('bookmarks', function (Blueprint $table) {
                $table->softDeletes()->after('updated_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('bookmarks', 'deleted_at')) {
            Schema::table('bookmarks', function (Blueprint $table) {
                $table->dropColumn('deleted_at');
            });
        }
    }
};
