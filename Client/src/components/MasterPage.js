import React from 'react';
import { connect } from 'react-redux';
import VerticalMenu from './Menus/VerticalMenu';
import { getMenuItems, membersMenuItems } from '../config/menuItems';
import { isOwnerOrAdmin } from '../utils/helpers';
import ManageRouter from '../routes/ManageRouter';
import channelSelector from '../selectors/channels';
import { setTwitterChannel } from '../actions/channels';
import Loader from './Loader';
import { filterFacebookProfiles, isOwner } from '../utils/helpers';

const MasterPage = ({channels, selectedChannel, selectChannel, accessLevel, profile}) => {
    const hasChannel = typeof(selectedChannel.username) !== 'undefined';
    const hasBanner = !profile.subscription.activeSubscription && isOwner(profile.accessLevel);

    return (
      <div className={`body-wrap ${hasBanner ? 'with-banner' : ''}`}>
          {!!hasChannel ? 
            <div>
              <VerticalMenu
                menuItems={
                  isOwnerOrAdmin(accessLevel) ?
                    getMenuItems(selectedChannel.type) :
                    membersMenuItems
                }
                channels={channels} 
                selectedChannel={selectedChannel}
                selectChannel={selectChannel}
              />
              <div className="body-container">
                <div className="main-section">
                  <ManageRouter/>
                </div>
              </div>
            </div> :
            <Loader fullscreen />
          }

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
  selectChannel: (id) => dispatch(setTwitterChannel(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(MasterPage);