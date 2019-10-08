import React from 'react';
import {getParameterByName} from '../utils/helpers';

export default class PinterestButton extends React.Component{

    requestOAuthToken = () => {
        const redirectUri = this.props.redirectUri;
        const clientId = this.props.clientId;
        const onSuccess = this.props.onSuccess;
        const onError = this.props.onError;
        
        var oauthUrl = `https://api.pinterest.com/oauth/?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&scope=read_public,write_public&fields=id,username,first_name,last_name,image&state=768uyFys`;

        var width = 450,
          height = 730,
          left = window.screen.width / 2 - width / 2,
          top = window.screen.height / 2 - height / 2;
    
        const targetWindow = window.open(
          oauthUrl,
          "Pinterest",
          "menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=" +
            width +
            ",height=" +
            height +
            ",top=" +
            top +
            ",left=" +
            left
        );

        var targetInterval = setInterval(function(){
          try{
            if(targetWindow.document.domain === window.document.domain){
              if(targetWindow.location.pathname == "/redirect"){
                
                const token = getParameterByName("accessToken", targetWindow.location.href);
                
                if(token){
                  onSuccess({
                    "accessToken": token
                  });
                }else{
                  onError({
                    "error" : "Something went wrong."
                  });
                }

                targetWindow.close();
                clearInterval(targetInterval);
              }
            }
          }catch(e){

          }
        }, 1000);
      };

      render(){
          const {cssClass, icon} = this.props;
          const btnClass = cssClass ? cssClass : "pinterest-login-btn";
          const btnChild = icon ? icon : "Login with Pinterest"
          return(
            <button className={btnClass} onClick={this.requestOAuthToken}>{btnChild}</button>
          );
      }
}