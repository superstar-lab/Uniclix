import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import { publish } from '../../../requests/channels';

import Loader from '../../Loader';

const postLabels = {
  now: 'Post Now',
  best: 'Post At Best Time',
  date: 'Schedule Post'
};

class FooterSection extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    publishChannels: PropTypes.array.isRequired,
    content: PropTypes.string.isRequired,
    pictures: PropTypes.array,
    category: PropTypes.string.isRequired,
    selectedTimezone: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    postAtBestTime: PropTypes.bool.isRequired,
    postNow: PropTypes.bool.isRequired,
    channels: PropTypes.array.isRequired,
    onPost: PropTypes.func
  };

  state = {
    isLoading: false
  };

  canPost = () => {
    const { content, category, date, publishChannels, pictures } = this.props;

    return (!!content.length || !!pictures.length) && category && date && !!publishChannels.size;
  };

  getPublishType = () => {
    let { postAtBestTime, postNow, selectedTimezone, date } = this.props;
    const publishTime = moment(date).tz(selectedTimezone);
    const now = moment().tz(selectedTimezone);

    if (publishTime) {
      if (publishTime.isSameOrBefore(now)) {
        postNow = true;
      }
    }

    return postNow ?
      'now' :
      postAtBestTime ?
        'best' :
        'date';
  };

  // This is necessary since we are storing the ids of the channels and the
  // backend expects the whole object
  getPublishChannels = () => {
    const { channels, publishChannels } = this.props;
    const selectedChannels = channels.filter(channel => publishChannels.has(channel.details.channel_id));

    return selectedChannels;
  }

  savePost = () => {
    const {
      id,
      content,
      pictures,
      category,
      selectedTimezone,
      date,
      type,
      articleId = '',
      closeModal,
      onPost,
    } = this.props;

    try {

      const scheduled = {
        publishUTCDateTime: date,
        publishDateTime: moment(date).tz(selectedTimezone).format('YYYY-MM-DDTHH:mm'),
        publishTimezone: selectedTimezone
      };

      this.setState({ isLoading: true });
      publish({
        scheduled,
        content,
        images: pictures,
        publishChannels: this.getPublishChannels(),
        type,
        publishType: this.getPublishType(),
        id,
        articleId,
        category_id: category
      }).then((res) => {
        this.setState({ isLoading: false });
        if (onPost) {
          onPost();
        }
        closeModal();
      })
      .catch((error) => {
        console.log(error);
        closeModal();
      });
    } catch(error) {
      console.log(error);
      this.setState({ isLoading: false });
      closeModal();
    }
  };

  render() {
    const { closeModal } = this.props;
    const { isLoading } = this.state;

    return (
      <div className="footer-section">
        <Button type="link" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          disabled={!this.canPost()}
          onClick={this.savePost}
        >
          {postLabels[this.getPublishType()]}
        </Button>
        { isLoading && <Loader fullscreen />}
      </div>
    );
  }
}

export default FooterSection;
