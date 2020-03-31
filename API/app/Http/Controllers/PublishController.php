<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Channel;
use App\Models\ScheduledPost;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Notifications\PublishApprovalNotification;
use App\Notifications\PostApprovedNotification;
use App\Models\Admin\PostCategory;
use App\Models\Hashtag;

class PublishController extends Controller
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

            if ($this->user) {
                $this->selectedChannel = $this->user->selectedChannel();
            }

            return $next($request);
        });
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $currentChannel = $this->selectedChannel;
        try {
            $post = $request->input('post');
            $scheduled = $post['scheduled'];
            $channels = $post['publishChannels'];
            $images = $post['images'];
            $publishType = $post['publishType'];
            $scheduledTime = Carbon::parse($scheduled['publishUTCDateTime'])->format("Y-m-d H:i:s");
            $uploadedImages = $this->uploadImages($images);
            $bestTime = false;
            $permissionLevel = "publisher";
            $failedChannels = [];
            $channelCount = 0;
            $postId = '';
            $channelsCount = count($channels);
            
            if($post['type'] == 'store'){
                $postId = uniqid();
            } else if($post['type'] == 'edit') {
                $postId = $post['id'];
            }
            
            foreach ($channels as $channel) {
                $boards = false;

                if ($channel["type"] == "pinterest" && !isset($channel["selectedBoards"])) {
                    continue;
                }

                if (isset($channel["selectedBoards"])) {
                    $boards = $channel["selectedBoards"];
                }

                $channel = Channel::find($channel['id']);
                if ($channelCount < 1) $channel->select();

                $postLimit = $channel->user->getLimit("posts_per_account");
                $permissionLevel = $this->user->hasPublishPermission($channel);

                if ($postLimit < 10000) {
                    $scheduledPosts = $channel->scheduledPosts()->latest()->take($postLimit)->get()->reverse();
                    if ($firstOfThisMonth = $scheduledPosts->first()) {
                        if (Carbon::parse($firstOfThisMonth->created_at)->addDays(30) >= Carbon::now() && $scheduledPosts->count() >= $postLimit) {
                            return response()->json(['error' => 'You have exceeded the post limit for this month.'], 403);
                            // $channel->details = $channel->details;
                            // $failedChannels[] = $channel;
                            // continue;
                        }
                    }
                }

                $currentChannel = $channel;
                $networkContent = strtolower($channel->type) . "Content";
                $networkPictures = strtolower($channel->type) . "Pictures";
                $publishTime = Carbon::now();

                if (isset($post[$networkPictures])) {

                    $images = $post[$networkPictures];

                    if (count($images)) {
                        $uploadedImages = $this->uploadImages($images);
                    }
                }

                $payload = [
                    'images' => $uploadedImages,
                    'scheduled' => $scheduled
                ];

                if ($boards) {
                    $payload["boards"] = $boards;
                }

                if ($publishType == "date") {

                    $publishTime = $scheduledTime;
                } else if ($publishType == "best") {

                    if (!$bestTime) {

                        $latestScheduledPost = $channel->scheduledPosts()
                            ->where("scheduled_at", ">", Carbon::now())
                            ->orderBy("scheduled_at", "desc")->first();

                        if ($latestScheduledPost) {

                            $publishTime = Carbon::parse($latestScheduledPost->scheduled_at)->addHours(mt_rand(1, 12))->addMinutes(mt_rand(0, 59));
                        } else {

                            $publishTime = Carbon::now()->addHours(mt_rand(1, 12))->addMinutes(mt_rand(0, 59));
                        }

                        $bestTime = $publishTime;
                    } else {
                        $publishTime = $bestTime;
                    }
                } else if ($publishType == "now") {

                    if (!$bestTime) {
                        $publishTime = Carbon::now();
                        $bestTime = $publishTime;
                    } else {
                        $publishTime = $bestTime;
                    }
                }

                $publishOriginalTime = Carbon::parse($publishTime)->setTimezone($scheduled['publishTimezone']);

                $postData = [
                    'content' => isset($post[$networkContent]) ? $post[$networkContent] : $post['content'] ? $post['content'] : '',
                    'scheduled_at' => $publishTime,
                    'scheduled_at_original' => $publishOriginalTime,
                    'payload' => serialize($payload),
                    'approved' => $permissionLevel ? 1 : 0,
                    'posted' => $publishType == 'now' ? 1 : 0,
                    //'posted' => 0,
                    'article_id' => $post['articleId'] ? $post['articleId'] : null,
                    'category_id' => $post['category_id'] ? $post['category_id'] : null,
                    'post_id' => $postId
                ];

                if ($post['type'] == 'edit') {
                    $posts = $this->user->getAllScheduledPosts()->where("post_id", $post['id']);
                    $account_count = count($posts->where("channel_id", $channel['id']));
                    $posts_approved = $posts->first();
                    $item_post = $posts->where("channel_id", $channel['id'])->first();
                    $item_approved_post = $posts->where("channel_id", $channel['id'])->where("approved", 0)->first();
                    $scheduledPost = $item_post->update($postData);
                    if ($posts_approved->approved == 0) {
                        if($account_count < $channelsCount){
                            if($posts->where("channel_id", $channel['id'])->where("approved", 0)->count() > 0){
                                $scheduledPost = $item_approved_post->update($postData);
                            } else {
                                $scheduledPost = $channel->scheduledPosts()->create($postData);
                            }   
                        } else {
                            foreach($posts as $post) {
                                if($channel['id'] == $post->channel_id){
                                $item_approved_post->update($postData);
                                } else {
                                    $post->delete();
                                }
                            }                            
                        }
                    } else if ($this->user->hasPublishPermission($channel)) {
                        if($account_count < $channelsCount){
                            if($posts->where("channel_id", $channel['id'])->count() > 0){
                                $scheduledPost = $item_post->update($postData);
                            } else {
                                $scheduledPost = $channel->scheduledPosts()->create($postData);
                            }   
                        } else {
                            foreach($posts as $post) {
                                if($channel['id'] == $post->channel_id){
                                $item_post->update($postData);
                                } else {
                                    $post->delete();
                                }
                            }                            
                        }
                    } else {
                        return response()->json(["error" => "You don't have permission to perform this action."], 401);
                    }
                } else {
                    $scheduledPost = $channel->scheduledPosts()->create($postData);
                }

                if (!$permissionLevel && $post['type'] !== 'edit') {
                    $channel->user->notify(new PublishApprovalNotification());
                }

                $channelCount++;
                if($publishType == 'now'){
                    
                    $channel->details->publishScheduledPost($scheduledPost);
                }
            }
        } catch (\Exception $e) {
            return getErrorResponse($e, $currentChannel);
        }

        return response()->json(['message' => 'Your post was successfuly stored!', 'failedChannels' => $failedChannels]);
    }


    private function uploadImages($images)
    {
        $uploadedImages = [];

        foreach ($images as $image) {
            if (str_contains($image, "http") && str_contains($image, "storage")) {

                $relativePath = 'storage' . explode('storage', $image)[1];

                $uploadedImages[] = [
                    'relativePath' => $relativePath,
                    'absolutePath' => $image
                ];
            } else {
                if (str_contains($image, "http")) {
                    $contents = file_get_contents($image);
                    $name = substr($image, strrpos($image, '/') + 1);
                    $imageName = str_contains($name, "?") ? explode("?", $name)[0] : $name;
                    $imageName = str_random(35) . "-" . $imageName;
                } else if(!empty($image)){
                    $imageData = explode(',', $image);
                    $imageBase64 = $imageData[1];
                    $imageInfo = explode(';', $imageData[0]);
                    $imageOriginalName = explode('.', $imageInfo[1]);
                    $imageExtension = $imageOriginalName[1];
                    $contents = base64_decode($imageBase64);
                    $imageName = str_random(35) . '.' . $imageExtension;
                } else if(empty($image)){
                    continue;
                }

                $today = Carbon::today();
                $uploadPath = "public/$today->year/$today->month/$today->day/$imageName";

                \Storage::put($uploadPath, $contents);

                $relativePublicPath = str_replace("public", "storage", $uploadPath);

                $uploadedImages[] = [
                    'relativePath' => $relativePublicPath,
                    'absolutePath' => \URL::to('/') . '/' . $relativePublicPath
                ];
            }
        }

        return $uploadedImages;
    }

    public function publish(Request $request)
    {
        $scheduledPost = unserialize($request->input('item'));
        if (!$scheduledPost) return;

        $channel = Channel::find($scheduledPost->channel_id);

        if ($channel) {
            try {
                $channel->details->publishScheduledPost($scheduledPost);
            } catch (\Exception $e) {
                getErrorResponse($e, $channel);
                throw $e;
            }
        }
    }

    public function postNow($postId)
    {
        if (!$this->user->hasPublishPermission($this->selectedChannel))
            return response()->json(["error" => "Publisher permission required."], 403);

        if ($this->selectedChannel) {

            try {
                $scheduledPost = $this->selectedChannel->scheduledPosts()->find($postId);
                $this->selectedChannel->details->publishScheduledPost($scheduledPost);
            } catch (\Exception $e) {
                return getErrorResponse($e, $this->selectedChannel);
            }
        }
    }

    public function approve($postId)
    {
        if (!$this->user->hasPublishPermission($this->selectedChannel))
            return response()->json(["error" => "You don't have permission to approve posts."], 403);

        if ($this->selectedChannel) {

            try {
                $scheduledPost = $this->selectedChannel->scheduledPosts()->find($postId);
                $scheduledPost->approved = 1;
                $scheduledPost->save();

                //$this->user->notify(new PostApprovedNotification());
            } catch (\Exception $e) {
                return getErrorResponse($e, $this->selectedChannel);
            }
        }
    }

    public function destroy($postId)
    {
        if (!$this->user->hasPublishPermission($this->selectedChannel))
            return response()->json(["error" => "Publisher permission required."], 403);

        if ($this->selectedChannel) {
            try {
                $posts = $this->user->getAllScheduledPosts()->where("post_id", $postId);
                foreach($posts as $post) {
                    $payload = unserialize($post->payload);
                    $images = $payload['images'];
                    foreach ($images as $image) {
                        $filePath = str_replace("storage", "public", $image['relativePath']);
                        \Storage::delete($filePath);
                    }
                    $post->delete();
                }
            } catch (\Exception $e) {
                return getErrorResponse($e, $this->selectedChannel);
            }
        }
    }

    public function getPostCategory()
    {
        try {
            $post_categories = PostCategory::all();
            return response()->json(["categories" => $post_categories]);
        } catch (\Exception $e) {
            return getErrorResponse($e);
        }
    }

    public function getHashtags()
    {
        try {
            $hashtags = Hashtag::all();
            return response()->json(["hashtags" => $hashtags]);
        } catch (\Exception $e) {
            return getErrorResponse($e);
        }
    }
}
