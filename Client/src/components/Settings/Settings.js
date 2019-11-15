import React from 'react';
import VerticalSettingsMenu from "../Menus/VerticalSettingsMenu";
import SettingsRouter from '../../routes/SettingsRouter';

const menuItems = [
    {
        id: "profile",
        displayName: "Profile",
        uri: "/settings/profile",
        icon: "user"
    },
    {
        id: "team",
        displayName: "Team",
        uri: "/settings/team",
        icon: "users"
    },
    {
        id: "billing",
        displayName: "Manage Account",
        uri: "/settings/billing",
        icon: "user-cog"
    },
    {
        id: "billing",
        displayName: "Billing",
        uri: "/settings/billing",
        icon: "money-bill-alt"
    }
];

const Settings = () => (
    <div className="body-wrap">
        <div>
            <VerticalSettingsMenu
                menuItems={menuItems}
            />
            <div className="body-container">
                <div className="main-section">
                    <SettingsRouter />
                </div>
            </div>
        </div>
    </div>
);

export default Settings;