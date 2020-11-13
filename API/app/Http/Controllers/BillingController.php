<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\RoleAddon;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\FeedbackSendMail;
use Exception;

class BillingController extends Controller
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

    /**
     * Get all billing plans
     *
     */
    public function getPlans()
    {
        $plans = Role::all();
        $currentPLan = $this->user->role_id;
        $activeSubscription = $this->user->subscribed('main');
        $onGracePeriod = $this->user->subscribed('main') ? $this->user->subscription('main')->onGracePeriod() : false;
        $addon = $this->user->subscribed('addon') ? $this->user->subscription('addon') : null;
        $activeAddon = $this->user->subscribed('addon');
        $addonOnGracePeriod = $this->user->subscribed('addon') ? $this->user->subscription('addon')->onGracePeriod() : false;

        $subscription = [
            "currentPlan" => $currentPLan,
            "activeSubscription" => $activeSubscription,
            "onGracePeriod" => $onGracePeriod,
        ];

        $addon = [
            "addon" => $addon,
            "activeAddon" => $activeAddon,
            "addonOnGracePeriod" => $addonOnGracePeriod
        ];

        return ["plans"=>$plans, "subscription"=>$subscription, "addon"=>$addon];
    }

    public function getPlanData() {
        $allPlans = Role::formattedForDisplay();
        $paidPlans = Role::where("name", "!=", "free")->formattedForDisplay();
        $addon = RoleAddon::first();
    	return compact('allPlans', 'paidPlans', 'addon');
    }

    public function createSubscription(Request $request)
    {
        $token = $request->input('token');
        $plan = $token['plan'];
        $trialDays = $token['trialDays'];
        $subType = $token['subType'];
        $id = $token['id'];
        $couponCode = $token['couponCode'];
        $user = $this->user;

        try {

            if ($trialDays != "0") {
                $user->newSubscription($subType, $plan)->trialDays($trialDays)->create($id);
            } else {
                // If the user was invited, we want to send the id in the metadata
                // so first promoter can track it
                if ($user->isInvited) {
                    $user
                        ->newSubscription($subType, $plan)
                        ->withCoupon($couponCode)
                        ->withMetadata(['fp_uid' => $user->id])
                        ->create($id);
                } else {
                    $user->newSubscription($subType, $plan)->withCoupon($couponCode)->create($id);
                }
            }

            $roles = explode("_", $plan);
            $roleName = '';
            $rolePeriod = '';
            if(count($roles) > 1){
                $roleName = $roles[0];
                $rolePeriod = 'annually';
            } else {
                $roleName = $roles[0];
                $rolePeriod = 'monthly';
            }

            if($subType == "main"){
                $role = Role::where("name", $roleName)->first();
                if (!$role) return response()->json(["error" => "Plan not found"], 404);

                $user->role_id = $role->id;
                $user->billing_method = $rolePeriod;
                $user->cancel_status = 0;
                $user->save();
            }
            elseif($subType == "addon"){

                $roleAddon = RoleAddon::where("name", $plan)->first();
                if (!$roleAddon) return response()->json(["error" => "Addon not found"], 404);

                $user->roleAddons()->attach($roleAddon->id);

                return response()->json(["success" => true], 200);
            }

        } catch (\Throwable $th) {
            return response()->json(["error" => $th->getMessage()], 500);
        }

    }

    public function cancelSubscription(Request $request)
    {
        try {

            $feedback = $request->input('feedback');
            $user = $this->user;

            Mail::raw($feedback, function($message)
            {
                $user = $this->user;
                $message->subject('Feedback');
                $message->from( $user->email, 'Uniclix');
                $message->to('info@uniclixapp.com');
            });

            $user->cancel_status = 1;
            $user->feedback = $feedback;

            $user->subscription('main')->cancel();
            $user->save();

            return response()->json(["success" => true], 200);
        } catch (\Throwable $th) {
            return response()->json(["error" => "Something went wrong!"], 404);
        }
    }

    public function deleteSubscription()
    {
        try {
            $user = $this->user;

            //$user->deletePaymentMethods();

            return response()->json(["success" => true], 200);
        } catch (\Throwable $th) {
            return response()->json(["error" => "Something went wrong!"], 404);
        }
    }

    public function addSubscription(Request $request)
    {
        try {
            $token = $request->input('token');
            $id = $token['id'];
            $user = $this->user;
            //$user->createSetupIntent();
            return response()->json(["success" => true], 200);
        } catch (\Throwable $th) {
            return response()->json(["error" => "Something went wrong!"], 404);
        }
    }

    public function resumeSubscription(Request $request)
    {
        try {
            $user = $this->user;

            $user->subscription($request->input('type'))->resume();
            $user->cancel_status = 0;
            $user->save();

            return response()->json(["success" => true], 200);
        } catch (\Throwable $th) {
            return response()->json(["error" => "Something went wrong!"], 404);
        }
    }

    public function updateSubscription(Request $request)
    {
        $token = $request->input('token');
        $plan = $token['plan'];
        $trialDays = $token['trialDays'];
        $subType = $token['subType'];
        $id = $token['id'];
        $couponCode = $token['couponCode'];
        $user = $this->user;

        try {

            if($trialDays != "0"){
                $user->newSubscription($subType, $plan)->trialDays($trialDays)->create($id);
            } else {
                $user->newSubscription($subType, $plan)->withCoupon($couponCode)->create($id);
            }

            $roles = explode("_", $plan);
            $roleName = '';
            $rolePeriod = '';
            if(count($roles) > 1){
                $roleName = $roles[0];
                $rolePeriod = 'annually';
            } else {
                $roleName = $roles[0];
                $rolePeriod = 'monthly';
            }

            if($subType == "main"){
                $role = Role::where("name", $roleName)->first();
                if (!$role) return response()->json(["error" => "Plan not found"], 404);

                $user->role_id = $role->id;
                $user->billing_method = $rolePeriod;
                $user->save();
            }
            elseif($subType == "addon"){

                $roleAddon = RoleAddon::where("name", $plan)->first();
                if (!$roleAddon) return response()->json(["error" => "Addon not found"], 404);

                $user->roleAddons()->attach($roleAddon->id);

                return response()->json(["success" => true], 200);
            }

        } catch (\Throwable $th) {
            return response()->json(["error" => $th->getMessage()], 500);
        }

    }

    public function changePlan(Request $request)
    {
        $plan = $request->input('plan');
        $roleName = explode("_", $plan)[0];
        $role = Role::where("name", $roleName)->first();
        $user = $this->user;
        $current_role_name = $this->user->role->name;
        $channels_count = $user->countChannels();
        if(!$role) return response()->json(["error" => "Plan not found"], 404);

        if($current_role_name == 'premium'){
            if($channels_count > $role->roleLimit->account_limit)
            return response()->json(["message" => "more than 5 accounts", "accounts" => 5], 432);
            if($user->teamMembers()->count() + 1 > $role->roleLimit->team_accounts)
            return response()->json(["message" => 'team members limit'], 433);
        } else if($current_role_name == 'pro') {
            if($channels_count > $role->roleLimit->account_limit)
            return response()->json(["message" => "more than 20 accounts", "accounts" => 20], 432);
            if($user->teamMembers()->count() + 1 > $role->roleLimit->team_accounts)
            return response()->json(["message" => 'team members limit'], 433);
        }

        if($plan !== 'free') $user->subscription('main')->swap($plan);
        else $user->subscription('main')->cancel();

        $user->role_id = $role->id;
        $user->save();

        return response()->json(["success" => true], 200);
    }

    public function activateAddon(Request $request)
    {
        $addon = $request->input('addon');
        $roleAddon = RoleAddon::where("name", $addon)->first();
        if(!$roleAddon) return response()->json(["error" => "Addon not found"], 404);;

        $user = $this->user;
        $user->roleAddons()->attach($roleAddon->id);

        $userAddon = \DB::table('user_role_addons')->where("addon_id", $roleAddon->id)->where("user_id", $user->id)->first();

        if($userAddon && is_null($userAddon->trial_ends_at) && !$user->subscribed("addon")){
            \DB::table('user_role_addons')->where("addon_id", $roleAddon->id)->where("user_id", $user->id)->update(["trial_ends_at" => Carbon::now()->addDays($roleAddon->trial_days)]);
        }

        return response()->json(["success" => true], 200);
    }

    public function cancelAddon(Request $request)
    {
        try {
            $user = $this->user;

            $user->subscription('addon')->cancel();

            $addon = $request->input('addon');
            $roleAddon = RoleAddon::where("name", $addon)->first();
            if (!$roleAddon) return response()->json(["error" => "Addon not found"], 404);;

            $user = $this->user;
            $user->roleAddons()->detach($roleAddon->id);

            return response()->json(["success" => true], 200);

            return response()->json(["success" => true], 200);
        } catch (\Throwable $th) {
            return response()->json(["error" => "Something went wrong!"], 500);
        }
    }

    public function getCoupon(Request $request)
    {
        $client = new Client(['base_uri' => 'https://api.stripe.com']);

        //We fetch that particular discount.
        try{

            $response = $client->request('GET', '/v1/coupons/' . $request->id, [
                'headers' => ['Authorization' => 'Bearer ' . env('STRIPE_SECRET')]
            ]);

            if($response->getStatusCode() == 200){

                $content = json_decode($response->getBody()->getContents());

                //I return the discount, so we may properly add it to the payment
                return response()->json(["discount" => $content->percent_off], 200);
            }

            return response()->json(["discount" => null], 200);

        }catch (\Exception $e){
            \Log::info('Coupon validation error: ' . $e->getMessage());

            return response()->json(["discount" => null], 200);
        }
    }
}
