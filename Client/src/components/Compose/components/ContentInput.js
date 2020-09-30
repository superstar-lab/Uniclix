import React from 'react';
import PropTypes from 'prop-types';

import DraftEditor from '../../DraftEditor';

class ContentInput extends React.Component {
  static propTypes = {
    setContent: PropTypes.func.isRequired,
    setPictures: PropTypes.func.isRequired,
    setVideos: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
    pictures: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired,
    publishChannels: PropTypes.array.isRequired,
    channels: PropTypes.array.isRequired,
    showImagesIcon: PropTypes.boolean,
    showVideosIcon: PropTypes.boolean,
    setWithError: PropTypes.func.isRequired,
    withError: PropTypes.bool.isRequired
  };
  
  onContentChange = (newContent) => {
    this.props.setContent(newContent);
  };

  onPictureChange = (pictures = []) => {
    this.props.setPictures(pictures);
  };

  onVideoChange = (videos = []) => {
    this.props.setVideos(videos);
  }

  linkedinChannelIsPresent = () => {
    const { publishChannels, channels } = this.props;
    let isPresent = false;

    publishChannels && publishChannels.forEach(chId => {
      const chIndex = channels.findIndex(channel => channel.id === chId);
      if (chIndex !== -1) {
        if (channels[chIndex].type === 'linkedin') isPresent = true;
      }
    });

    return isPresent;
  }

  twitterChannelIsPresent = () => {
    const { publishChannels, channels } = this.props;
    let isPresent = false;

    publishChannels && publishChannels.forEach(chId => {
      const chIndex = channels.findIndex(channel => channel.id === chId);
      if (chIndex !== -1) {
        if (channels[chIndex].type === 'twitter') isPresent = true;
      }
    });

    return isPresent;
  }

  render() {
    const { content, pictures, videos, publishChannels, channels, setWithError, withError } = this.props;
    const imagesLimit = this.linkedinChannelIsPresent() ? 1 : 4;
    const withTwitter = this.twitterChannelIsPresent();

    return (
      <DraftEditor
        scheduledLabel={null}
        onChange={this.onContentChange}
        onImagesChange={this.onPictureChange}
        onVideosChange={this.onVideoChange}
        content={content}
        pictures={pictures}
        videos={videos}
        showHashtagsIcon={false}
        showImagesIcon={this.props.showImagesIcon}
        showVideosIcon={this.props.showVideosIcon}
        publishChannels={publishChannels}
        channels={channels}
        onUploadMedia={this.props.onUploadMedia}
        imageLimit={imagesLimit}
        withTwitter={withTwitter}
        setWithError={setWithError}
        withError={withError}
      />
    );
  }
}

export default ContentInput;
