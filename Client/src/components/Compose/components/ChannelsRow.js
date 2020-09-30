import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FunctionModal from "../../Modal";
import { updatePublishChannels } from '../../../actions/composer';

class ChannelsRow extends React.Component {
  static propTypes = {
    publishChannels: PropTypes.array.isRequired,
    setShowSelectAccount: PropTypes.func.isRequired,
    channels: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired,
  };

  componentWillMount() {
    const { videos } = this.props;
    const selectedChannels = this.getPublishChannels();
    selectedChannels.forEach(channel => {
      if (videos.length != 0 && channel.type == "linkedin" && channel.selected != 1) {
        FunctionModal({
          type: 'error',
          title: 'Warning',
          content: 'Video scheduling is not supported with LinkedIn due to LinkedIn API.',
        });
      }
    });
  }

  toggleSelectChannelsModal = () => {
    this.props.setShowSelectAccount(!this.props.showSelectAccounts);
  };

  // This is necessary since we are storing the ids of the channels and the
  // backend expects the whole object
  getPublishChannels = () => {
    const { channels, publishChannels } = this.props;
    const selectedChannels = channels.filter(channel => publishChannels.has(channel.details.channel_id));

    return selectedChannels;
  }

  deselectChannel = (id) => {
    const { publishChannels, updatePublishChannels } = this.props;

    publishChannels.delete(id);
    updatePublishChannels(publishChannels);
  }

  render() {
    const { publishChannels, channels } = this.props;

    return (
      <div className="channels-section">
        {
          publishChannels && channels
            .map(({ type, avatar, details: { channel_id } }, index) => {
              return publishChannels.has(channel_id) ? (
                <div key={`${type}-${index}`} className="channel">
                  <img src={avatar} />
                  <i className={`fab fa-${type} ${type}_bg`} />
                  <div className="overlay" onClick={() => this.deselectChannel(channel_id)}>
                    <div className="fa fa-times"></div>
                  </div>
                </div>
              ) :
              ''
            })
        }
        <div className="circle" onClick={this.toggleSelectChannelsModal}>
          <i className="fa fa-plus" />
        </div>
      </div>
    );
  }
}

export default connect(null, { updatePublishChannels })(ChannelsRow);
