<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Admin\Post;
use App\Models\Admin\PostCategory;
use App\Models\Admin\PostTag;
use App\Models\Role;
use App\Models\RoleAddon;
use Carbon\Carbon;
use Yajra\Datatables\Datatables;

class PagesController extends Controller
{

    /**
     * Show homepage
     */
    public function index() {
        return view('frontend.homepage.index');
    }

    public function admin(Request $request) {
        if ($request->ajax()) {
            $users = \DB::table('users')->leftJoin('roles', 'users.role_id', '=', 'roles.id')->select('users.id as id', 'roles.name as role_name', 'users.*')->get();
            $user_ids = [];
            $user_channels = [];
            $results = [];

            foreach($users as $user){
                array_push($user_ids, $user->id);
            }
            
            foreach($user_ids as $user_id){
                if(\DB::table('users')->where('users.id',$user_id)->first()){
                    $channel_items = \DB::table('channels')->where("user_id", $user_id)->get();
                    foreach($channel_items as $channel_item){
                        array_push($user_channels, ['channel_id' => $channel_item->id, 'channel_type' => $channel_item->type]);
                    }
                    
                } else {
                    continue;
                }
            }

            foreach($users as $user){
                $name = explode(" ", $user->name);
                $user_id = $user->id;
                
                $listOfKeywords = '';
                $socialMediaAccounts = '';

                $firstName = '';
                $secondName = '';
                if(count($name) > 1){
                    $firstName = $name[0];
                    $secondName = $name[1];
                } else {
                    $firstName = $name[0];
                    $secondName = '';
                }
                
                $email = $user->email;
                $password = $user->password;
                $signupDate = $user->created_at;
                $currentPlan = $user->role_name;
                $stripeId = $user->stripe_id;
                $trialExpire = $user->trial_ends_at;
                $billinMethod = $user->billing_method;
                $updatedAt = $user->updated_at;
                $nextBillingCycle = '';
                if($billinMethod == 'monthly'){
                    $nextBillingCycle = date("Y-m-d", (strtotime($updatedAt) + 31 * 86400));
                } else if($billinMethod == 'annually') {
                    $nextBillingCycle = date("Y-m-d", (strtotime($updatedAt) + 12 * 31 * 86400));
                }

                $currentTime = Carbon::now()->timestamp;
                $trialExpireTime = strtotime($trialExpire);
                $canceledStatus = $user->cancel_status;
                
                $freeTrial = '';
                $cancelStatus = '';
                
                if($canceledStatus == 0){
                    $cancelStatus = 'No';
                } else {
                    $cancelStatus = 'Yes';
                }
                
                if($currentPlan == 'basic' && $currentTime <= $trialExpireTime){
                    $freeTrial = 'Yes';
                } else {
                    $freeTrial = 'No';
                }

                
                if(\DB::table('users')->leftJoin('topics', 'users.id', '=', 'topics.user_id')->where("users.id", $user_id)->first()){
                    $topic_items = \DB::table('users')->leftJoin('topics', 'users.id', '=', 'topics.user_id')->where("topics.user_id", $user_id)->get();
                    foreach ($topic_items as $topic_item) {
                        $listOfKeywords .= $topic_item->topic . ', <br/>';
                    }
                } else {
                    continue;
                }
    
                foreach($user_channels as $user_channel){
                    if($user_channel['channel_type'] == 'linkedin'){
                        if(\DB::table('users')->leftJoin('channels', 'users.id', '=', 'channels.user_id')->leftJoin('linkedin_channels', 'channels.id', '=', 'linkedin_channels.channel_id')->where('users.id', $user_id)->where('linkedin_channels.channel_id',$user_channel['channel_id'])->first()){
                            $channel_items = \DB::table('users')->select('linkedin_channels.name as channel_name','users.*')->leftJoin('channels', 'users.id', '=', 'channels.user_id')->leftJoin('linkedin_channels', 'channels.id', '=', 'linkedin_channels.channel_id')->where('users.id', $user_id)->where('channels.id',$user_channel['channel_id'])->get();
                            foreach($channel_items as $channel_item){
                                $socialAccountLabel = $channel_item->channel_name . '( linkedin )';
                                $socialMediaAccounts .= $socialAccountLabel . ', <br/>';
                            }
                        } else {
                            continue;
                        }
                    } else if($user_channel['channel_type'] == 'twitter'){
                        if(\DB::table('users')->leftJoin('channels', 'users.id', '=', 'channels.user_id')->leftJoin('twitter_channels', 'channels.id', '=', 'twitter_channels.channel_id')->where('users.id', $user_id)->where('twitter_channels.channel_id',$user_channel['channel_id'])->first()){
                            $channel_items = \DB::table('users')->select('twitter_channels.username as channel_name','users.*')->leftJoin('channels', 'users.id', '=', 'channels.user_id')->leftJoin('twitter_channels', 'channels.id', '=', 'twitter_channels.channel_id')->where('users.id', $user_id)->where('channels.id',$user_channel['channel_id'])->get();
                            foreach($channel_items as $channel_item){
                                $socialAccountLabel = $channel_item->channel_name . '( twitter )';
                                $socialMediaAccounts .= $socialAccountLabel . ', </br>';
                            }
                        } else {
                            continue;
                        }
                    } else {
                        if(\DB::table('users')->leftJoin('channels', 'users.id', '=', 'channels.user_id')->leftJoin('facebook_channels', 'channels.id', '=', 'facebook_channels.channel_id')->where('users.id', $user_id)->where('facebook_channels.channel_id',$user_channel['channel_id'])->first()){
                            $channel_items = \DB::table('users')->select('facebook_channels.name as channel_name','users.*')->leftJoin('channels', 'users.id', '=', 'channels.user_id')->leftJoin('facebook_channels', 'channels.id', '=', 'facebook_channels.channel_id')->where('users.id', $user_id)->where('channels.id',$user_channel['channel_id'])->get();
                            foreach($channel_items as $channel_item){
                                $socialAccountLabel = $channel_item->channel_name . '( facebook )';
                                $socialMediaAccounts .= $socialAccountLabel . ', <br/>';
                            }
                        } else {
                            continue;
                        }
                    }
                    
                }
                
                array_push($results, [
                    'signupDate' => $signupDate,
                    'email' => $email,
                    'password' => $password,
                    'firstName' => $firstName,
                    'secondName' => $secondName,
                    'currentPlan' => $currentPlan,
                    'freeTrial' => $freeTrial,
                    'stripeId' => $stripeId,
                    'trialExpire' => $trialExpire,
                    'socialMediaAccounts' => $socialMediaAccounts,
                    'nextBillingCycle' => $nextBillingCycle,
                    'listOfKeywords' => $listOfKeywords,
                    'cancelStatus' => $cancelStatus,
                ]);
            }
            
            return Datatables::of($results)
                ->addIndexColumn()
                ->addColumn('action', function ($results) {
                    $signupurl = config('app.frontend_url');
                    $pass = base64_encode($results['password']);
                    $btn = '<a href="' .$signupurl.'/autologin/'.$results['email'].'/'.$pass.'" class="edit btn btn-primary btn-sm">Login</a>';
                    return $btn;
                })
                ->setRowAttr([
                    'style' => 'text-align:center',
                ])
                ->addColumn('signupDate', function ($results) {
                    return '<div class="badge badge-success">' . $results['signupDate'] . '</div>';
                })
                ->addColumn('trialExpire', function ($results) {
                    return '<div class="badge badge-success">' . $results['trialExpire'] . '</div>';
                })
                ->addColumn('nextBillingCycle', function ($results) {
                    return '<div class="badge badge-success">' . $results['nextBillingCycle'] . '</div>';
                })
                ->addColumn('socialMediaAccounts', function ($results) {
                    return '<div class="badge badge-success">' . $results['socialMediaAccounts'] . '</div>';
                })
                ->addColumn('listOfKeywords', function ($results) {
                    return '<div class="badge badge-success">' . $results['listOfKeywords'] . '</div>';
                })
                ->rawColumns(['action', 'signupDate', 'trialExpire', 'nextBillingCycle', 'socialMediaAccounts', 'listOfKeywords'])
                ->make(true);
        }
      
        return view('frontend.homepage.admin');
    }

