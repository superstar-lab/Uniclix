<?php
 
namespace App\Exceptions;
 
use Exception;
 
class FacebookException extends Exception
{
    /**
     * Report the exception.
     *
     * @return void
     */
    public function report()
    {
    }
 
    /**
     * Render the exception into an HTTP response.
     * 
     * @return \Illuminate\Http\Response
     */
    public function render()
    {
      if ($this->getCode() === 4) {
        return response()->json('Facebook limit error', 419);
      }
    }
}