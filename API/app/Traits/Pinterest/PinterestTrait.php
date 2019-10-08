<?php

namespace App\Traits\Pinterest;

use Carbon\Carbon;
use DirkGroenen\Pinterest\Pinterest;
use Illuminate\Support\Facades\Cache;


trait PinterestTrait
{   

    private function getInstance()
    {
        $pinterest = new Pinterest(config("services.pinterest.client_id"), config("services.pinterest.client_secret"));

        return $pinterest;
    }

    private function setCurrentUser()
    {
        $pinterest = $this->getInstance();

        return $pinterest->auth->setOAuthToken($this->access_token);
    }

    public function getBoards()
    {   
        try{
            $key = $this->id . "-pinterestBoards";
            $minutes = 1;
            return Cache::remember($key, $minutes, function () {
                $pinterest = new Pinterest(config("services.pinterest.client_id"), config("services.pinterest.client_secret"));
                $pinterest->auth->setOAuthToken($this->access_token);
                
                return $pinterest->users->getMeBoards();
            });
        }catch(\Exception $e){
            throw $e;
        }
    }

    public function getAvatar(){
        try{
            $key = $this->id . "-pinterestAvatar";
            $minutes = 10;
            return Cache::remember($key, $minutes, function () {
                $pinterest = new Pinterest(config("services.pinterest.client_id"), config("services.pinterest.client_secret"));
                $pinterest->auth->setOAuthToken($this->access_token);
                $profile =  $pinterest->users->me(["fields" => "username,first_name,last_name,image[small,large]"]);

                if($profile){
                    return $profile->image["large"]["url"];
                }

                return public_path()."/images/dummy_profile.png";
            });
        }catch(\Exception $e){
            getErrorResponse($e, $this->global);
            return false;
        }
    }

    /**
     * Used to switch between users by using their corresponding
     * access fokens for login
     */
    public function publish($post)
    {   
        $pinterest = new Pinterest(config("services.pinterest.client_id"), config("services.pinterest.client_secret"));
        $pinterest->auth->setOAuthToken($this->access_token);

        $pinterest->pins->create($post);
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
            $boards = $payload['boards'];
            $timezone = $payload['scheduled']['publishTimezone'];
            $appUrl = config("app.url");

            $imageUrl = "";
            foreach($images as $image){
                $relativePath = str_replace('storage', 'public', $image['relativePath']);
                $imageUrl = base64_encode(\Storage::get($relativePath));
                break;
            }
            
            foreach($boards as $board){
                $post = [
                    'note' => $scheduledPost->content,
                    'image_base64' => $imageUrl,
                    'board' => $board["id"]
                ]; 
                
                $this->publish($post);
            }


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
}