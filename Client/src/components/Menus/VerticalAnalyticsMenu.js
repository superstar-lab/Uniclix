import React from 'react';
import {NavLink} from "react-router-dom";

const VerticalAnalyticsMenu = ({ menuItems }) => {
    return (
        <div>
            <aside className="vertical-menu gradient-background-teal-blue">
                <MenuItems menuItems={ menuItems } />
                <SupportSection />
            </aside>
        </div>
    );
};

const MenuItems = ({ menuItems }) => (
    <ul className="v-menu-links clear-both">
        {menuItems.map((item) => (
            <li key={item.id}><NavLink className="links" to={item.uri}>{item.displayName}</NavLink></li>
        ))}
    </ul>
);

const SupportSection = () => (
    <div className="support">
        <div>
            <a href="mailto:info@oda-lab.com?Subject=The%20sky%20is%20falling!"><i className="fa fa-comment"></i> SUPPORT</a>
        </div>
    </div>
);

export default VerticalAnalyticsMenu;