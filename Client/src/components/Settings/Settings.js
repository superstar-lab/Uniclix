import React from 'react';
import SettingsRouter from '../../routes/SettingsRouter';
import channelSelector from "../../selectors/channels";
import { setGlobalChannel } from '../../actions/channels';
import { connect } from "react-redux";
import { settingsMenus } from '../../config/menuItems';
import VerticalMenu from '../Menus/VerticalMenu';

const Settings = ({ channels, selectedChannel, selectChannel, accessLevel }) => (
    <div className="body-wrap">
        <div>
            <VerticalMenu
                menuItems={settingsMenus[accessLevel]}
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
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {},
        accessLevel: state.profile.accessLevel
    };
};

const mapDispatchToProps = (dispatch) => ({
    selectChannel: (id) => dispatch(setGlobalChannel(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);