<?php
use function GuzzleHttp\json_decode;

set_time_limit (200);
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/login/admin', 'Auth\LoginController@showAdminLoginForm');
Route::post('/login/admin', 'Auth\LoginController@adminLogin');
Route::get('/logout', 'Auth\LoginController@logout');

Route::post(
    'stripe/webhook',
    '\Laravel\Cashier\Http\Controllers\WebhookController@handleWebhook'
);

Route::prefix("admin")->middleware(["auth:admin"])->group(function(){
    Route::get('dashboard', ['as'=>'admin.dashboard', 'uses'=>'Admin\AdminController@dashboard']);
    Route::get('post/create', ['as'=>'admin.post.create', 'uses'=>'Admin\AdminController@createPost']);
    Route::post('post/store', ['as'=>'post.store', 'uses'=>'Admin\AdminController@storePost']);
    Route::get('post/edit/{id}', ['as'=>'post.edit', 'uses'=>'Admin\AdminController@editPost']);
    Route::post('post/edit/{id}',['as'=>'post.edit.store', 'uses'=>'Admin\AdminController@editPostStore']);
    Route::post('post/image/upload', ['as'=>'post.image.store', 'uses'=>'Admin\AdminController@uploadPostImage']);
    Route::post('post/delete/{id}',['as'=>'post.delete', 'uses'=>'Admin\AdminController@deletePost']);
});

Route::get('/', ['as' => 'homepage.index', 'uses' => 'PagesController@index']);
Route::get('/upgrade', ['as' => 'upgrade', 'uses' => 'PagesController@upgrade']);
Route::get('/education', ['as' => 'education', 'uses' => 'PagesController@education']);
Route::get('/pricing', ['as' => 'pricing', 'uses' => 'PagesController@pricing']);
Route::get('/affiliate', ['as' => 'affiliate', 'uses' => 'PagesController@affiliate']);
Route::get('/blog', ['as' => 'blog', 'uses' => 'PagesController@blog']);
Route::get('/social-media-calendar', ['as' => 'products.publisher', 'uses' => 'PagesController@publisher']);
Route::get('/content-curation-tool', ['as' => 'products.content_curation', 'uses' => 'PagesController@content_curation']);
Route::get('/social-listening-tool', ['as' => 'products.social_listening', 'uses' => 'PagesController@social_listening']);
Route::get('/social-media-analytics', ['as' => 'products.analytics', 'uses' => 'PagesController@analytics']);
Route::get('/twitter-booster-app', ['as' => 'products.twitter_booster', 'uses' => 'PagesController@twitter_growth']);
Route::get('/twitter-follower-app', ['as' => 'products.twitter_growth', 'uses' => 'PagesController@twitter_follower']);
Route::get('/twitter-unfollow-app', ['as' => 'products.twitter_unfollow', 'uses' => 'PagesController@twitter_unfollow']);
Route::get('/social-media-management-tools', ['as' => 'products.management_tools', 'uses' => 'PagesController@management_tools']);
Route::get('/article/{id}', ['as' => 'article', 'uses' => 'PagesController@article']);
Route::get('/privacy-policy', function(){
    return view("privacy-policy");
});

Route::get('/test', function(){
    $user = App\Models\User::first();
    $channel = $user->twitterChannels()->latest()->first();
    return $channel->getStatusReplies("pcgamer", "1169144818884329476");

    // return response()->json($team->hasRole("twitter_growth"));
});

Route::get('/mailable', function() {
    return new App\Mail\UserSignUp();
});

Route::get('/jobs', function(){
    return view("frontend.jobs");
});

Route::get('/software-developer', function(){
    return view("frontend.software_developer");
});

Route::post('twitter/login', ['as' => 'twitter.login', 'uses' => 'Twitter\ChannelController@login']);
Route::post('twitter/callback', ['as' => 'twitter.callback', 'uses' => 'Twitter\ChannelController@callback']);
Route::get('twitter/error', ['as' => 'twitter.error', 'Twitter\ChannelController@error']);
Route::get('twitter/logout', ['as' => 'twitter.logout', 'uses' => 'Twitter\ChannelController@error']);

Route::get('facebook/callback', function(Request $request){
    return $request->all();
});

Route::get('facebook/chatbot', 'Facebook\ChatBot\ChatbotController@index');
Route::post('facebook/chatbot', 'Facebook\ChatBot\ChatbotController@index');

Route::get('linkedin/callback', function(Request $request){
    return $request->all();
});

