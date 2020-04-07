<?php

namespace App\Traits\Facebook;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use SammyK\LaravelFacebookSdk\LaravelFacebookSdk as Facebook;
use Laravel\Socialite\Facades\Socialite;

trait FacebookTrait
{
    /**
     * Used to switch between users by using their corresponding
     * access fokens for login
     */
    public function setAsCurrentUser($token = false)
    {
        try {
            $token = $token ? $token : $this->access_token;

            $fb = app(Facebook::class);
            $fb->setDefaultAccessToken($token);

            return $fb;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function getProfile(){
        $user = Socialite::driver("facebook")->userFromToken($this->access_token);
        return $user;
    }

    public function getInfoById($id){
        $key = "$id-facebookDetails";
        $minutes = 1;
        return Cache::remember($key, $minutes, function () use ($id){
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/$id?fields=about,picture,name,bio,company_overview,cover,description,general_info,genre,products,website,fan_count");
    
            return $response->getDecodedBody();
        });
    }

    public function getSimpleInfoById($id){
        $key = "$id-facebookDetails2";
        $minutes = 1;
        return Cache::remember($key, $minutes, function () use ($id){
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/$id?fields=about,picture,name,cover");
    
            return $response->getDecodedBody();
        });
    }

    public function getPages(){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get('/me/accounts?fields=access_token,picture,name');

        return $response->getDecodedBody();
    }

    public function getGroups(){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get('/me/groups?fields=owner,picture,name');

        return $response->getDecodedBody();
    }

    public function getPosts($since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/posts?since={$since}&until={$until}&fields=message,attachments,created_time,to,from{id,name,picture},shares,comments.summary(true),reactions.summary(true)");

        return $response->getDecodedBody();
    }

    public function getTimeline($params = []){

        $pageId = $this->original_id;
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        $key = $pageId . "-timeline-$maxId";
        $after = $maxId ? "&after=$maxId" : "";
        $minutes = 1;
        return Cache::remember($key, $minutes, function () use ($pageId, $after){
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/{$pageId}/feed?fields=message,attachments,created_time,to,from{id,name,picture},shares{link},likes.summary(true),comments.summary(true)$after");

            return $response->getDecodedBody();
        });
    }

    public function getMyPosts($params = []){

        $pageId = $this->original_id;
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        $key = $pageId . "-myPosts-$maxId";
        $after = $maxId ? "&after=$maxId" : "";
        $minutes = 1;
        return Cache::remember($key, $minutes, function () use ($pageId, $after) {
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/{$pageId}/posts?fields=message,attachments,created_time,to,from{id,name,picture},shares{link},likes.summary(true),comments.summary(true)$after");

            return $response->getDecodedBody();
        });
    }

    public function getPageFeed($params = []){

        $pageId = isset($params["q"]) ? $params["q"] : $this->original_id;
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        $key = $pageId . "-pageFeed-$maxId";
        $after = $maxId ? "&after=$maxId" : "";
        $minutes = 1;
        return Cache::remember($key, $minutes, function () use ($pageId, $after) {
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/{$pageId}/posts?fields=message,attachments,created_time,to,from{id,name,picture},shares{link},likes.summary(true),comments.summary(true)$after");

            return $response->getDecodedBody();
        });
    }

    public function getPagePosts($since = null, $until = null, $params = [], $pageId = "", $limit = 100){

        $pageId = $pageId ? $pageId : $this->original_id;
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        $key = $pageId . "-getPagePosts-$maxId-$since-$until";
        $after = $maxId ? "&after=$maxId" : "";
        $limit = "&limit=".$limit;
        $minutes = 1;
        return Cache::remember($key, $minutes, function () use ($pageId, $after, $since, $until, $limit) {
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/{$pageId}/posts?since={$since}&until={$until}&fields=message,attachments,created_time,to,from{id,name,picture},shares{link},likes.summary(true),comments.summary(true),reactions.summary(true)$limit$after");

            return $response->getDecodedBody();
        });
    }

    public function searchPages($params = []){
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        $query = isset($params["q"]) ? $params["q"] : "";
        $after = $maxId ? "&after=$maxId" : "";
        $key = $query . "-search-$maxId";
        $minutes = 1;
        return Cache::remember($key, $minutes, function () use ($after, $query) {
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/pages/search?q=$query$after");
    
            return $response->getDecodedBody();
        });
    }

    public function getUnpublished($params = []){
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        $key = $this->id . "-unpublished-$maxId";
        $after = $maxId ? "&after=$maxId" : "";
        $minutes = 1;
        return Cache::remember($key, $minutes, function () use ($after) {
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/{$this->original_id}/promotable_posts?fields=message,attachments,created_time,to,from{id,name,picture},shares{link},likes.summary(true),comments.summary(true)$after");

            return $response->getDecodedBody();
        });
    }

    public function getMentions($params = []){
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        $pageId = $this->original_id;
        $key = $pageId . "-mentions-$maxId";
        $after = $maxId ? "&after=$maxId" : "";
        $minutes = 1;

        return Cache::remember($key, $minutes, function () use ($pageId, $after) {
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("/{$pageId}/tagged?fields=message,attachments,created_time,to,from{id,name,picture},shares{link},likes.summary(true),comments.summary(true)$after");

            return $response->getDecodedBody();
        });
    }

    public function getConversations($params = []){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/me/conversations?fields=id,link,updated_time");
        $response = $response->getDecodedBody();

        if(!isset($response["data"])) return [];

        $feed = [];
        foreach($response["data"] as $conversation){
            $conversation["messages"] = $this->getMessages($conversation["id"]);
            $feed[] = $conversation;
        }

        return $feed;
    }

    public function getMessages($conversationId){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$conversationId}/messages?fields=message,attachments,created_time,to,from{id,name,picture},shares{link}");

        return $response->getDecodedBody();
    }

    public function sendMessage($conversationId, $message){
        $fb = $this->setAsCurrentUser();
        $response = $fb->post("/{$conversationId}/messages", $message);

        return $response->getDecodedBody();
    }

    public function getComments($postId){
        $fb = $this->setAsCurrentUser();
        $comments = $fb->get("/{$postId}/comments?summary=1&filter=toplevel");
        $comments = $comments->getDecodedBody();
        $comments = isset($comments['data']) ? $comments['data'] : [];

        //if(count($comments) && !isset($comments[0]['from'])) return [];

        $response = array_map(function($comment){
            //$comment['replies'] = $this->getComments($comment['id']);
            if(!isset($comment['from'])) return $comment;
            $comment['from'] = $this->getSimpleInfoById($comment['from']['id']);
            return $comment;
        }, $comments);

        return $response;
    }

    public function postComment($postId, $comment){
        $fb = $this->setAsCurrentUser();
        $response = $fb->post("/{$postId}/comments", $comment);

        return $response->getDecodedBody();
    }

    public function getActivities(){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/1864596630495909/feed?");

        return $response->getDecodedBody();
    }

    public function pageLikes($period='day', $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/?metric=page_fans&since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageNewLikes($period = 'day', $since = null, $until = null)
    {
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_fan_adds_unique/{$period}");

        return $response->getDecodedBody();
    }

    public function pageNewUniqueLikes($period = 'day', $since = null, $until = null)
    {
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/?metric=page_fan_adds_unique&since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageUnlikes($period){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_fan_removes_unique/{$period}");

        return $response->getDecodedBody();
    }

    public function pageEngagement($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_engaged_users?{$period}&since={$since}&until={$until}");

        return $response->getDecodedBody();
    }

    public function pageImpressions($since = null, $until = null)
    {
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_impressions?since={$since}&until={$until}&period=day");

        return $response->getDecodedBody();
    }

    public function pageLikeReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_like_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageLoveReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_love_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageWowReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_wow_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageHahaReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_haha_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageSorryReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_sorry_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pageAngerReactions($period, $since=null, $until=null){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_actions_post_reactions_anger_total?since={$since}&until={$until}&period={$period}");

        return $response->getDecodedBody();
    }

    public function pagePostEngagements($period){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$this->original_id}/insights/page_post_engagements/{$period}");

        return $response->getDecodedBody();
    }

    public function postComments($object_id){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$object_id}/comments");

        return $response->getDecodedBody();
    }

    public function postReactions($object_id){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$object_id}/reactions");

        return $response->getDecodedBody();
    }

