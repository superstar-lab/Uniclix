import React from 'react';

class CongratsPayment extends React.Component {

    render() {
        return (
            <div className="accounts-container">
                <div className="block-center">
                    <img src="/images/congrats-img.svg" />
                </div>
                <div className="block-center">
                    <a href="/settings/manage-account"><button className="btn-blue">Go back to accounts</button></a>
                </div>
            </div>
        );
    };
}


export default CongratsPayment;