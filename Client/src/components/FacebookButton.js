import React from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookButton = ({appId, onSuccess, icon=undefined, cssClass=undefined, textButton=undefined}) => (
    <FacebookLogin
        appId={appId}
        autoLoad={false}
        fields={fbFields}
        scope={fbScope}
        callback={onSuccess}
        icon={icon}
        cssClass={cssClass}
        textButton={textButton} 
        disableMobileRedirect={true}
        />
);

export const fbFields = "name,email,picture";
export const fbScope = "manage_pages,publish_pages,pages_show_list,publish_to_groups,public_profile,email,read_insights,pages_messaging";

export default FacebookButton;