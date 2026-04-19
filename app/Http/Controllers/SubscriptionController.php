<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->user()->subscriptions()->with('category')->orderBy('renewal_date');

        if($request->has('status')) {
            $query->where('status', $request->status);
        }

        if($request->has('category_id')) {
            $query->where('category_id', $request->category_id);   
        }

        $subscriptions = $query->get()->map(function ($sub) {
            return array_merge($sub->toArray(), [
                'days_until_renewal'  => $sub->days_until_renewal,
                'monthly_equivalent'  => $sub->monthly_equivalent,
                'is_overdue'          => $sub->is_overdue,
            ]);
        });
        return response()->json($subscriptions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'currency'      => 'required|string|max:3',
            'billing_cycle' => 'required|in:weekly,monthly,yearly',
            'renewal_date'  => 'required|date',
            'start_date'    => 'required|date',
            'status'        => 'in:active,paused,cancelled',
            'category_id'   => 'nullable|exists:categories,id',
            'website'       => 'nullable|url',
            'logo'          => 'nullable|string',
            'color'         => 'nullable|string',
            'notes'         => 'nullable|string',
            'reminder'      => 'boolean',
            'reminder_days' => 'integer|min:1|max:30',
        ]);

        $subscription = $request->user()
        ->subscriptions()
        ->create($validated);

        return response()->json(
            $subscription->load('category'), 201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Subscription $subscription)
    {
        $this->authorize($request->user(), $subscription);
        return response()->json(
            array_merge($subscription->load('category')->toArray(),[
                'days_until_renewal' => $subscription->days_until_renewal,
                'monthly_equivalent' => $subscription->monthly_equivalent,
                'is_overdue'         => $subscription->is_overdue,
            ])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subscription $subscription)
    {
        $this->authorize($request->user(), $subscription);

        $validated = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'sometimes|numeric|min:0',
            'currency'      => 'sometimes|string|max:3',
            'billing_cycle' => 'sometimes|in:weekly,monthly,yearly',
            'renewal_date'  => 'sometimes|date',
            'start_date'    => 'sometimes|date',
            'status'        => 'sometimes|in:active,paused,cancelled',
            'category_id'   => 'nullable|exists:categories,id',
            'website'       => 'nullable|url',
            'color'         => 'nullable|string',
            'notes'         => 'nullable|string',
            'reminder'      => 'boolean',
            'reminder_days' => 'integer|min:1|max:30',
        ]);
        $subscription->update($validated);

        return response()->json(
            $subscription->load('category')
        );
    }

    /**
     * Remove the specified resource from storage.
     */
       // DELETE /api/subscriptions/{id}
       public function destroy(Request $request, Subscription $subscription)
       {
           $this->authorize($request->user(), $subscription);
           $subscription->delete();
           return response()->json(['message' => 'Deleted successfully']);
       }
   
       // Helper — check ownership
       private function authorize(object $user, Subscription $subscription): void
       {
           if ($subscription->user_id !== $user->id) {
               abort(403, 'Unauthorized');
           }
       }
}
