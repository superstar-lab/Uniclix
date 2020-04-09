import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Popover, notification } from 'antd';

import { approvePost, destroyPost } from '../../../requests/channels';

import { LoaderWithOverlay } from '../../Loader';
import { Modal } from '../../Modal';

class PostAwaittingApproval extends React.Component {
  static propTypes = {
    timezone: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    channel_ids: PropTypes.array.isRequired,
    post_id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    payload: PropTypes.objectOf({
      images: PropTypes.array.isRequired,
      scheduled: PropTypes.objectOf({
        publishUTCDateTime: PropTypes.string.isRequired,
        publishDateTime: PropTypes.string.isRequired,
        publishTimezone: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    category: PropTypes.objectOf({
      id: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      category_name: PropTypes.string.isRequired
    }).isRequired,
    channels: PropTypes.array.isRequired,
    getAwaitingPosts: PropTypes.func.isRequired,
    article_id: PropTypes.string
  };

  state = {
    confirmationIsOpen: false,
    isLoading: false,
    modalTitle: '',
    modalOnOkCallback: null
  };

  renderChannels() {
    const { channel_ids, channels } = this.props;
    const selectedChannels = channels.filter(channel => channel_ids.indexOf(channel.id) !== -1);

    return selectedChannels.map(channel => (
      <div className="channel-avatar">
        <img src={channel.avatar} />
        <i className={`fab fa-${channel.type} ${channel.type}_bg smallIcon`} />
      </div>
    ))
  }

  toggleModal = (type) => {
    let modalTitle = 'Do you want to approve the post?';
    let modalOnOkCallback = this.approvePost;

    if (type === 'delete') {
      modalTitle = 'Are you sure you want to delete the post?';
      modalOnOkCallback = this.deletePost;
    }
    this.setState({ confirmationIsOpen: true, modalTitle, modalOnOkCallback });
  }

  getPopoverContent = () => {
    return (
      <div className="awaiting-post-popover-content">
        <div onClick={() => this.toggleModal('approve')}>Approve Post</div>
        <div onClick={() => this.toggleModal('delete')}>Delete Post</div>
      </div>
    );
  };

  deletePost = () => {
    const { getAwaitingPosts, post_id } = this.props;

    this.setState({ isLoading: true, confirmationIsOpen: false });
    destroyPost(post_id)
      .then(() => {
        notification.success({
          message: 'Deleted',
          description: 'The post was removed'
        });
        this.setState({ isLoading: false });
        getAwaitingPosts();
      })
      .catch(() => {
        notification.error({
          message: 'Error :(',
          description: "We couldn't remove the post. Please try later."
        });
        this.setState({ isLoading: false });
      });
  };

  approvePost = () => {
    const { getAwaitingPosts, post_id } = this.props;

    this.setState({ isLoading: true, confirmationIsOpen: false });
    approvePost(post_id)
      .then(() => {
        notification.success({
          message: 'Approved!',
          description: 'The post will be posted!'
        });
        this.setState({ isLoading: false });
        getAwaitingPosts();
      })
      .catch(error => {
        console.log(error);
        notification.error({
          message: 'Error :(',
          description: 'Something went wrong and the post could not get approved. Please try again later.'
        });
        this.setState({ isLoading: false });
      });
  };

  onConfirmationOk = () => {
    this.approvePost();
  }

  onConfirmationCancel = () => {
    this.setState({ confirmationIsOpen: false });
  }

  render() {
    const { timezone, content, category, payload: { scheduled, images } } = this.props;
    const { confirmationIsOpen, isLoading, modalTitle, modalOnOkCallback } = this.state;

    return (
      <div className="post-awaiting" style={{borderColor: category.color}}>
        <div className="content">
          { !!images.length && <img src={images[0].absolutePath} /> }
          <span>
            { content }
          </span>
        </div>
        <div className="category">
          <span className="label" style={{ backgroundColor: category.color }}>
            { category.category_name.toUpperCase() }
          </span>
        </div>
        <div className="channels">
          { this.renderChannels() }
        </div>
        <div className="publish-date">
          { moment(scheduled.publishUTCDateTime).tz(timezone).format('DD MMM, h:mm A') }
        </div>
          <Popover content={this.getPopoverContent()} placement="leftTop">
            <div className="actions-container">
              <img src="/images/icons/actions.svg" />
            </div>
          </Popover>
        <Modal
          title={modalTitle}
          onOk={modalOnOkCallback}
          onCancel={this.onConfirmationCancel}
          isOpen={confirmationIsOpen}
        />
        { isLoading && <LoaderWithOverlay /> }
      </div>
    );
  };
};

export default PostAwaittingApproval;