Route::prefix("manage")->middleware(["auth"])->group(function(){
    Route::get('dashboard', ['as' => 'manage.dashboard', 'uses' => 'Twitter\DashboardController@index']);
    Route::get('fans', ['as' => 'manage.fans', 'uses' => 'Twitter\FansController@index']);
    Route::get('non-followers', ['as' => 'manage.nonfollowers', 'uses' => 'Twitter\NonFollowersController@index']);
    Route::get('recent-unfollowers', ['as' => 'manage.recent.unfollowers', 'uses' => 'Twitter\RecentUnfollowersController@index']);
    Route::get('recent-followers', ['as' => 'manage.recent.followers', 'uses' => 'Twitter\RecentFollowersController@index']);
    Route::get('inactive-following', ['as' => 'manage.inactive.following', 'uses' => 'Twitter\InactiveFollowingController@index']);
    Route::get('following', ['as' => 'manage.following', 'uses' => 'Twitter\FollowingController@index']);
    Route::get('whitelist', ['as' => 'manage.whitelist', 'uses' => 'Twitter\WhitelistController@index']);
    Route::get('blacklist', ['as' => 'manage.blacklist', 'uses' => 'Twitter\BlacklistController@index']);
    Route::get('select/{id}', ['as' => 'manage.select', 'uses' => 'Twitter\ChannelController@select']);
    Route::get('account-targets', ['as' => 'manage.account.targets', 'uses' => 'Twitter\AccountTargetsController@index']);
    Route::get('keyword-targets', ['as' => 'manage.keyword.targets', 'uses' => 'Twitter\KeywordTargetsController@index']);
    Route::get('add/account-targets', ['as' => 'add.account.targets', 'uses' => 'Twitter\AccountTargetsController@add']);
    Route::get('show/account-targets', ['as' => 'show.account.targets', 'uses' => 'Twitter\AccountTargetsController@show']);
    Route::get('add/keyword-targets', ['as' => 'add.keyword.targets', 'uses' => 'Twitter\KeywordTargetsController@add']);
    Route::get('show/keyword-targets', ['as' => 'show.keyword.targets', 'uses' => 'Twitter\KeywordTargetsController@show']);

    //POST
    Route::post('store/account-targets', ['as' => 'store.account.targets', 'uses' => 'Twitter\AccountTargetsController@store']);
    Route::delete('destroy/account-targets', ['as' => 'destroy.account.targets', 'uses' => 'Twitter\AccountTargetsController@destroy']);
    Route::post('store/keyword-targets', ['as' => 'store.keyword.targets', 'uses' => 'Twitter\KeywordTargetsController@store']);
    Route::delete('destroy/keyword-targets', ['as' => 'destroy.keyword.targets', 'uses' => 'Twitter\KeywordTargetsController@destroy']);
});

Route::middleware(["auth"])->group(function(){
    Route::post('twitter/follow', ['as' => 'twitter.follow', 'uses' => 'Twitter\Actions\FollowController@follow']);
    Route::post('twitter/unfollow', ['as' => 'twitter.unfollow', 'uses' => 'Twitter\Actions\UnfollowController@unfollow']);
});

Route::prefix("sync")->group(function(){
    Route::post('twitter/follower/ids', ['as' => 'sync.follower.ids', 'uses' => 'Twitter\BackgroundController@syncFollowerIds']);
    Route::post('twitter/following/ids', ['as' => 'sync.following.ids', 'uses' => 'Twitter\BackgroundController@syncFollowingIds']);
    Route::post('/twitter/tweets', ['as' => 'sync.tweets', 'uses' => 'Twitter\BackgroundController@syncTweets']);
    Route::post('/twitter/retweets', ['as' => 'sync.retweets', 'uses' => 'Twitter\BackgroundController@syncRetweets']);
    Route::post('/twitter/likes', ['as' => 'sync.likes', 'uses' => 'Twitter\BackgroundController@syncLikes']);
    Route::post('/facebook/posts', ['as' => 'sync.facebook-posts', 'uses' => 'Facebook\BackgroundController@syncFacebookPosts']);
});

Route::prefix("scheduled")->middleware("auth")->group(function(){
    Route::get('/schedule', ['as' => 'scheduled.schedule', 'uses' => 'ScheduledController@index']);
    Route::get('/past', ['as' => 'scheduled.past', 'uses' => 'ScheduledController@index']);
});

Route::prefix("accounts")->middleware("auth")->group(function(){
    Route::get('/', ['as' => 'accounts', 'uses' => 'AccountsController@index']);
});




Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
