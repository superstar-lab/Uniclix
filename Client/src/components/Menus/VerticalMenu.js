import React from 'react';
import { NavLink } from "react-router-dom";
import Popup from "reactjs-popup";
import { supportEmail } from "../../requests/profile";
import { ToastContainer } from "react-toastr";

let toastContainer;

const VerticalMenu = ({ menuItems, channels, selectedChannel, selectChannel, trialEnded }) => {
    return (
        <aside className="vertical-menu scrollbar">
            <div>
                <ProfileInfo
                    selectedChannel={selectedChannel}
                    channels={channels}
                    trialEnded={trialEnded}
                    selectChannel={selectChannel} />

                <MenuItems menuItems={menuItems} />
            </div>
            <SupportSection />
        </aside>
    );
};

class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        channelMenu: false,
        activeChannels: []
    }

    toggleDropdown = () => {
        this.setState(() => ({
            channelMenu: !this.state.channelMenu
        }));
    }

    activeChannels = (channels) => {
        return channels
        let msDiff = new Date(this.props.trialEnded).getTime() - new Date().getTime();
        if (Math.floor(msDiff / (1000 * 60 * 60 * 24)) >= 0) {
           
        } else {
            let activeChannels = channels.filter(channel => {
                if (channel.details.paid == 1)
                    return channel;
            });

            return activeChannels;
        }
    }

    render() {
        const { selectedChannel, selectChannel, channels } = this.props;

        return (

            <div>
                <div className="profile-info selected-profile" onClick={this.toggleDropdown}>
                    <span className="pull-left profile-img-container">
                        <img onError={(e) => e.target.src = '/images/dummy_profile.png'} src={selectedChannel.avatar} />
                        <i className={`fab fa-${selectedChannel.type} ${selectedChannel.type}_bg smallIcon`}></i>
                    </span>
                    <div>
                        {
                            !!selectedChannel.username ?
                                <p className="profile-username">{`@${selectedChannel.username}`}</p> :
                                <p className="profile-name" title={selectedChannel.name}>{selectedChannel.name}</p>
                        }
                    </div>
                </div>

                <ProfileSelectionDropDown
                    channels={this.activeChannels(channels)}
                    selectChannel={selectChannel}
                    isOpen={this.state.channelMenu}
                />
            </div>

        );
    }
}

const ProfileSelectionDropDown = ({ channels, selectChannel, isOpen }) => (
    <div
        className={`channel-selection-menu select-channel ${isOpen ? 'is-open' : ''}`}
        // We need to calculate the height this way in order to have a nice animation when
        // showing the accounts since height will change depending on the amount of
        // channels and using an 'auto' value don't work with animations
        style={isOpen && channels.length ? { height: 85.5 * (channels.length + 1) } : {}}
    >
        <div>
            {!!channels.length &&
                channels.map((channel) => (
                    <ProfileSelectionItem key={channel.id} channel={channel} selectChannel={selectChannel} />
                ))
            }
            <NavLink to="/settings/manage-account" className="add-profile channel-container">
                <div className="circle">
                    <i className="fa fa-plus" />
                </div>
                <p>Add new account</p>
            </NavLink>
        </div>
    </div>
);

const ProfileSelectionItem = ({ channel, selectChannel }) => (
    <div className="channel-container">
        <a href="#" className="block-urls" onClick={(e) => { selectChannel(channel.id) }}>
            <div className="profile-info ">
                <span className="profile-img-container">
                    <img onError={(e) => e.target.src = '/images/dummy_profile.png'} src={channel.avatar} />
                    <i className={`fab fa-${channel.type} ${channel.type}_bg smallIcon`}></i>
                </span>
                <div>
                    {
                        !!channel.username ?
                            <p className="profile-username">{`@${channel.username}`}</p> :
                            <p className="profile-name" title={channel.name}>{channel.name}</p>
                    }
                </div>
            </div>
        </a>
    </div>
);

class MenuItems extends React.Component {
    render() {
        const { menuItems } = this.props;

        return (
            <ul className="v-menu-links clear-both">
                {menuItems.map((item) => (
                    <li key={item.id} ><NavLink className="links" to={item.uri}><i className={`fa fa-${item.icon}`}></i> <span>{item.displayName}</span></NavLink></li>
                ))}
            </ul>
        );
    }
}

const SupportSection = () => {

    return (
        <div className="support">
            <a
                className="support-section"
                href="mailto:info@uniclixapp.com"
                target="_blank"
            >
                <div className="button">
                    <i className="fa fa-comment"></i>
                    Support
                </div>
            </a>
        </div>
    );
}

export default VerticalMenu;