import React from 'react';
import { connect } from 'react-redux';
import VerticalMenu from './Menus/VerticalMenu';
import getMenuItems from '../config/menuItems';
import ManageRouter from '../routes/ManageRouter';
import channelSelector from '../selectors/channels';
import { setTwitterChannel } from '../actions/channels';
import Loader from './Loader';

const MasterPage = ({channels, selectedChannel, selectChannel}) => { 
    const hasChannel = typeof(selectedChannel.username) !== 'undefined'; 
    return (
      <div className="body-wrap">
          {!!hasChannel ? 
            <div>
              <VerticalMenu 
                menuItems={getMenuItems(selectedChannel.type)} 
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

  const channels = channelSelector(state.channels.list, unselectedGlobalChannels);
  const selectedChannel = channelSelector(state.channels.list, selectedGlobalChannel);

  return {
    channels,
    selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectChannel: (id) => dispatch(setTwitterChannel(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(MasterPage);