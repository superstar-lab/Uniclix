import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { notification } from 'antd';

import { isOwnerOrAdmin } from '../../../utils/helpers';
import FunctionModal from '../../Modal';
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
    videos: PropTypes.array,
    category: PropTypes.string.isRequired,
    selectedTimezone: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    postAtBestTime: PropTypes.bool.isRequired,
    postNow: PropTypes.bool.isRequired,
    channels: PropTypes.array.isRequired,
    accessLevel: PropTypes.string.isRequired,
    onPost: PropTypes.func,
    onUploadCancelMedia: PropTypes.func,
    onAdvancedChange: PropTypes.func,
  };

  state = {
    isLoading: false
  };

  canPost = () => {

    const { content, date, publishChannels, pictures, videos } = this.props;

    return (!!content.length || !!pictures.length || !!videos.length) && date && !!publishChannels.size;
  };


  getPublishType = () => {
    let { postAtBestTime, postNow, selectedTimezone, date, accessLevel } = this.props;
    const publishTime = moment(date).tz(selectedTimezone);
    const now = moment().tz(selectedTimezone);

    // We want to prevent the mmebers to post now
    if (publishTime && isOwnerOrAdmin(accessLevel) && !postAtBestTime) {
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
      videos,
      category,
      selectedTimezone,
      date,
      type,
      articleId = '',
      closeModal,
      onPost,
      uploadImages,
      uploadVideos,
      scheduleOption,
      cntRepeat,
      onUploadCancelMedia,
    } = this.props;

    try {

      let bestDate = moment().tz(selectedTimezone).format('YYYY-MM-DDTHH:mmZ');
      const isBest = this.getPublishType() == "best";

      const scheduled = {
        publishUTCDateTime: (isBest) ? bestDate : date,
        publishDateTime: (isBest) ? moment(bestDate).tz(selectedTimezone).format('YYYY-MM-DDTHH:mm') : moment(date).tz(selectedTimezone).format('YYYY-MM-DDTHH:mm'),
        publishTimezone: selectedTimezone
      };

      this.setState({ isLoading: true });
	  
      publish({
        scheduled,
        content,
        images: pictures,
        videos: videos,
        uploadImages: uploadImages,
        uploadVideos: uploadVideos,
        scheduleOption: scheduleOption,
        cntRepeat: cntRepeat,
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
        onUploadCancelMedia();
        notification.success({
          message: 'Done!',
          description: 'The post has been scheduled'
        });
      })
      .catch((error) => {
        console.log(error);
        closeModal();
        onUploadCancelMedia();
        FunctionModal({
          type: 'error',
          title: 'Error',
          content: 'Something went wrong when trying to schedule your post, please try again later.'
        });
      });
    } catch(error) {
      console.log(error);
      this.setState({ isLoading: false });
      closeModal();
      onUploadCancelMedia();
    }
  };

  render() {
    const { closeModal, onUploadCancelMedia, onAdvancedChange, advancedVisible, postAtBestTime, postNow } = this.props;
    const { isLoading } = this.state;
    
    return (
      <div className="footer-section">
        <Button
          type="link"
          className={advancedVisible == true ? "btn-advanced" : "btn-advanced btn-advanced-hidden"}
          onClick={onAdvancedChange}
          disabled={postAtBestTime || postNow}
        >
          Advanced
        </Button>
        <Button type="link" onClick={() => {closeModal(), onUploadCancelMedia()}}>
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
