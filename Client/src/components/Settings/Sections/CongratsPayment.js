import React from 'react';
import { NavLink } from 'react-router-dom';

class CongratsPayment extends React.Component {

    render() {
        return (
            <div className="accounts-container">
                <div className="block-center">
                    <img src="/images/congrats-img.svg" />
                </div>
                <div className="block-center">
                    <NavLink to="/settings/manage-account">
                        <button className="btn-blue">Go back to accounts</button>
                    </NavLink>
                </div>
            </div>
        );
    };
}


export default CongratsPayment;