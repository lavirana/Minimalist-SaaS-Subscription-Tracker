<?php
namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // No user_id — global categories!
        $categories = [
            ['name' => 'Entertainment',    'color' => '#EF4444', 'icon' => '🎬'],
            ['name' => 'Work & Tools',     'color' => '#3B82F6', 'icon' => '💼'],
            ['name' => 'AI & Tech',        'color' => '#8B5CF6', 'icon' => '🤖'],
            ['name' => 'Cloud & Hosting',  'color' => '#06B6D4', 'icon' => '☁️'],
            ['name' => 'Education',        'color' => '#F59E0B', 'icon' => '📚'],
            ['name' => 'Health & Fitness', 'color' => '#10B981', 'icon' => '🏥'],
            ['name' => 'Communication',    'color' => '#EC4899', 'icon' => '📱'],
            ['name' => 'Security',         'color' => '#6366F1', 'icon' => '🔒'],
            ['name' => 'Finance',          'color' => '#F97316', 'icon' => '💰'],
            ['name' => 'Other',            'color' => '#94A3B8', 'icon' => '📦'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['name' => $cat['name']],
                $cat
            );
        }

        $this->command->info('Categories seeded!');
    }
}