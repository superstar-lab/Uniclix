import React from 'react';
import SweetAlert from "sweetalert2-react";
import { withRouter } from 'react-router';

class UpgradeAlert extends React.Component {

    redirectTo = (uri) => {
        return this.props.history.push(uri);
    };

    redirectBack = () => {
        return this.props.history.goBack();
    };

    render(){
        const {isOpen, 
            title="Upgrade required", 
            text = "You need to upgrade to use this feature.", 
            goBack, 
            setForbidden,
            toggle = false, 
            redirectUri = "/settings/billing",
            confirmBtn = "Upgrade",
            type="info"} = this.props;
        return (
            <SweetAlert
                show={isOpen}
                title={title}
                text={text}
                showCancelButton
                type={type}
                confirmButtonText={confirmBtn}
                cancelButtonText="No thanks"
                onConfirm={() => {
                    if (setForbidden) setForbidden(false);
                    if (toggle) toggle();
                    return this.redirectTo(redirectUri);
                }}
                onCancel={() => {
                    if (setForbidden) setForbidden(false);
                    if (goBack) return this.redirectBack();
                    return;
                }}
            />   
        );
    }     
}

export default withRouter(UpgradeAlert);