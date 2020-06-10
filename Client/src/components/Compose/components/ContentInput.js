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
    showImagesIcon: PropTypes.boolean,
    showVideosIcon: PropTypes.boolean,
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

  render() {
    const { content, pictures, videos } = this.props;
    
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
      />
    );
  }
}

export default ContentInput;
