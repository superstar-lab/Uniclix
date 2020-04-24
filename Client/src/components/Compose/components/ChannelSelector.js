import React from 'react';
import PropTypes from 'prop-types';

import SelectChannelsModal from '../../SelectChannelsModal';

class ChannelSelector extends React.Component {
  static propTypes = {
    publishChannels: PropTypes.array.isRequired,
    showSelectAccounts: PropTypes.bool.isRequired,
    setShowSelectAccount: PropTypes.func.isRequired,
    updatePublishChannels: PropTypes.func.isRequired
  };

  toggleSelectChannelsModal = () => {
    this.props.setShowSelectAccount(!this.props.showSelectAccounts);
  };

  // The channels have a field called "selected". The Channel Selection modal
  // works in base of that, so we need to keep on the same track too.
  onChannelSelectionChange = (selectedChannel) => {
    const publishChannels = this.props.publishChannels.map((channel) => {
      if (channel.id === selectedChannel.id) {
        return {
          ...channel,
          selected: channel.selected ? 0 : 1
        }
      }
      else {
        // If the account type is twitter, we want to make sure that only one is
        // selected. We can not have more than one twitter account selected at the
        // same time.
        if (selectedChannel.type === "twitter" && channel.type === "twitter") {
            return {
              ...channel,
              selected: 0
            }
        } else {
            return {
              ...channel
            };
        }
      }
    });

    this.props.updatePublishChannels(publishChannels);
  };

  render() {
    return (
      <SelectChannelsModal
        channels={this.props.publishChannels}
        onChange={this.onChannelSelectionChange}
        toggle={this.toggleSelectChannelsModal}
      />
    );
  }
}

export default ChannelSelector;