    public function postShares($object_id){
        $fb = $this->setAsCurrentUser();
        $response = $fb->get("/{$object_id}/sharedposts");

        return $response->getDecodedBody();
    }

    public function pageTotalReactions($period){
        $like = $this->pageLikeReactions($period)['data'][0]['values'][1]['value'];
        $love = $this->pageLoveReactions($period)['data'][0]['values'][1]['value'];
        $wow = $this->pageWowReactions($period)['data'][0]['values'][1]['value'];
        $haha = $this->pageHahaReactions($period)['data'][0]['values'][1]['value'];
        $sorry = $this->pageSorryReactions($period)['data'][0]['values'][1]['value'];
        $anger = $this->pageAngerReactions($period)['data'][0]['values'][1]['value'];

        $total = $like+$love+$wow+$haha+$sorry+$anger;

        return $total;

    }

    public function getNonProfileAvatar()
    {
       try{
            $fb = $this->setAsCurrentUser();
            $response = $fb->get("$this->original_id/?fields=picture");
            $data = $response->getDecodedBody();

           if($data){
                return $data["picture"]["data"]["url"];
           }
       }catch(\Exception $e){
            //throw $e;
       }

        return "";
    }

    public function getProfileAvatar()
    {
        try{
            $profile = Socialite::driver("facebook")->userFromToken($this->access_token);

            if($profile){
                return $profile->avatar;
            }

        }catch(\Exception $e){

        }

        return "";
    }

    public function likePost($postId)
    {
        $fb = $this->setAsCurrentUser();
        $response = $fb->post("$postId/likes");

        return $response->getDecodedBody();
    }

