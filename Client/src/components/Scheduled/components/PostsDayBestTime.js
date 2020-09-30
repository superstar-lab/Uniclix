import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, Select, TimePicker} from 'antd';
import moment from "moment";
import {connect} from "react-redux";
import {setComposerModal, setComposerToEdit, setPostAtBestTime, setPostCalendar} from "../../../actions/composer";
import Loader from "../../Loader";
import {destroyPost} from "../../../requests/channels";

const { Option } = Select;

class PostsDayBestTime extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  getDateTime = (time) => {
    const { timezone } = this.props;
    const dateTime = moment.tz(time, 'yyyy-mm-dd h:mm A', timezone).format('h:mm A');

    return dateTime;
  };

  toggleLoading = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  deleteBestPost = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    const { bestTime, fetchMoreData,onResetPage, fetchPosts } = this.props;

    this.toggleLoading();
    destroyPost(bestTime.post_id)
      .then(() => {
        this.toggleLoading();
        onResetPage();
        fetchMoreData();
        fetchPosts();
        this.setState({
          visible: false,
        });
      })
      .catch(() => {
        this.toggleLoading();
      });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  editBestPost = () => {
    const { bestTime, timezone, setComposerToEdit, setPostAtBestTime, setPostCalendar } = this.props;
    const {
      post_id,
      channel_ids,
      content,
      payload: { images, videos, scheduled: { publishUTCDateTime } },
      category_id,
      posted
    } = bestTime;

    if (!posted) {
      const date = moment(publishUTCDateTime).tz(timezone).format('YYYY-MM-DDTHH:mmZ');

      const postData = {
        id: post_id,
        publishChannels: new Set(channel_ids),
        content,
        pictures: images,
        videos: videos,
        category: category_id,
        date,
        selectedTimezone: timezone
      };

      setComposerToEdit(postData);
      setPostAtBestTime(true);
      setPostCalendar('Day');
    }
  };

  render() {
    const { channelsList, bestTime, weekdayNames, fetchMoreData, postNow } = this.props;
    const { isLoading, visible } = this.state;
    const { post_id, content, payload: { scheduled: { publishDateTime }, images, videos }, category, channel_ids } = bestTime;
    const channels = channelsList.filter(channel => channel_ids.indexOf(channel.id) !== -1);

    return (
      <div className="infinite-best-time">
        <div className="infinite-best-time-title">
          <div  className="col-xs-12 col-md-11">
            <div className="content">{content}</div>
            <div className="infinite-best-media-preview">
              {images.length > 0 ?
                images.map((image, index) => (
                  <img src={image} className="preview" alt="preview"/>
                ))
                :
                videos.length > 0 ?
                  videos.map((video, index) => (
                    <video src={video} className="preview" alt="preview"/>
                  ))
                  :
                  ""
              }
            </div>
          </div>
          <i className="fa fa-close" onClick={this.deleteBestPost}/>
        </div>
        <div className="infinite-best-time-boundary" />
        <div className="infinite-best-time-body">
          <div className="infinite-best-time-body-footer col-md-9">
            <div className="infinite-best-time-channels">
              {
                channels.map(({ type, avatar }, index) => (
                  <div key={`${type}-${index}`}>
                    <img src={avatar} />
                    <i className={`fab fa-${type} ${type}_bg`} />
                  </div>
                ))
              }
            </div>
            <div className="infinite-best-time-category" style={{ backgroundColor: category.color }}>{category.category_name}</div>
            <div className="infinite-best-time-post"><p>This post will be published {weekdayNames} at {this.getDateTime(publishDateTime)}</p></div>
          </div>
          <div className="infinite-best-time-body-footer-btn col-md-3">
            <Button type="link" size="medium" onClick={this.editBestPost}>
              Edit
            </Button>
            <Button
              type="primary"
              shape="round"
              size="medium"
              onClick={()=>postNow(post_id)}
            >
              Share Now
            </Button>
          </div>
        </div>
        <Modal
          title="Delete post"
          visible={visible}
          okText="Yes, Delete it"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={400}
          style={{ top: 300 }}
        >
          Are you sure you want to delete the post?
        </Modal>
        { isLoading && <Loader fullscreen /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channelsList: state.channels.list,
  };
};

export default connect(mapStateToProps, { setComposerModal, setComposerToEdit, setPostAtBestTime, setPostCalendar })(PostsDayBestTime);