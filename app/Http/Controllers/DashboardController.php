<?php

namespace App\Http\Controllers; // This tells laravel where this files lives in your project.

use Illuminate\Http\Request; //this allows the code to read data sent from your react frontend.

use Carbon\Carbon; //Carbon is a tool used for handling dates (like calculating if a renewal is tomorrow)

class DashboardController extends Controller
{

    //fn() the arrow function
    //This is the function that react calls to get dashboard numbers.
    public function stats(Request $request){

        $user = $request->user(); //this gets the information of the person currently logged in

        //this tells the database : get all subscriptions belonging to this user that have a category and an active status.
        $subscriptions = $user->subscriptions()
                                ->with('category')
                                ->where('status', 'active')
                                ->get();

      $monthlyTotal = $subscriptions->Sum(fn($s) => $s->_monthly_equivalent); //It looks at every active subscription and adds up their monthly cost into one big total.
      
      $yearlyTotal = $monthlyTotal * 12; //It takes that monthly total and multiplies it by 12 to show how much the user spends in a year.

        // Upcoming renewals (next 7 days)
        //This checks for payment due between today (0 days) and the next 7 days. 
        $upcoming = $subscriptions
            ->filter(fn($s) => $s->days_until_renewal >= 0
                            && $s->days_until_renewal <= 7)
            ->sortBy('renewal_date') //it puts the most urgent ones at the top of the list.
            ->values();

             // Overdue - This creates a list of subscriptions where the payment date has already passed, but they aren't marked as paid yet.
        $overdue = $subscriptions
        ->filter(fn($s) => $s->is_overdue)
        ->values();

         // By category - This gathers subscriptions into groups (like "Entertainment" or "Work")
         // map - map() (The Transformer) The map function is used when you want to change the items or create a completely new list based on the old one.
         
         $byCategory = $subscriptions
         ->groupBy('category_id')
         ->map(fn($group) => [
             'category' => $group->first()->category?->name ?? 'Uncategorized',
             'color'    => $group->first()->category?->color ?? '#6366f1',
             'total'    => $group->sum(fn($s) => $s->monthly_equivalent), //For each group, it calculates the total cost. This is what you would use to make a Pie Chart in React.
             'count'    => $group->count(),
         ])
         ->values();

         // Most expensive - This finds the single subscription that costs the most money per month (like an expensive AWS bill or Netflix Premium).
        $mostExpensive = $subscriptions
        ->sortByDesc('monthly_equivalent')
        ->first();

        //This is the final step. It packs all the calculated numbers and lists into a clean "JSON package."
        return response()->json([
            'monthly_total'   => round($monthlyTotal, 2), //It makes sure the money has only 2 decimal places (e.g., $19.99 instead of $19.99123).
            'yearly_total'    => round($yearlyTotal, 2), // It makes sure the money has only 2 decimal places (e.g., $19.99 instead of $19.99123).
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
