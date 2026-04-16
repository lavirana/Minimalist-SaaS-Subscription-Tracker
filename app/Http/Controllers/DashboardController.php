<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request){

        $user = $request->user();
        $subscriptions = $user->subscriptions()
                                ->with('category')
                                ->where('status', 'active')
                                ->get();

      $monthlyTotal = $subscriptions->Sum(fn($s) => $s->_monthly_equivalent);
      
      $yearlyTotal = $monthlyTotal * 12;

        // Upcoming renewals (next 7 days)
        $upcoming = $subscriptions
            ->filter(fn($s) => $s->days_until_renewal >= 0
                            && $s->days_until_renewal <= 7)
            ->sortBy('renewal_date')
            ->values();

             // Overdue
        $overdue = $subscriptions
        ->filter(fn($s) => $s->is_overdue)
        ->values();

         // By category
         $byCategory = $subscriptions
         ->groupBy('category_id')
         ->map(fn($group) => [
             'category' => $group->first()->category?->name ?? 'Uncategorized',
             'color'    => $group->first()->category?->color ?? '#6366f1',
             'total'    => $group->sum(fn($s) => $s->monthly_equivalent),
             'count'    => $group->count(),
         ])
         ->values();

         // Most expensive
        $mostExpensive = $subscriptions
        ->sortByDesc('monthly_equivalent')
        ->first();

        return response()->json([
            'monthly_total'   => round($monthlyTotal, 2),
            'yearly_total'    => round($yearlyTotal, 2),
            'active_count'    => $subscriptions->count(),
            'upcoming'        => $upcoming->map(fn($s) => array_merge(
                $s->toArray(),
                ['days_until_renewal' => $s->days_until_renewal]
            )),
            'overdue'         => $overdue,
            'by_category'     => $byCategory,
            'most_expensive'  => $mostExpensive,
        ]);
    }
}
