<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    private $user;
    private $selectedChannel;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $this->selectedChannel = $this->user->selectedChannel();
            return $next($request);
        });
    }

    public function profile()
    {
        $topics = $this->user->topics;
        $locations = $this->user->locations;
        $role = $this->user->role()->with("permissions")->first();
        $roleAddons = $this->user->roleAddons()->with("permissions")->get();
        $currentPLan = $this->user->role_id;
        $activeSubscription = $this->user->subscribed('main');
        $onGracePeriod = $this->user->subscribed('main') ? $this->user->subscription('main')->onGracePeriod() : false;
        $addon = $this->user->subscribed('addon') ? $this->user->subscription('addon') : null;
        $addonTrial = $this->user->roleAddons()->where("trial_ends_at", ">", Carbon::now())->whereNotNull("trial_ends_at")->exists();
        $activeAddon = $this->user->subscribed('addon') || $addonTrial;
        $addonOnGracePeriod = $this->user->subscribed('addon') ? $this->user->subscription('addon')->onGracePeriod() : false;
        $trial_ends_at = strtotime($this->user->getRemainDate());
        $current_date = Carbon::now()->timestamp;
        $remain_date = intval(($trial_ends_at - $current_date) / 86400) + 1;
        
        $subscription = [
            "currentPlan" => $currentPLan,
            "activeSubscription" => $activeSubscription,
            "onGracePeriod" => $onGracePeriod,
            "annual" => $activeSubscription ? strrpos($this->user->subscription("main")->stripe_plan, "annual") !== false : false,
        ];

        $addon = [
            "addon" => $addon,
            "activeAddon" => $activeAddon,
            "addonOnGracePeriod" => $addonOnGracePeriod,
            "addonTrial" => $addonTrial,
        ];

        return response()->json([
            "user" => $this->user,
            "topics" => $topics,
            "locations" => $locations,
            "role" => $role,
            "roleAddons" => $roleAddons,
            "subscription" => $subscription,
            "addon" => $addon,
            "remain_date" => $remain_date
        ]);
    }

    public function update(Request $request)
    {
        try {
            $user = $this->user;
            $data = $request->input('data');

            foreach ($data as $key => $value) {

                if ($key == "topics" || $key == "locations") {
                    continue;
                }

                if ($key == "reason") {
                    $key = "usage_reason";
                }

                $user->{$key} = $value ? $value : $user->{$key};
            }

            $user->save();

            if (array_key_exists("organization_name", $data)) {
                $user->teams()->updateOrCreate(
                    ['user_id' => $user->id],
                    ['name' => $data["organization_name"]]
                );
            }

            if (array_key_exists("topics", $data)) {
                $user->topics()->delete();
                collect($data["topics"])->map(function ($topic) use ($user) {
                    $user->topics()->create([
                        'topic' => $topic,
                    ]);
                });

                $topics = $user->topics()->pluck("topic");
                multiRequest(route('articles.sync'), $topics);
            }

            if (array_key_exists("locations", $data)) {
                $user->locations()->delete();
                collect($data["locations"])->map(function ($location) use ($user) {

                    $location = [
                        'label' => $location['label'],
                        'location' => $location['location'],
                    ];

                    $user->locations()->create([
                        'location' => json_encode($location),
                    ]);
                });
            }

        } catch (\Exception $e) {

            return getErrorResponse($e, $this->selectedChannel);
        }

        return response()->json(['message' => 'Profile updated successfully.']);
    }

    public function updateTimeZone(Request $request)
    {
        try {
            $user = $this->user;
            $data = $request->input('timezone');

            $user->timezone = $data;

            $user->save();

        } catch (\Exception $e) {

            return getErrorResponse($e, $this->selectedChannel);
        }

        return response()->json(['message' => 'Timezone updated successfully.']);
    }
}
