<?php

namespace App\Http\Controllers;

use App\Models\ScheduleTime;
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
            $videos = $post['videos'];
            $publishType = $post['publishType'];
            $scheduledTime = Carbon::parse($scheduled['publishUTCDateTime'])->format("Y-m-d H:i:s");
            $uploadedImages = $post["uploadImages"];
            $uploadedVideos = $post["uploadVideos"];
            $bestTime = false;
            $permissionLevel = "publisher";
            $failedChannels = [];
            $channelCount = 0;
            $postId = '';
            $channelsCount = count($channels);
            $cntRepeat = $post["cntRepeat"];
            $scheduleOption = $post["scheduleOption"];

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
                $networkVideos = strtolower($channel->type) . "Videos";
                $publishTime = Carbon::now();

                if (isset($post[$networkPictures])) {

                    $images = $post[$networkPictures];

                    if (count($images)) {
                        $uploadedImages = $uploadedImages;
                    }
                }

                if (isset($post[$networkVideos])) {

                    $videos = $post[$networkVideos];

                    if (count($videos)) {
                        if ($channel->type == "linkedin") {
                            $uploadedVideos = [];
                        } else {
                            $uploadedVideos = $uploadedVideos;
                        }
                    }
                }

                $payload = [
                    'images' => $uploadedImages,
                    'videos' => $uploadedVideos,
                    'scheduled' => $scheduled
                ];

                if ($boards) {
                    $payload["boards"] = $boards;
                }

                if ($publishType == "date") {

                    $publishTime = $scheduledTime;
                } else if ($publishType == "best") {

                    if ($cntRepeat == 0) {
                        $schedulingTimes = $this->getSchedule($post, $channel->id, 1, $scheduleOption);

                        $postId = uniqid();
                        $scheduled['publishUTCDateTime'] = $schedulingTimes[0]->toRfc3339String();
                        $scheduled['publishDateTime'] = $schedulingTimes[0]->format('Y-m-d H:i');
                        $publishTime = $schedulingTimes[0]->format("Y-m-d H:i:s");
                        $payload = [
                            'images' => $uploadedImages,
                            'videos' => $uploadedVideos,
                            'scheduled' => $scheduled
                        ];
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
                    // 63 is the "Other" category
                    'category_id' => isset($post['category_id']) ? $post['category_id'] : 63,
                    'post_id' => $postId,
                    'is_best' => $publishType == "best" ? 1 : 0
                ];

                if ($post['type'] == 'edit') {
                    $posts = $this->user->getAllScheduledPosts()->where("post_id", $post['id']);
                    $account_count = count($posts->where("channel_id", $channel['id']));
                    $posts_approved = $posts->first();
                    $item_post = $posts->where("channel_id", $channel['id'])->first();
                    // This is for when we are adding new channels to the post
                    // $item_post not being set means that the channel is new and we need to
                    // create a new post in the data base for that channel
                    if (isset($item_post)) {
                        $item_approved_post = $posts->where("channel_id", $channel['id'])->where("approved", 0)->first();

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
                        // Here we create the post when there is not one
                        // for the current channel
                        $scheduledPost = $channel->scheduledPosts()->create($postData);
                    }
                } else {
                    if ($cntRepeat > 0) {
                        if ($publishType == "best") {
                            $schedulingTimes = $this->getSchedule($post, $channel->id, $cntRepeat, $scheduleOption);

                            foreach ($schedulingTimes as $schedulingTime) {
                                $postId = uniqid();

                                $scheduled['publishUTCDateTime'] = $schedulingTime->toRfc3339String();
                                $scheduled['publishDateTime'] = $schedulingTime->format('Y-m-d H:i');
                                $publishTime = $schedulingTime->format("Y-m-d H:i:s");
                                $publishOriginalTime = Carbon::parse($publishTime)->setTimezone($scheduled["publishTimezone"]);
                                $payload = [
                                    'images' => $uploadedImages,
                                    'videos' => $uploadedVideos,
                                    'scheduled' => $scheduled
                                ];

                                $postData = [
                                    'content' => isset($post[$networkContent]) ? $post[$networkContent] : $post['content'] ? $post['content'] : '',
                                    'scheduled_at' => $publishTime,
                                    'scheduled_at_original' => $publishOriginalTime,
                                    'payload' => serialize($payload),
                                    'approved' => $permissionLevel ? 1 : 0,
                                    'posted' => 0,
                                    //'posted' => 0,
                                    'article_id' => $post['articleId'] ? $post['articleId'] : null,
                                    // 63 is the "Other" category
                                    'category_id' => isset($post['category_id']) ? $post['category_id'] : 63,
                                    'post_id' => $postId,
                                    'is_best' => 1
                                ];

                                $scheduledPost = $channel->scheduledPosts()->create($postData);
                            }
                        } else {
                            for ($i = 0; $i < $cntRepeat; $i++) {
                                $postId = uniqid();

                                if ($scheduleOption == "Daily") {
                                    $publishUTCDateTime = Carbon::parse($post['scheduled']['publishUTCDateTime'])->addDays($i)->toRfc3339String();
                                    $publishDateTime = Carbon::parse($post['scheduled']['publishDateTime'])->addDays($i)->format('Y-m-d H:i');
                                    $publishTime = Carbon::parse($post['scheduled']['publishUTCDateTime'])->addDays($i)->format("Y-m-d H:i:s");
                                    $publishOriginalTime = Carbon::parse($publishTime)->setTimezone($scheduled["publishTimezone"]);
                                }
                                if ($scheduleOption == "Weekly") {
                                    $publishUTCDateTime = Carbon::parse($post['scheduled']['publishUTCDateTime'])->addWeeks($i)->toRfc3339String();
                                    $publishDateTime = Carbon::parse($post['scheduled']['publishDateTime'])->addWeeks($i)->format('Y-m-d H:i');
                                    $publishTime = Carbon::parse($post['scheduled']['publishUTCDateTime'])->addWeeks($i)->format("Y-m-d H:i:s");
                                    $publishOriginalTime = Carbon::parse($publishTime)->setTimezone($scheduled["publishTimezone"]);
                                }
                                if ($scheduleOption == "Monthly") {
                                    $publishUTCDateTime = Carbon::parse($post['scheduled']['publishUTCDateTime'])->addMonths($i)->toRfc3339String();
                                    $publishDateTime = Carbon::parse($post['scheduled']['publishDateTime'])->addMonths($i)->format('Y-m-d H:i');
                                    $publishTime = Carbon::parse($post['scheduled']['publishUTCDateTime'])->addMonths($i)->format("Y-m-d H:i:s");
                                    $publishOriginalTime = Carbon::parse($publishTime)->setTimezone($scheduled["publishTimezone"]);
                                }
                                if ($scheduleOption == "Yearly") {
                                    $publishUTCDateTime = Carbon::parse($post['scheduled']['publishUTCDateTime'])->addYears($i)->toRfc3339String();
                                    $publishDateTime = Carbon::parse($post['scheduled']['publishDateTime'])->addYears($i)->format('Y-m-d H:i');
                                    $publishTime = Carbon::parse($post['scheduled']['publishUTCDateTime'])->addYears($i)->format("Y-m-d H:i:s");
                                    $publishOriginalTime = Carbon::parse($publishTime)->setTimezone($scheduled["publishTimezone"]);
                                }

                                $scheduled['publishUTCDateTime'] = $publishUTCDateTime;
                                $scheduled['publishDateTime'] = $publishDateTime;

                                $payload = [
                                    'images' => $uploadedImages,
                                    'videos' => $uploadedVideos,
                                    'scheduled' => $scheduled
                                ];

                                $postData = [
                                    'content' => isset($post[$networkContent]) ? $post[$networkContent] : $post['content'] ? $post['content'] : '',
                                    'scheduled_at' => $publishTime,
                                    'scheduled_at_original' => $publishOriginalTime,
                                    'payload' => serialize($payload),
                                    'approved' => $permissionLevel ? 1 : 0,
                                    'posted' => 0,
                                    //'posted' => 0,
                                    'article_id' => $post['articleId'] ? $post['articleId'] : null,
                                    // 63 is the "Other" category
                                    'category_id' => isset($post['category_id']) ? $post['category_id'] : 63,
                                    'post_id' => $postId
                                ];

                                $scheduledPost = $channel->scheduledPosts()->create($postData);
                            }
                        }
                    } else {
                        $scheduledPost = $channel->scheduledPosts()->create($postData);
                    }
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

    public function upload(Request $request)
    {
        $post = $request->input('post');
        $images = $post['images'];
        $videos = $post['videos'];
        $uploadedVideos = [];
        $uploadedImages = [];
        if (count($videos)) {
            $uploadedVideos = $this->uploadVideos($videos);
        }

        if (count($images)) {
            $uploadedImages = $this->uploadImages($images);
        }

        return response()->json(['uploadedVideos' => $uploadedVideos, 'uploadedImages' => $uploadedImages]);
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

    private function uploadVideos($videos)
    {
        $uploadedVideos = [];
        foreach ($videos as $video) {
            if (str_contains($video, "http") && str_contains($video, "storage")) {

                $relativePath = 'storage' . explode('storage', $video)[1];

                $uploadedVideos[] = [
                    'relativePath' => $relativePath,
                    'absolutePath' => $video
                ];
            } else {
                    if (str_contains($video, "http")) {
                    $contents = file_get_contents($video);
                    $name = substr($video, strrpos($video, '/') + 1);
                    $videoName = str_contains($name, "?") ? explode("?", $name)[0] : $name;
                    $videoName = str_random(35) . "-" . $videoName;
                } else if(!empty($video)){
                    $videoData = explode(',', $video);
                    $videoBase64 = $videoData[1];
                    $videoInfo = explode(';', $videoData[0]);
                    $videoOriginalName = explode('.', $videoInfo[1]);
                    $videoExtension = $videoOriginalName[1];
                    $contents = base64_decode($videoBase64);
                    $videoName = str_random(35) . '.' . $videoExtension;
                } else if(empty($video)){
                    continue;
                }
                $today = Carbon::today();
                $uploadPath = "public/$today->year/$today->month/$today->day/$videoName";

                \Storage::put($uploadPath, $contents);

                $relativePublicPath = str_replace("public", "storage", $uploadPath);

                $uploadedVideos[] = [
                    'relativePath' => $relativePublicPath,
                    'absolutePath' => \URL::to('/') . '/' . $relativePublicPath
                ];
            }
        }
        return $uploadedVideos;
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
                $scheduledPosts = $this->user->getAllUnapprovedPosts()
                    ->where("post_id", $postId);

                foreach($scheduledPosts as $post) {
                    $post->approved = 1;
                    $post->save();
                }
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
                $posts = $this->user->getAllPosts()->where("post_id", $postId);
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

    public function getSchedule($post, $channel_id, $cntRepeat, $scheduleOption) {
        $result = [];
        $cnt = 0;
        $currentDate = Carbon::parse($post['scheduled']['publishUTCDateTime'])->setTimezone($post['scheduled']['publishTimezone']);
        $scheduleStartTime = '';

        while($cnt < $cntRepeat) {
            $dayOfTheWeek = $currentDate->dayOfWeek;

            $tmpScheduledPost = ScheduledPost::query()
                ->whereRaw("DAYOFWEEK(scheduled_at)=?", [$dayOfTheWeek + 1])
                ->where('scheduled_at', '>=', $currentDate->format("Y-m-d H:i:s"))
                ->where('channel_id', $channel_id)
                ->where('is_best', 1)
                ->orderBy('id', "ASC")
                ->pluck('scheduled_at');

            $scheduledPost = [];
            for ($i = 0; $i < count($tmpScheduledPost); $i++) {
                array_push($scheduledPost, $tmpScheduledPost[$i]);
            }

            if ($dayOfTheWeek != 0) {
                $tmpSchedulingTime = ScheduleTime::where("channel_id", $channel_id)
                    ->where("schedule_week", $dayOfTheWeek - 1)
                    ->orderBy("schedule_time", "ASC")
                    ->pluck("schedule_time");
            } else {
                $tmpSchedulingTime = ScheduleTime::where("channel_id", $channel_id)
                    ->where("schedule_week", 6)
                    ->orderBy("schedule_time", "ASC")
                    ->pluck("schedule_time");
            }

            $schedulingTime = [];
            for ($i = 0; $i < count($tmpSchedulingTime); $i++) {
                if ($currentDate->timestamp <= Carbon::createFromFormat('Y-m-d H:i', $currentDate->format('Y-m-d') . $tmpSchedulingTime[$i], $post['scheduled']['publishTimezone'])->timestamp) {
                    array_push($schedulingTime, Carbon::createFromFormat('Y-m-d H:i', $currentDate->format('Y-m-d') . $tmpSchedulingTime[$i], $post['scheduled']['publishTimezone'])->format("Y-m-d H:i:s"));
                }
            }

            $availableScheduleTime = array_diff($schedulingTime, $scheduledPost);
            if (count($availableScheduleTime) == 0) {
                $currentDate = $this->getDateTime($currentDate, $post['scheduled']['publishTimezone'], 'Daily');
                continue;
            }

            $currentDate = $this->getDateTime($currentDate, $post['scheduled']['publishTimezone'], $scheduleOption);
            if ($cnt == 0) {
                array_push($result, Carbon::createFromFormat('Y-m-d H:i:s', head($availableScheduleTime), $post['scheduled']['publishTimezone']));
                $scheduleStartTime = head($availableScheduleTime);
            } else {
                foreach ($availableScheduleTime as $time) {
                    if ($this->getFormatDate($scheduleStartTime, $cnt, $post['scheduled']['publishTimezone'], $scheduleOption)->format("Y-m-d H:i:s") == $time) {
                        array_push($result, Carbon::createFromFormat('Y-m-d H:i:s', $time, $post['scheduled']['publishTimezone']));
                    }
                }
            }

            $cnt++;
        }

        return $result;
    }

    public function getDateTime($currentDate, $timezone, $scheduleOption) {
        switch ($scheduleOption) {
            case 'Daily':
                $result = Carbon::createFromFormat('Y-m-d H:i:s', $currentDate->format('Y-m-d') . ' 00:00:00', $timezone)->addDays(1);
                break;
            case 'Weekly':
                $result = Carbon::createFromFormat('Y-m-d H:i:s', $currentDate->format('Y-m-d') . ' 00:00:00', $timezone)->addWeeks(1);
                break;
            case 'Monthly':
                $result = Carbon::createFromFormat('Y-m-d H:i:s', $currentDate->format('Y-m-d') . ' 00:00:00', $timezone)->addmonths(1);
                break;
            case 'Yearly':
                $result = Carbon::createFromFormat('Y-m-d H:i:s', $currentDate->format('Y-m-d') . ' 00:00:00', $timezone)->addYears(1);
        }

        return $result;
    }

    public function getFormatDate($strDate, $cnt, $timezone, $scheduleOption) {
        switch ($scheduleOption) {
            case 'Daily':
                $result = Carbon::createFromFormat('Y-m-d H:i:s', $strDate, $timezone)->addDays($cnt);
                break;
            case 'Weekly':
                $result = Carbon::createFromFormat('Y-m-d H:i:s', $strDate, $timezone)->addWeeks($cnt);
                break;
            case 'Monthly':
                $result = Carbon::createFromFormat('Y-m-d H:i:s', $strDate, $timezone)->addmonths($cnt);
                break;
            case 'Yearly':
                $result = Carbon::createFromFormat('Y-m-d H:i:s', $strDate, $timezone)->addYears($cnt);
        }

        return $result;
    }
}