    public function unlikePost($postId)
    {
        $fb = $this->setAsCurrentUser();
        $response = $fb->delete("$postId/likes");

        return $response->getDecodedBody();
    }

    public function deletePost($postId)
    {
        $fb = $this->setAsCurrentUser();
        $response = $fb->delete("$postId");

        return $response->getDecodedBody();
    }


    public function getAvatar(){
        try{
            $key = $this->id . "-facebookAvatar";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () {
                $avatar = "";
                if($this->account_type == "profile"){
                    $avatar = $this->getProfileAvatar();
                }else{
                    $avatar = $this->getNonProfileAvatar();
                }

                if($avatar){
                    return $avatar;
                }

                return public_path()."/images/dummy_profile.png";
            });
        }catch(\Exception $e){
            getErrorResponse($e, $this->global);
            return false;
        }
    }

    /**
     * @param array $media
     * @return mixed
     */
    public function uploadMedia($media)
    {
        $fb = $this->setAsCurrentUser($this->access_token);
        $response = $fb->post("/{$this->original_id}/photos", $media);
        return $response->getDecodedBody();
    }

        /**
     * @param string $image base64 encoded
     * @return mixed
     */
    public function uploadFile($image)
    {
        try{
            $imageData = explode(',', $image);

            if(count($imageData) > 1){
                $imageBase64 = $imageData[1];
                $imageInfo = explode(';', $imageData[0]);
                $imageOriginalName = explode('.',$imageInfo[1]);
                $imageExtension = $imageOriginalName[1];
                $contents = base64_decode($imageBase64);
                $imageName = str_random(35).'.'.$imageExtension;
            }else{
                $contents = base64_decode($image);
                $f = finfo_open();
                $mimeType = finfo_buffer($f, $contents, FILEINFO_MIME_TYPE);
                $imageExtension = explode("/", $mimeType)[1];
                $imageName = str_random(35).'.'.$imageExtension;
            }

            $today = Carbon::today();
            $uploadPath = "public/$today->year/$today->month/$today->day/$imageName";

            \Storage::put($uploadPath, $contents);

            $relativePublicPath = str_replace("public", "storage", $uploadPath);

            $uploadedImage = [
                'relativePath' => $relativePublicPath,
                'absolutePath' => \URL::to('/').'/'.$relativePublicPath
            ];

            $response = $this->uploadMedia(["url" => $uploadedImage["absolutePath"], "published" => false]);

            \Storage::delete($uploadPath);

            return $response;
        }catch(\Exception $e){
            return false;
        }
    }

        /**
     * @param array $tweet
     * @return mixed
     */
    public function publish($post)
    {
        $fb = $this->setAsCurrentUser($this->access_token);
        $response = $fb->post("/{$this->original_id}/feed", $post);
        return $response->getDecodedBody();
    }

    /**
     * @param object ScheduledPost
     * @return mixed
     */
    public function publishScheduledPost($scheduledPost)
    {
        try{
            $payload = unserialize($scheduledPost->payload);
            $images = $payload['images'];
            $timezone = $payload['scheduled']['publishTimezone'];
            $appUrl = config("app.url");
            $mediaIds = [];
            $mediaCount = 0;
            foreach($images as $image){
                $relativePath = $image['relativePath'];
                $fullPath = $appUrl."/".$relativePath;
                $media = ["url" => $fullPath, "published" => false];
                $uploadResponse = $this->uploadMedia($media);
                $mediaId = $uploadResponse['id'];
                $mediaIds["attached_media[$mediaCount]"] = "{'media_fbid': '$mediaId'}";
                $mediaCount++;
            }

            $text = $scheduledPost->content;
            $link = findUrlInText($text);

            if($link){
                $text = str_replace($link, "", $text);
                $post["link"] = $link;
            }

            if($text){
                $post["message"] = $text;
            }

            if($mediaCount > 0){
                $post = array_merge($mediaIds, $post);
            }

            $result = $this->publish($post);

            $now = Carbon::now();
            $scheduledPost->posted = 1;
            $scheduledPost->status = null;
            $scheduledPost->scheduled_at = $now;
            $scheduledPost->scheduled_at_original = Carbon::parse($now)->setTimezone($timezone);
            $scheduledPost->save();

            return $result;

        }catch(\Exception $e){

            $scheduledPost->posted = 0;
            $scheduledPost->status = -1;
            //$scheduledPost->save();

            throw $e;
        }
    }

        /**
     * Synchronize tweets from API
     *
     * @param int $sleep
     * @param bool $logCursor
     */
    public function syncFacebookPosts()
    {
        $posts = $this->getPosts();

        if($posts)
        {
            foreach($posts['data'] as $post)
            {
                $data[] = [
                    'channel_id' => $this->id,
                    'post_id' => $post['id'],
                    'message' => array_key_exists('message', $post) ? $post['message'] : null,
                    'story' => array_key_exists('story', $post) ? $post['story'] : null,
                    'original_created_at' => Carbon::parse($post['created_time'])->toDateTimeString(),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ];
            }

            \DB::table('facebook_posts')->insert($data);
        }


    }

}
