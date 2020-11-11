import React from 'react';
import SettingsRouter from '../../routes/SettingsRouter';
import channelSelector from "../../selectors/channels";
import { setGlobalChannel } from '../../actions/channels';
import { connect } from "react-redux";
import { settingsMenus, getExtraForSettings } from '../../config/menuItems';
import VerticalMenu from '../Menus/VerticalMenu';
import { filterFacebookProfiles, isOwner } from '../../utils/helpers';

const Settings = ({ channels, selectedChannel, selectChannel, accessLevel, profile }) => {
    const hasBanner = !profile.subscription.activeSubscription && isOwner(profile.accessLevel);

    return (
        <div className={`body-wrap ${hasBanner ? 'with-banner' : ''}`}>
            <div>
                <VerticalMenu
                    menuItems={[...settingsMenus[accessLevel], ...getExtraForSettings()]}
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
};


const mapStateToProps = (state) => {

    const unselectedGlobalChannels = { selected: 0, provider: undefined };
    const selectedGlobalChannel = { selected: 1, provider: undefined };

    const channels = filterFacebookProfiles(channelSelector(state.channels.list, unselectedGlobalChannels));
    const selectedChannel = channelSelector(state.channels.list, selectedGlobalChannel);

    return {
        channels,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {},
        accessLevel: state.profile.accessLevel,
        profile: state.profile
    };
};

const mapDispatchToProps = (dispatch) => ({
    selectChannel: (id) => dispatch(setGlobalChannel(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);