    /**
     *
     * Show upgrade page
     */
    public function upgrade()
    {
    	return view('frontend.upgrade');
    }

    /**
     *
     * Show learning page
     */
    public function education()
    {
    	return view('frontend.education');
    }

    /**
     *
     * Show learning page
     */
    public function pricing()
    {   
        $allPlans = Role::formattedForDisplay();
        $paidPlans = Role::where("name", "!=", "free")->formattedForDisplay();
        $addon = RoleAddon::first();
    	return view('frontend.pricing', compact('allPlans', 'paidPlans', 'addon'));
    }
    
    public function affiliate()
    {   
        $allPlans = Role::formattedForDisplay();
        $paidPlans = Role::where("name", "!=", "free")->formattedForDisplay();
        $addon = RoleAddon::first();
    	return view('frontend.affiliate', compact('allPlans', 'paidPlans', 'addon'));
    }

     /**
     *
     * Show learning page
     */
    public function blog()
    {
        $posts = Post::paginate(5);

    	return view('frontend.blog', compact('posts'));
    }

    /**
     *
     * Show publisher page
     */
    public function publisher()
    {
        return view('frontend.products.publisher');
    }

    /**
     *
     * Show content curation page
     */
    public function content_curation()
    {
        return view( 'frontend.products.content_curation');
    }

    /**
     *
     * Show social listening page
     */
    public function social_listening()
    {
        return view('frontend.products.social_listening');
    }

    /**
     *
     * Show analytics page
     */
    public function analytics()
    {
        return view('frontend.products.analytics');
    }

    /**
     *
     * Show Twitter growth page
     */
    public function twitter_growth()
    {
        return view('frontend.products.twitter_growth');
    }

    /**
     *
     * Show Twitter follower page
     */
    public function twitter_follower()
    {
        return view('frontend.products.twitter_follower');
    }

    /**
     *
     * Show Twitter unfollow page
     */
    public function twitter_unfollow()
    {
        return view('frontend.products.twitter_unfollow');
    }

    /**
     *
     * Show Social Media Management Tools page
     */
    public function management_tools()
    {
        return view('frontend.products.management_tools');
    }

    /**
     *
     * Show Article page
     */
    public function article($id)
    {
        $post = Post::findOrFail($id);
        $categories = PostCategory::all();
        $tags = PostTag::all();
        $recent_posts = Post::whereNotIn('id',[$post->id])->latest()->take(3)->get();

    	return view('frontend.article', compact('post', 'categories', 'tags','recent_posts'));
    }
}
