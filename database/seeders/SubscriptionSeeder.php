<?php
namespace Database\Seeders;

use App\Models\Subscription;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        // Demo user banao
        $user = User::firstOrCreate(
            ['email' => 'demo@demo.com'],
            [
                'name'     => 'Demo User',
                'password' => bcrypt('password123'),
            ]
        );

        // Categories by name — no user_id needed now!
        $entertainment = Category::where('name', 'Entertainment')->first();
        $work          = Category::where('name', 'Work & Tools')->first();
        $ai            = Category::where('name', 'AI & Tech')->first();
        $cloud         = Category::where('name', 'Cloud & Hosting')->first();
        $education     = Category::where('name', 'Education')->first();

        $subscriptions = [
            [
                'category_id'   => $entertainment?->id,
                'name'          => 'Netflix',
                'description'   => 'Standard with ads plan',
                'price'         => 499,
                'currency'      => 'INR',
                'billing_cycle' => 'monthly',
                'renewal_date'  => Carbon::now()->addDays(5)->format('Y-m-d'),
                'start_date'    => Carbon::now()->subMonths(6)->format('Y-m-d'),
                'status'        => 'active',
                'website'       => 'https://netflix.com',
                'color'         => '#E50914',
                'logo'          => '🎬',
                'reminder'      => true,
                'reminder_days' => 3,
            ],
            [
                'category_id'   => $entertainment?->id,
                'name'          => 'Spotify',
                'description'   => 'Premium Individual',
                'price'         => 119,
                'currency'      => 'INR',
                'billing_cycle' => 'monthly',
                'renewal_date'  => Carbon::now()->addDays(12)->format('Y-m-d'),
                'start_date'    => Carbon::now()->subMonths(4)->format('Y-m-d'),
                'status'        => 'active',
                'website'       => 'https://spotify.com',
                'color'         => '#1DB954',
                'logo'          => '🎵',
                'reminder'      => true,
                'reminder_days' => 2,
            ],
            [
                'category_id'   => $work?->id,
                'name'          => 'GitHub Pro',
                'description'   => 'Pro plan for developers',
                'price'         => 333,
                'currency'      => 'INR',
                'billing_cycle' => 'monthly',
                'renewal_date'  => Carbon::now()->addDays(2)->format('Y-m-d'),
                'start_date'    => Carbon::now()->subYear()->format('Y-m-d'),
                'status'        => 'active',
                'website'       => 'https://github.com',
                'color'         => '#24292e',
                'logo'          => '🐙',
                'reminder'      => true,
                'reminder_days' => 3,
            ],
            [
                'category_id'   => $ai?->id,
                'name'          => 'ChatGPT Plus',
                'description'   => 'GPT-4o access',
                'price'         => 1672,
                'currency'      => 'INR',
                'billing_cycle' => 'monthly',
                'renewal_date'  => Carbon::now()->addDays(8)->format('Y-m-d'),
                'start_date'    => Carbon::now()->subMonths(3)->format('Y-m-d'),
                'status'        => 'active',
                'website'       => 'https://chat.openai.com',
                'color'         => '#74AA9C',
                'logo'          => '🤖',
                'reminder'      => true,
                'reminder_days' => 3,
            ],
            [
                'category_id'   => $ai?->id,
                'name'          => 'Claude Pro',
                'description'   => 'Anthropic Claude Pro',
                'price'         => 1672,
                'currency'      => 'INR',
                'billing_cycle' => 'monthly',
                'renewal_date'  => Carbon::now()->addDays(15)->format('Y-m-d'),
                'start_date'    => Carbon::now()->subMonths(2)->format('Y-m-d'),
                'status'        => 'active',
                'website'       => 'https://claude.ai',
                'color'         => '#D97757',
                'logo'          => '🧠',
                'reminder'      => true,
                'reminder_days' => 3,
            ],
            [
                'category_id'   => $cloud?->id,
                'name'          => 'AWS',
                'description'   => 'EC2 + S3 usage',
                'price'         => 2500,
                'currency'      => 'INR',
                'billing_cycle' => 'monthly',
                'renewal_date'  => Carbon::now()->addDays(3)->format('Y-m-d'),
                'start_date'    => Carbon::now()->subMonths(8)->format('Y-m-d'),
                'status'        => 'active',
                'website'       => 'https://aws.amazon.com',
                'color'         => '#FF9900',
                'logo'          => '☁️',
                'reminder'      => true,
                'reminder_days' => 5,
            ],
            [
                'category_id'   => $education?->id,
                'name'          => 'Udemy',
                'description'   => 'Personal Plan',
                'price'         => 2400,
                'currency'      => 'INR',
                'billing_cycle' => 'yearly',
                'renewal_date'  => Carbon::now()->addMonths(4)->format('Y-m-d'),
                'start_date'    => Carbon::now()->subMonths(8)->format('Y-m-d'),
                'status'        => 'active',
                'website'       => 'https://udemy.com',
                'color'         => '#A435F0',
                'logo'          => '📚',
                'reminder'      => true,
                'reminder_days' => 7,
            ],
            [
                'category_id'   => $work?->id,
                'name'          => 'Figma',
                'description'   => 'Professional plan',
                'price'         => 1200,
                'currency'      => 'INR',
                'billing_cycle' => 'monthly',
                'renewal_date'  => Carbon::now()->subDays(2)->format('Y-m-d'),
                'start_date'    => Carbon::now()->subMonths(5)->format('Y-m-d'),
                'status'        => 'active',
                'website'       => 'https://figma.com',
                'color'         => '#F24E1E',
                'logo'          => '🎨',
                'reminder'      => true,
                'reminder_days' => 3,
            ],
        ];

        foreach ($subscriptions as $sub) {
            Subscription::create(
                array_merge($sub, ['user_id' => $user->id])
            );
        }

        $this->command->info('Subscriptions seeded!');
    }
}