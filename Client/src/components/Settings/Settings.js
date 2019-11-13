import React from 'react';
import VerticalSettingsMenu from "../Menus/VerticalSettingsMenu";
import SettingsRouter from '../../routes/SettingsRouter';

const menuItems = [
    {   
        id: "profile",
        displayName: "Profile",
        uri: "/settings/profile" 
    },
    {   
        id: "team",
        displayName: "Team",
        uri: "/settings/team" 
    },
    {   
        id: "billing",
        displayName: "Billing",
        uri: "/settings/billing" 
    }
];

const Settings = () => (
    <div className="body-wrap">
        <VerticalSettingsMenu 
            menuItems={menuItems} 
            />
            <div className="body-container">
                <div className="main-section">
                    <SettingsRouter/>
                </div>
            </div>
    </div>
);

export default Settings;