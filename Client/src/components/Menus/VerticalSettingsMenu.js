import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from "react-router-dom";
import {startLogout} from "../../actions/auth";

const VerticalSettingsMenu = ({ menuItems, logout }) => {
    return (
        <div>
            <aside className="vertical-menu gradient-background-teal-blue">
                <MenuItems menuItems={ menuItems } />
                <SupportSection logout={logout}/>
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

const SupportSection = ({logout}) => (
    <div className="support">
        <div>
            <a href="mailto:info@uniclixapp.com?Subject=The%20sky%20is%20falling!"><i className="fa fa-comment"></i> SUPPORT</a>
        </div>
        <div className="logout-btn">
            <a className="link-cursor" onClick={logout}>LOG OUT</a>
        </div>
    </div>
);

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(VerticalSettingsMenu);