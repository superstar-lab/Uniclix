import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Menu } from 'antd';

import { isOwnerOrAdmin } from '../../../../utils/helpers';
import { schedulingTimes } from '../../../../requests/channels';

const postLabels = {
  now: 'Post Now',
  best: 'Add to queue',
  date: 'Schedule Post'
};

class PostButton extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool.isRequired,
    onSavePost: PropTypes.func.isRequired,
    publishType: PropTypes.string.isRequired,
    setPostType: PropTypes.func.isRequired,
    accessLevel: PropTypes.string.isRequired
  };

  state = {
    canQueuePosts: false
  }

  componentDidMount() {
    schedulingTimes().then(res => {
      this.setState({ canQueuePosts: !!res.items.length });
    })
  }

  setPostAtBest = () => {
    const { canQueuePosts } = this.state;

    if (canQueuePosts) {
      this.props.setPostType('best');
    }
  }

  getMenu = () => {
    const { canQueuePosts } = this.state;

    return (
      <Menu>
        <Menu.Item disabled={!canQueuePosts} onClick={this.setPostAtBest}>
          Add to queue
        </Menu.Item>
        <Menu.Item onClick={() => this.props.setPostType('now')}>
          Post now
        </Menu.Item>
        <Menu.Item onClick={() => this.props.setPostType('schedule')}>
          Schedule
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const {
      isDisabled,
      onSavePost,
      publishType,
      accessLevel
    } = this.props;

    return isOwnerOrAdmin(accessLevel) ? (
      <div className="post-button-container">
        <Button
            type="primary"
            shape="round"
            size="large"
            disabled={isDisabled}
            onClick={onSavePost}
          >
          {postLabels[publishType]}
        </Button>
        <Dropdown overlay={this.getMenu()} trigger={['click']} onClick={this.onPostTypeChange}>
          <div className="selector">
            <i className="fa fa-angle-down"></i>
          </div>
        </Dropdown>
      </div>
    ) : (
      <Button
        type="primary"
        shape="round"
        size="large"
        disabled={isDisabled}
        onClick={onSavePost}
      >
        {postLabels[publishType]}
      </Button>
    );
  }
}

export default PostButton;
