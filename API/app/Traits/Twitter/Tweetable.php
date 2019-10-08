<?php

namespace App\Traits\Twitter;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Thujohn\Twitter\Facades\Twitter;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Subscriber\Oauth\Oauth1;

set_time_limit(0);

trait Tweetable
{

    /**
     * Used to switch between users by using their corresponding
     * access fokens for login
     */
    public function setAsCurrentUser()
    {
        try {
            $tokens = $this->getTokens();

            $request_token = [
                'token' => $tokens->oauth_token,
                'secret' => $tokens->oauth_token_secret,
            ];

            Twitter::reconfig($request_token);
        } catch (\Exception $e) {
            throw $e;
        }
    }


    /**
     * @return mixed
     */
    public function getData()
    {
        try {
            $key = $this->id . "-twitterData";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () {
                $this->setAsCurrentUser();
                return Twitter::getCredentials();
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @return mixed
     */
    public function getAvatar()
    {
        try {
            $key = $this->id . "-twitterAvatar";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () {
                $data = $this->getData();

                if($data){
                    return $data->profile_image_url;
                }

                return public_path()."/images/dummy_profile.png";
            });
        } catch (\Exception $e) {
            getErrorResponse($e, $this->global);
            return false;
        }
    }


    public function getUserInfo($username)
    {
        try {
            $key = $username . "-twitterInfo";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () use ($username) {
                $this->setAsCurrentUser();
                return Twitter::getUsersLookup(['screen_name' => $username]);
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }


    /**
     * @param array $media
     * @return mixed
     */
    public function uploadMedia($media)
    {
        $this->setAsCurrentUser();
        return Twitter::uploadMedia($media);
    }


    /**
     * @param array $tweet
     * @return mixed
     */
    public function publish($tweet)
    {
        $this->setAsCurrentUser();
        $result = Twitter::postTweet($tweet);
        $this->uncacheFeeds();
        return $result;
    }

    public function deleteTweet($tweetId)
    {
        $this->setAsCurrentUser();
        $result = Twitter::destroyTweet($tweetId);
        $this->uncacheFeeds();
        return $result;
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

            $mediaIds = [];

            foreach($images as $image){
                $relativePath = str_replace('storage', 'public', $image['relativePath']);

                $media = ["media" => \Storage::get($relativePath)];
                $uploadResponse = $this->uploadMedia($media);
                $mediaIds[] = $uploadResponse->media_id;
            }

            $post = [
                'status' => $scheduledPost->content,
                'media_ids' => $mediaIds
            ];

            $this->publish($post);

            $now = Carbon::now();
            $scheduledPost->posted = 1;
            $scheduledPost->status = null;
            $scheduledPost->scheduled_at = $now;
            $scheduledPost->scheduled_at_original = Carbon::parse($now)->setTimezone($timezone);
            $scheduledPost->save();

        }catch(\Exception $e){

            $scheduledPost->posted = 0;
            $scheduledPost->status = -1;
            $scheduledPost->save();

            throw $e;
        }
    }

    /**
     * @param $userId
     * @return mixed
     */
    public function followById($userId)
    {
        $this->setAsCurrentUser();
        return Twitter::postFollow(["user_id" => $userId]);
    }

    /**
     * @param $userId
     * @return mixed
     */
    public function unfollowById($userId)
    {
        $this->setAsCurrentUser();
        return Twitter::postUnfollow(["user_id" => $userId]);
    }

    /**
     * @param $userId
     * @param $text
     * @return mixed
     */
    public function DMById($userId, $text)
    {
        $this->setAsCurrentUser();
        return Twitter::postDm(["user_id" => $userId, "text" => $text, "screen_name"=>"animemasters89"]);
    }


    public function DM($userId, $text)
    {
        $dm = [
            "event" => [
                "type" => "message_create",
                "message_create" => [
                    "target" => ["recipient_id" => $userId],
                    "message_data" => ["text" => $text]
                ]
            ]
        ];

        $stack = HandlerStack::create();
        $tokens = $this->getTokens();

        $middleware = new Oauth1([
            'consumer_key'    => config('ttwitter.CONSUMER_KEY'),
            'consumer_secret' => config('ttwitter.CONSUMER_SECRET'),
            'token'           => $tokens->oauth_token,
            'token_secret'    => $tokens->oauth_token_secret
        ]);

        $stack->push($middleware);
        $baseUrl = config('ttwitter.API_URL');
        $version = config('ttwitter.API_VERSION');
        $client = new Client([
            'base_uri' => "https://$baseUrl/$version/",
            'handler' => $stack
        ]);

        // Set the "auth" request option to "oauth" to sign using oauth
        $res = $client->post('direct_messages/events/new.json', ['auth' => 'oauth', 'json' => $dm]);

        return json_decode($res->getBody()->getContents());
    }

    /**
     * @param $username
     * @return mixed
     */
    public function followByName($username)
    {
        $this->setAsCurrentUser();
        return Twitter::postFollow(["screen_name" => $username]);
    }

    /**
     * @param $username
     * @return mixed
     */
    public function unfollowByName($username)
    {
        $this->setAsCurrentUser();
        return Twitter::postUnfollow(["screen_name" => $username]);
    }

    /**
     * @param $screenName
     * @param $text
     * @return mixed
     */
    public function DMByName($screenName, $text)
    {
        $this->setAsCurrentUser();
        return Twitter::postDm(["screen_name" => $screenName, "text" => $text]);
    }

    /**
     * @param int $count
     * @param int $cursor
     * @return mixed
     */
    public function getFollowerIds($count = 20, $cursor = -1, $uname = null)
    {
        $this->setAsCurrentUser();
        $params = ["count" => $count, "cursor" => $cursor];

        if($uname){
            $params["screen_name"] = $uname;
        }

        try {
            return Twitter::getFollowersIds($params);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $count
     * @param int $cursor
     * @return mixed
     */
    public function getFollowingIds($count = 20, $cursor = -1, $uname = null)
    {
        $this->setAsCurrentUser();

        $params = ["count" => $count, "cursor" => $cursor];

        if($uname){
            $params["screen_name"] = $uname;
        }

        try {
            return Twitter::getFriendsIds($params);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $ids
     * @return array
     */
    public function getUsersLookup($ids)
    {
        try {
            $this->setAsCurrentUser();
            return Twitter::getUsersLookup(["user_id" => $ids]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $ids
     * @return array
     */
    public function getUsersLookupByName($names)
    {
        try {
            $this->setAsCurrentUser();
            return Twitter::getUsersLookup(["screen_name" => $names]);
        } catch (\Exception $e) {
            throw $e;
        }
    }


    /**
     * @param array $params
     * @return array
     */
    public function getUsersInfo($params = [])
    {
        try {
            $this->setAsCurrentUser();
            return Twitter::getUsers($params);
        } catch (\Exception $e) {
            throw $e;
        }
    }


    public function uncacheFeeds()
    {
        Cache::forget($this->id . "-userTimeline");
        Cache::forget($this->id . "-homeTimeline");
        Cache::forget($this->id . "-mentionsTimeline");
        Cache::forget($this->id . "-rtsTimeline");
        Cache::forget($this->id . "-followersTimeline");
        Cache::forget($this->id . "-likesTimeline");
    }


    /**
     * @param array $params
     * @return array
     */
    public function getTweets($params = [])
    {
        $params = array_merge(["screen_name" => $this->username, "count" => 200], $params);
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        try {
            $key = $this->id . "-userTimeline-$maxId";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () use ($params){
                $this->setAsCurrentUser();
                return Twitter::getUserTimeline($params);
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }


    /**
     * @param array $params
     * @return array
     */
    public function getHome($params = [])
    {
        $params = array_merge(["screen_name" => $this->username, "count" => 200], $params);
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        try {
            $key = $this->id . "-homeTimeline-$maxId";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () use ($params){
                $this->setAsCurrentUser();
                return Twitter::getHomeTimeline($params);
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $params
     * @return array
     */
    public function getMentions($params = [])
    {
        $params = array_merge(["screen_name" => $this->username, "count" => 200], $params);
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        try {
            $key = $this->id . "-mentionsTimeline-$maxId";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () use ($params){
                $this->setAsCurrentUser();
                return Twitter::getMentionsTimeline($params);
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

        /**
     * @param array $params
     * @return array
     */
    public function getRetweets($params = [])
    {
        $params = array_merge(["screen_name" => $this->username, "count" => 200], $params);
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        try {
            $key = $this->id . "-rtsTimeline-$maxId";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () use ($params){
                $this->setAsCurrentUser();
                return Twitter::getRtsTimeline($params);
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $params
     * @return array
     */
    public function getFollowers($params = [])
    {
        $params = array_merge(["screen_name" => $this->username, "count" => 200], $params);
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        try {
            $key = $this->id . "-followersTimeline-$maxId";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () use ($params){
                $this->setAsCurrentUser();
                $result = Twitter::getFollowers($params);

                if(!property_exists($result, "users")) return [];

                return $result->users;
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $params
     * @return array
     */
    public function getLikes($params = [])
    {
        $params = array_merge(["screen_name" => $this->username, "count" => 3], $params);
        $maxId = isset($params["max_id"]) ? $params["max_id"] : "";
        try {
            $key = $this->id . "-likesTimeline-$maxId";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () use ($params){
                $this->setAsCurrentUser();
                return Twitter::getFavorites($params);
            });
        } catch (\Exception $e) {
            throw $e;
        }
    }


    /**
     * @param array $params
     * @return array
     */
    public function getSearch($params = []){

        if(!isset($params["q"])) return [];
        $sinceId = isset($params["since_id"]) ? $params["since_id"] : "";

        try {
            $key = $this->id . "-search-{$params['q']}-{$sinceId}-Timeline";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () use ($params){
                $this->setAsCurrentUser();
                $result = Twitter::getSearch($params);

                if(!property_exists($result, "statuses")) return [];

                return $result->statuses;
            });

        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function getStatusReplies($username, $tweetId){
        $results = $this->getSearch(["q"=>"@$username", "since_id"=>$tweetId, "count"=>100]);
        if(count($results) < 1) return [];
        $results = collect($results)->where("in_reply_to_status_id_str", $tweetId)->values()->toArray();

        return $results;
    }


    public function likePost($id)
    {
        $this->setAsCurrentUser();
        $result = Twitter::postFavorite(["id" => $id]);
        $this->uncacheFeeds();
        return $result;
    }

    public function unlikePost($id)
    {
        $this->setAsCurrentUser();
        $result = Twitter::destroyFavorite(["id" => $id]);
        $this->uncacheFeeds();
        return $result;
    }

    public function retweetPost($id)
    {
        $this->setAsCurrentUser();
        $result = Twitter::postRt($id);
        $this->uncacheFeeds();
        return $result;
    }


    /**
     * @param array $params
     * @return array
     */
    public function getGeoSearch($params = []){

        try {
            $this->setAsCurrentUser();
            return Twitter::getGeoSearch($params);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $params
     * @return array
     */
    public function getGeo($id){

        try {
            $this->setAsCurrentUser();
            return Twitter::getGeo($id);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     *
     */
    public function tweetLookup($ids)
    {
        try {
            $this->setAsCurrentUser();
            return Twitter::getStatusesLookup($ids);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $cursor
     * @param int $perPage
     * @param int $pages
     * @param int $sleep
     * @return array
     * @throws \Exception
     */
    public function collectFollowerIds($cursor = -1, $perPage = 5000, $pages = 15, $sleep = 60)
    {
        $ids = [];

        /*
         * The start cursor is based on the latest cursor that has been stored
         * in the database, if one exists, then we can use this cursor to jump
         * to that specific page
         */
        $startCursor = $cursor;

        try {

            /*
             * Get the ids from each page
             */
            for ($i = 0; $i < $pages; $i++) {

                /*
                 * Always check at least the first page if there is something new
                 * before jumping to the given cursor page
                 */
                if ($i < 1) {
                    $items = $this->getFollowerIds($perPage, -1);
                } else {

                    /*
                     * If we have a start cursor, after finishing the first page
                     * jump directly to this cursor instead of next page
                     */
                    if ($i < 2 && $startCursor > 0) {
                        $cursor = $startCursor;
                    }

                    $items = $this->getFollowerIds($perPage, $cursor);
                }

                /*
                 * Continue assigning the cursor of the coming page
                 */
                $cursor = $items->next_cursor;

                /*
                 * Merge all pages of ids together
                 */
                $ids = array_merge($ids, $items->ids);

                /*
                 * If the cursor is 0, this means we have finished all pages
                 * and there is no point looping any further
                 */
                if ($cursor < 1) break;

                /*
                 * This is used to prevent rate limit if we want
                 * to fetch more than 15 pages. In order to do that
                 * we need to set it to at least 60 seconds between requests,
                 * since each page is a distinct request.
                 */
                sleep($sleep);
            }
        } catch (\Exception $e) {
            throw $e;
        }

        return ["ids" => $ids, "next_cursor" => $cursor];
    }


    /**
     * @param int $cursor
     * @param int $perPage
     * @param int $pages
     * @param int $sleep
     * @return array|bool
     */
    public function collectFollowingIds($cursor = -1, $perPage = 5000, $pages = 15, $sleep = 60)
    {
        $ids = [];

        /*
         * The start cursor is based on the latest cursor that has been stored
         * in the database, if one exists, then we can use this cursor to jump
         * to that specific page
         */
        $startCursor = $cursor;

        try {

            /*
             * Get the ids from each page
             */
            for ($i = 0; $i < $pages; $i++) {

                /*
                 * Always check at least the first page if there is something new
                 * before jumping to the given cursor page
                 */
                if ($i < 1) {
                    $items = $this->getFollowingIds($perPage, -1);
                } else {

                    /*
                     * If we have a start cursor, after finishing the first page
                     * jump directly to this cursor instead of next page
                     */
                    if ($i < 2 && $startCursor > 0) {
                        $cursor = $startCursor;
                    }

                    $items = $this->getFollowingIds($perPage, $cursor);
                }

                /*
                 * Continue assigning the cursor of the coming page
                 */
                $cursor = $items->next_cursor;

                /*
                 * Merge all pages of ids together
                 */
                $ids = array_merge($ids, $items->ids);

                /*
                 * If the cursor is 0, this means we have finished all pages
                 * and there is no point looping any further
                 */
                if ($cursor < 1) break;

                /*
                 * This is used to prevent rate limit if we want
                 * to fetch more than 15 pages. In order to do that
                 * we need to set it to at least 60 seconds between requests,
                 * since each page is a distinct request.
                 */
                sleep($sleep);
            }
        } catch (\Exception $e) {
            throw $e;
        }

        return ["ids" => $ids, "next_cursor" => $cursor];
    }


    /**
     * Compares and synchronizes ids stored in the database
     * against the ids that are fetched out.
     * @param int $sleep
     * @param bool $logCursor
     */
    public function syncFollowerIds($sleep = 60, $logCursor = false)
    {
        /*
         * If $logCursor is not enabled, it will always start from the first page
         * and continue to the next one in order
         */
        if (!$logCursor) {
            $cursor = -1;
        } else {
            $cursor = $this->cursor ? $this->cursor->followingids_cursor : -1;
        }

        $perPage = 5000;
        $followersCount = $this->getData()->followers_count; //Gets the twitter data for currently logged in user

        /*
         * If sleep is not enabled then only fetch 15 pages to prevent
         * rate limit, otherwise get as many pages as you have followers
         * but sleep has to be 60 seconds according to the 15 requests per 15 minute
         * limit.
         */
        if ($sleep < 1) {
            $pages = 15;
        } else {
            $pages = ceil($followersCount / $perPage);
        }

        /*
         * Gets the full collection for all given pages.
         * It contains the ids array and the next_cursor (usually -1 if all data is fetched)
         */
        $collection = $this->collectFollowerIds($cursor, $perPage, $pages, $sleep);

        /*
         * If the collection is returned successfully
         * proceed with the synchronization
         */
        if ($collection) {
            $ids = $collection["ids"];

            $cursor = $collection["next_cursor"];

            /*
             * Search for duplicate ids to prevent storing them twice
             */
            $followerIds = $this->followerIds()->whereIn("user_id", $ids);

            /*
             * In case we are not keeping track for cursor and are fetching all data at once
             * and if we manage to grab all the id pages, then it is worth checking against
             * old ids we had stored so that we know if someone unfollowed us
             */
            if ($cursor < 1 && !$logCursor) {
                /*
                 * In case someone follows you back, update the unfollow field to null
                 */
                $this->followerIds()->whereIn("user_id", $ids)->whereNotNull("unfollowed_you_at")->update(["unfollowed_you_at" => null]);

                $this->followerIds()->whereNotIn("user_id", $ids)
                    ->update(["unfollowed_you_at" => Carbon::now(), "updated_at" => Carbon::now()]);
            }

            /*
             * Get the duplicate ids that already exist in the database and exclude them
             * from our id collection from the recent search
             */
            $dupIds = $followerIds->pluck("user_id")->toArray();
            $ids = array_diff($ids, $dupIds);


            /*
             * Prepare insert parameters for bulk inserting
             */
            $insert = [];
            foreach ($ids as $id) {
                $insert[] = [
                    "channel_id" => $this->id,
                    "user_id" => $id,
                    "created_at" => Carbon::now(),
                    "updated_at" => Carbon::now(),
                ];
            }

            /*
             * To prevent the insert batch from running out of memory,
             * we chunk them into smaller parts
             */
            foreach (array_chunk($insert, 100000) as $chunk) {
                $this->followerIds()->insert($chunk);
            }


            /*
             * If we decide to keep track of the cursor, then store it in the database
             * so we can next time refer to it instead of always searching the same pages
             * over and over
             */
            if ($logCursor) {
                if ($cursor > 0) {
                    $this->cursor()->updateOrCreate(["channel_id" => $this->id], ["followerids_cursor" => $cursor]);
                } else {
                    $this->cursor()->updateOrCreate(["channel_id" => $this->id], ["followerids_cursor" => -1]);
                }
            }
        }
    }


    /**
     * @param int $sleep
     * @param bool $logCursor
     */
    public function syncFollowingIds($sleep = 60, $logCursor = false)
    {
        /*
         * If $logCursor is not enabled, it will always start from the first page
         * and continue to the next one in order
         */
        if (!$logCursor) {
            $cursor = -1;
        } else {
            $cursor = $this->cursor ? $this->cursor->followingids_cursor : -1;
        }

        $perPage = 5000;
        $followingCount = $this->getData()->friends_count;

        /*
        * If sleep is not enabled then only fetch 15 pages to prevent
        * rate limit, otherwise get as many pages as you have followers
        * but sleep has to be 60 seconds according to the 15 requests per 15 minute
        * limit.
        */
        if ($sleep < 1) {
            $pages = 15;
        } else {
            $pages = ceil($followingCount / $perPage);
        }

        /*
        * Gets the full collection for all given pages.
        * It contains the ids array and the next_cursor (usually -1 if all data is fetched)
        */
        $collection = $this->collectFollowingIds($cursor, $perPage, $pages, $sleep);

        /*
        * If the collection is returned successfully
        * proceed with the synchronization
        */
        if ($collection) {
            $ids = $collection["ids"];

            $cursor = $collection["next_cursor"];

            /*
            * Search for duplicate ids to prevent storing them twice
            */
            $followingIds = $this->followingIds()->whereIn("user_id", $ids);

            /*
            * In case we are not keeping track for cursor and are fetching all data at once
            * and if we manage to grab all the id pages, then it is worth checking against
            * old ids we had stored so that we know if we unfollowed someone manually
            */
            if ($cursor < 1 && !$logCursor) {
                /*
                 * In case we followed someone again, make sure to set the unfollow
                 * field to null
                 */
                $this->followingIds()->whereIn("user_id", $ids)->whereNotNull("unfollowed_at")->update(["unfollowed_at" => null]);

                $this->followingIds()->whereNotIn("user_id", $ids)
                    ->update(["unfollowed_at" => Carbon::now(), "updated_at" => Carbon::now()]);
            }

            /*
            * Get the duplicate ids that already exist in the database and exclude them
            * from our id collection from the recent search
            */
            $dupIds = $followingIds->pluck("user_id")->toArray();
            $ids = array_diff($ids, $dupIds);


            /*
            * Prepare insert parameters for bulk inserting
            */
            $insert = [];
            foreach ($ids as $id) {
                $insert[] = [
                    "channel_id" => $this->id,
                    "user_id" => $id,
                    "created_at" => Carbon::now(),
                    "updated_at" => Carbon::now(),
                ];
            }

            /*
            * To prevent the insert batch from running out of memory,
            * we chunk them into smaller parts
            */
            foreach (array_chunk($insert, 100000) as $chunk) {
                $this->followingIds()->insert($chunk);
            }

            /*
            * If we decide to keep track of the cursor, then store it in the database
            * so we can next time refer to it instead of always searching the same pages
            * over and over
            */
            if ($logCursor) {
                if ($cursor > 0) {
                    $this->cursor()->updateOrCreate(["channel_id" => $this->id], ["followingids_cursor" => $cursor]);
                } else {
                    $this->cursor()->updateOrCreate(["channel_id" => $this->id], ["followingids_cursor" => -1]);
                }
            }
        }
    }

    /**
     * Synchronize tweets from API
     *
     * @param int $sleep
     * @param bool $logCursor
     */
    public function syncTweets()
    {
        $lookUpTweets = \DB::table('twitter_tweets')->where('channel_id',$this->id)->take(300)->pluck('tweet_id')->toArray();

        $deletedIds = [];

        foreach (array_chunk($lookUpTweets, 100) as $chunk) {
            $results = $this->tweetLookup(["id" => $chunk]);

            if(!$results) continue;

            $lookUpIds = collect($results)->pluck('id')->toArray();

            $diffIds = array_diff($chunk, $lookUpIds);

            $deletedIds = array_merge($deletedIds, $diffIds);
        }

        if($deletedIds)
        {
            \DB::table('twitter_tweets')->whereIn('tweet_id',$deletedIds)->delete();
            die();
        }

        $tweets = $this->getTweets();

        if(!$tweets) return;

        $ids = collect($tweets)->pluck('id');

        $existingIds = \DB::table('twitter_tweets')->whereIn('tweet_id',$ids)->pluck('tweet_id');

        $filterTweets = collect($tweets)->whereNotIn('id',$existingIds);

        $data = [];

        foreach($filterTweets as $tweet)
        {
            $data[] = [
                'channel_id' => $this->id,
                'tweet_id' => $tweet->id,
                'original_created_at' => Carbon::parse($tweet->created_at)->toDateTimeString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ];
        }

        if($filterTweets)
        {
            \DB::table('twitter_tweets')->insert($data);
        }

    }

    /**
     * Synchronize rettweets from API
     *
     * @param int $sleep
     * @param bool $logCursor
     */
    public function syncRetweets()
    {
        $lookUpTweets = \DB::table('twitter_retweets')->where('channel_id',$this->id)->take(300)->pluck('tweet_id')->toArray();

        $deletedIds = [];

        foreach (array_chunk($lookUpTweets, 100) as $chunk) {
            $results = $this->tweetLookup(["id" => $chunk]);

            if(!$results) continue;

            $lookUpIds = collect($results)->pluck('id')->toArray();

            $diffIds = array_diff($chunk, $lookUpIds);

            $deletedIds = array_merge($deletedIds, $diffIds);
        }

        if($deletedIds)
        {
            \DB::table('twitter_retweets')->whereIn('tweet_id',$deletedIds)->delete();
            die();
        }

        $retweets = $this->getRetweets();

        if(!$retweets) return;

        $ids = collect($retweets)->pluck('id');

        $existingIds = \DB::table('twitter_retweets')->whereIn('tweet_id',$ids)->pluck('tweet_id');

        $filterTweets = collect($retweets)->whereNotIn('id',$existingIds);

        $data = [];

        foreach($filterTweets as $tweet)
        {
            $data[] = [
                'channel_id' => $this->id,
                'tweet_id' => $tweet->id,
                'original_created_at' => Carbon::parse($tweet->created_at)->toDateTimeString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ];
        }

        if($filterTweets)
        {
            \DB::table('twitter_retweets')->insert($data);
        }

    }

    /**
     * Synchronize rettweets from API
     *
     * @param int $sleep
     * @param bool $logCursor
     */
    public function syncLikes()
    {
        $lookUpTweets = \DB::table('twitter_likes')->where('channel_id',$this->id)->take(300)->pluck('tweet_id')->toArray();

        $deletedIds = [];

        foreach (array_chunk($lookUpTweets, 100) as $chunk) {
            $results = $this->tweetLookup(["id" => $chunk]);

            if(!$results) continue;

            $lookUpIds = collect($results)->where('favorited',true)->pluck('id')->toArray();

            $diffIds = array_diff($chunk, $lookUpIds);

            $deletedIds = array_merge($deletedIds, $diffIds);

        }

        if($deletedIds)
        {
            \DB::table('twitter_likes')->whereIn('tweet_id',$deletedIds)->delete();
            die();
        }

        $tweets = $this->getLikes();

        if(!$tweets) return;

        $ids = collect($tweets)->pluck('id');

        $existingIds = \DB::table('twitter_likes')->whereIn('tweet_id',$ids)->pluck('tweet_id');

        $filterTweets = collect($tweets)->whereNotIn('id',$existingIds);

        $data = [];

        foreach($filterTweets as $tweet)
        {
            $data[] = [
                'channel_id' => $this->id,
                'tweet_id' => $tweet->id,
                'original_created_at' => Carbon::parse($tweet->created_at)->toDateTimeString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ];
        }

        if($filterTweets)
        {
            \DB::table('twitter_likes')->insert($data);
        }

    }
}
