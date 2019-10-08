<?php

function navActive($name)
{
     $slugs = explode("/", request()->getUri());
     $lastSlug = $slugs [(count ($slugs) - 1)];
     $lastSlug = explode("?",$lastSlug)[0];
     return $lastSlug == $name ? "active" : '';
}

function topNavActive($name)
{
    $uri = request()->getUri();

    return str_contains($uri, $name) ? "active" : '';
}

function formatBigNums($input){
    $input = number_format($input, 1);
    $input_count = substr_count($input, ',');
    if($input_count != '0'){
        if($input_count == '1'){
            return substr($input, 0, -4).'k';
        } else if($input_count == '2'){
            return substr($input, 0, -8).'mil';
        } else if($input_count == '3'){
            return substr($input, 0,  -12).'bil';
        } else {
            return;
        }
    } else {
        return str_replace(".0", "", (string) $input);
    }
}

function getErrorResponse($e, $channel = false){
    $error = strtolower($e->getMessage());
    if(str_contains($error, "log in")
    || str_contains($error, "token")
    || str_contains($error, "session")
    || str_contains($error, "denied")
    || str_contains($error, "permission")
    || str_contains($error, "authorization")
    || str_contains($error, "authentication")){

        if($channel && $channel->active==1){
            $channel->active = 0;
            // $channel->select();
            $channel->save();
            // $channel->user->notify(new \App\Notifications\User\AccountDisconnected($channel));
        }

        $username = $channel->details->name;
        $type = $channel->type;
        return response()->json(['error' => $error, 'message' => "Your $type account \"$username\" needs to be reconnected.", "network" => $type], 401);
    }
    return response()->json(['message' => $e->getMessage(), 'error' => $e->getTrace(), 'errorMsg' => $e->getMessage()], 400);
}

function exchangeFBToken($accessToken)
{
    try {

        $fb = app(\SammyK\LaravelFacebookSdk\LaravelFacebookSdk::class);
        $fb->setDefaultAccessToken($accessToken);

        $oauthClient = $fb->getOAuth2Client();
        $token = $oauthClient->getLongLivedAccessToken($accessToken);

        return $token;
    } catch (\Exception $e) {
        throw $e;
    }
}


function findUrlInText($text){
    // The Regular Expression filter
    $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";

    // Check if there is a url in the text
    if(preg_match($reg_exUrl, $text, $url)) {

        return $url[0];

    } else {

        return "";
    }
}

function insertOrUpdate(array $rows, $table){
    $table = \DB::table($table);


    $first = reset($rows);

    $columns = implode( ',',
        array_map( function( $value ) { return "$value"; } , array_keys($first) )
    );

    $values = implode( ',', array_map( function( $row ) {
            return '('.implode( ',',
                array_map( function( $value ) { return '"'.str_replace('"', '""', $value).'"'; } , $row )
            ).')';
        } , $rows )
    );

    $updates = implode( ',',
        array_map( function( $value ) { return "$value = VALUES($value)"; } , array_keys($first) )
    );

    $sql = "INSERT INTO {$table}({$columns}) VALUES {$values} ON DUPLICATE KEY UPDATE {$updates}";

    return \DB::statement( $sql );
}

/**
 * @param $url
 * @param $payload
 * @return array
 */
function multiRequest($url, $payload, $params = [])
{
    //create the multiple cURL handle
    $requests = [];
    $response = [];

    $urlParts = parse_url($url);

    if (!empty($payload)) {

        $mh = curl_multi_init();

        foreach ($payload as $item) {

            $curl = curl_init();

            $post = ['item' => serialize($item), 'params' => serialize($params)];

            $post = http_build_query($post);

            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_POST, TRUE);
            curl_setopt($curl, CURLOPT_BINARYTRANSFER, TRUE);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $post);

            //NetworkError transfer closed with data remaining - FIX
            //curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($post)));

            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_HEADER, 0);

            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);

            // if ($urlParts["scheme"] == "https") {
            //     curl_setopt($curl, CURLOPT_CAINFO, base_path() . '/uniclix_bundle.crt');
            //     curl_setopt($curl, CURLOPT_CAPATH, base_path() . '/uniclix_bundle.crt');
            // }

            $requests[] = $curl;
            curl_multi_add_handle($mh, $curl);

        }

        $running = null;

        do {
            $status = curl_multi_exec($mh, $running);
        } while ($status === CURLM_CALL_MULTI_PERFORM); // || $running

        //Handle CPU drainage
        while ($running && $status == CURLM_OK) {
            if (curl_multi_select($mh) == -1) {
                usleep(1); //Delay between requests for 1 microsecond to calm CPU down
            }

            do {
                $status = curl_multi_exec($mh, $running);
            } while ($status == CURLM_CALL_MULTI_PERFORM);
        }

        foreach ($requests as $identifier => $request) {
            $response[$identifier] = curl_multi_getcontent($request);
            curl_multi_remove_handle($mh, $request);
            curl_close($request);
        }
    }
    return $response;
}

?>
