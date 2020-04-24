<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Stream;

class StreamsController extends Controller
{
    private $user;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = auth()->user();
            $user_id = $this->user->id;
            if(!$this->user->hasPermission("streams", $user_id)) return response()->json(["error" => "You need to upgrade to unlock this feature."], 403);
            return $next($request);
        });
    }

    public function index()
    {
        $tabs = $this->user->tabs()->with(["streams" => function($q){
            $q->orderBy("index");
        }])->orderBy("index")->get(); 

        return $tabs;
    }

    public function setRefreshRate(Request $request)
    {
        $data = $request->get("data");
        $refreshRate = $request->get("refreshRate");

        if(!$data) return;

        $tab = $this->user->tabs()->where("key", $data["key"])->first();

        $tab->refresh_rate = $refreshRate;
        $tab->save();

        return response()->json(["message" => "Successful update"], 200);
    }

    public function selectTab(Request $request)
    {
        $data = $request->get("data");
        
        if(!$data) return;

        $tabs = $this->user->tabs();

        $tabs->update(["selected" => 0]);

        $tabs->where("key", $data)->update(["selected" => 1]);

        return response()->json(["message" => "Successful update"], 200);
    }

    public function positionTab(Request $request)
    {
        $data = $request->get("data");
        $currentKey = $request->get("key");

        if(!$data || !$currentKey) return;

        $keys = collect($data)->pluck("key");
        $data = [];
        foreach($keys as $index => $key){
            $data[] = [
                "index" => $index,
                "key" => $key
            ];
        }

        $newPos = collect($data)->where("key", $currentKey)->first();
        $oldPos = $this->user->tabs()->where("key", $currentKey)->first();

        if(!isset($newPos["index"]) || !isset($oldPos->index)) return;

        $newPos = $newPos["index"];
        $oldPos = $oldPos->index;
            
        $query = $this->user->tabs()->whereIn("key", $keys);
        
        if($oldPos < $newPos){
            $query->where("index", ">=", $oldPos)->where("index", "<=", $newPos)->decrement("index"); 
        }else{
            $query->where("index", ">=", $newPos)->where("index", "<=", $oldPos)->increment("index");
        }

        $this->user->tabs()->where("key", $currentKey)->update(["index" => $newPos]);
                
        return response()->json(["message" => "Successful update"], 200);
    }

    public function addTab(Request $request)
    {
        $data = $request->get("data");

        if(!$data) return;

        $tabs = $this->user->tabs();

        $latestTab = $tabs->orderBy("index", "desc")->first();

        $tabs->create([
            "key" => $data["key"],
            "title" => $data["title"],
            "index" => $latestTab ? $latestTab->index + 1 : 0,
            "selected" => 1
        ]);

        $this->user->tabs()->where("key", "!=", $data["key"])->update(["selected" => 0]);

        return response()->json(["message" => "Successful update"], 200);
    }

    public function deleteTab(Request $request)
    {
        $data = $request->get("data");

        if(!$data) return;

        $tab = $this->user->tabs()->where("key", $data["key"])->first();

        if(!$tab) return;

        if($tab->selected == 1 && isset($data["selectedKey"])){
            
            $firstTab = $this->user->tabs()->where("key", $data["selectedKey"])->first();

            if(!$firstTab) return;
            $firstTab->selected = 1;
            $firstTab->save();
        }

        $tabIndex = $tab->index;
        $tab->delete();
        $this->user->tabs()->where("index", ">=", $tabIndex)->decrement("index");

        return response()->json(["message" => "Successful update"], 200);
    }

    public function renameTab(Request $request)
    {
        $data = $request->get("data");

        if(!$data) return;
        
        $this->user->tabs()->where("key", $data["key"])->update(["title" => $data["title"]]);
    }

    public function addStream(Request $request)
    {
        $channelId = $request->input("channelId");
        $type = $request->input("type");
        $network = $request->input("network");
        $selectedTab = $request->input("selectedTab");
        $searchTerm = $request->input("searchTerm");

        if(!$type || !$channelId || !$network) return;

        $tabs = $this->user->tabs();

        if(!$selectedTab || $selectedTab == "tab0"){
            if(!($tab = $this->user->tabs()->first())){
                $tab = $tabs->create([
                    "key" => "newtab_".Carbon::now()->timestamp,
                    "title" => "untitled",
                    "index" => 0,
                    "selected" => 1
                ]);
            }
        }else{
            $tab = $this->user->tabs()->where("key", $selectedTab)->first();
        }

        $latestStream = $tab->streams()->orderBy("index", "desc")->first();

        $stream = $tab->streams()->create([
            "index" => ($latestStream ? $latestStream->index + 1 : 0),
            "channel_id" => $channelId,
            "search_query" => $searchTerm ? (isset($searchTerm["id"]) ? $searchTerm["id"] : $searchTerm) : null,
            "title" => $searchTerm ? (isset($searchTerm["name"]) ? $searchTerm["name"] : $searchTerm) : $type["label"],
            "type" => $type["value"],
            "network" => $network
        ]);

        return response()->json($stream, 200);
    }

    public function updateStream(Request $request){
        $streamId = $request->input("streamId");
        $title = $request->input("title");

        if(!$streamId) return;

        \DB::table("streams")->where("id", $streamId)->update(['title' => $title]);

        return response()->json("Update successful!", 200);
    }


    public function positionStream(Request $request){
        $data = $request->get("data");
        $streamId = $request->get("streamId");

        if(!$data || !$streamId) return;

        $ids = collect($data)->pluck("id");
        $data = [];
        foreach($ids as $index => $id){
            $data[] = [
                "index" => $index,
                "id" => $id
            ];
        }

        $newPos = collect($data)->where("id", $streamId)->first();
        $oldPos = Stream::where("id", $streamId)->first();

        if(!isset($newPos["index"]) || !isset($oldPos->index)) return;

        $newPos = $newPos["index"];
        $oldPos = $oldPos->index;
            
        $query = Stream::whereIn("id", $ids);
        
        if($oldPos < $newPos){
            $query->where("index", ">=", $oldPos)->where("index", "<=", $newPos)->decrement("index"); 
        }else{
            $query->where("index", ">=", $newPos)->where("index", "<=", $oldPos)->increment("index");
        }

        Stream::where("id", $streamId)->update(["index" => $newPos]);
                
        return response()->json(["message" => "Successful update"], 200);
    }

    public function deleteStream(Request $request){
        $streamId = $request->input("streamId");

        if(!$streamId) return;

        $stream = Stream::find($streamId);
        $streamIndex = $stream->index;
        $streamTabId = $stream->tab_id;
        $stream->delete();

        Stream::where("tab_id", $streamTabId)->where("index", ">=", $streamIndex)->decrement("index");

        return response()->json("Delete successful!", 200);
    }
}