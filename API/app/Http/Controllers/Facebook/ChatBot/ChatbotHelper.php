<?php
namespace App\Http\Controllers\Facebook\ChatBot;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
class ChatbotHelper
{
    protected $chatbotAI;
    protected $facebookSend;
    protected $log;
    private $accessToken;
    public $config;
    /**
     * ChatbotHelper constructor.
     *
     * @throws \Exception
     */
    public function __construct()
    {   
        $pageToken = 'EAADpF3W1resBAKbqKGZAiFabHeNJgohpB9bq9SLuccr9EZCqIXRmZAq5zGZAuoX7TmZCWKGN09uaZA6y5JyIZAazfy9gztqXT98l7EdIQ6Etbe5HsErVPWQaEZB27Fd0vJ7HZAXO0jx2gCqkulVtrtpn0GxQFDKfkXm00jZAp33JRwNjXXxFXd19TRZBFZCKJ7OViAcZD';
        $this->accessToken = $pageToken;
        $this->config = [
            'webhook_verify_token' => '200200200',
            'access_token'         => $pageToken,
            'dialogflow_token'     => '',
            'witai_token'          => '',
        ];

        $this->chatbotAI = new ChatbotAI($this->config);
        $this->facebookSend = new FacebookSend();
        $this->log = new Logger('general');
        $this->log->pushHandler(new StreamHandler('debug.log'));
    }
    /**
     * Get the sender id of the message
     * @param $input
     * @return mixed
     */
    public function getSenderId($input)
    {
        return $input['entry'][0]['messaging'][0]['sender']['id'];
    }
    /**
     * Get the user's message from input
     * @param $input
     * @return mixed
     */
    public function getMessage($input)
    {
        return $input['entry'][0]['messaging'][0]['message']['text'];
    }
    /**
     * Check if the callback is a user message
     * @param $input
     * @return bool
     */
    public function isMessage($input)
    {
        return isset($input['entry'][0]['messaging'][0]['message']['text']) && !isset
        ($input['entry'][0]['messaging'][0]['message']['is_echo']);
    }
    /**
     * Get the answer to a given user's message
     * @param null $api
     * @param string $message
     * @return string
     */
    public function getAnswer($message, $api = null)
    {
        if ($api === 'dialogflow') {
            return $this->chatbotAI->getDialogflowAnswer($message);
        } elseif ($api === 'rates') {
            return $this->chatbotAI->getForeignExchangeRateAnswer($message);
        } else {
            return $this->chatbotAI->getAnswer($message);
        }
    }
    /**
     * Send a reply back to Facebook chat
     * @param $senderId
     * @param $replyMessage
     */
    public function send($senderId, string $replyMessage)
    {
        return $this->facebookSend->send($this->accessToken, $senderId, $replyMessage);
    }
    /**
     * Verify Facebook webhook
     * This is only needed when you setup or change the webhook
     * @param $request
     * @return mixed
     */
    public function verifyWebhook($request)
    {
        if (!isset($request['hub_challenge'])) {
            return false;
        };
        $hubVerifyToken = null;
        $hubVerifyToken = $request['hub_verify_token'];
        $hubChallenge = $request['hub_challenge'];
        if (isset($hubChallenge) && $hubVerifyToken == $this->config['webhook_verify_token']) {
            echo $hubChallenge;
        }
    }
}