import React from 'react';
import PropTypes from 'prop-types';

import DraftEditor from '../../DraftEditor';

class ContentInput extends React.Component {
  static propTypes = {
    setContent: PropTypes.func.isRequired,
    setPictures: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
    pictures: PropTypes.array.isRequired
  };
  
  onContentChange = (newContent) => {
    this.props.setContent(newContent);
  };

  onPictureChange = (pictures = []) => {
    this.props.setPictures(pictures);
  }

  render() {
    const { content, pictures } = this.props;

    return (
      <DraftEditor
        scheduledLabel={null}
        onChange={this.onContentChange}
        onImagesChange={this.onPictureChange}
        content={content}
        pictures={pictures}
        showHashtagsIcon={false}
      />
    );
  }
}

export default ContentInput;
