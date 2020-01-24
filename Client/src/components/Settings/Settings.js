import React from 'react';
import SettingsRouter from '../../routes/SettingsRouter';
import channelSelector from "../../selectors/channels";
import { setGlobalChannel } from '../../actions/channels';
import { connect } from "react-redux";
import VerticalMenu from '../Menus/VerticalMenu';

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
        id: "manage-account",
        displayName: "Manage Account",
        uri: "/settings/manage-account",
        icon: "list"
    },
    {
        id: "billing",
        displayName: "Billing",
        uri: "/settings/billing",
        icon: "money-bill-alt"
    }
];

const Settings = ({ channels, selectedChannel, selectChannel }) => (
    <div className="body-wrap">
        <div>
            <VerticalMenu
                menuItems={menuItems}
                channels={channels}
                selectedChannel={selectedChannel}
                selectChannel={selectChannel}
            />
            <div className="body-container">
                <div className="main-section">
                    <SettingsRouter />
                </div>
            </div>
        </div>
    </div>
);


const mapStateToProps = (state) => {

    const unselectedGlobalChannels = { selected: 0, provider: undefined };
    const selectedGlobalChannel = { selected: 1, provider: undefined };

    const channels = channelSelector(state.channels.list, unselectedGlobalChannels);
    const selectedChannel = channelSelector(state.channels.list, selectedGlobalChannel);

    return {
        channels,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    selectChannel: (id) => dispatch(setGlobalChannel(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);