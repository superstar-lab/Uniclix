import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { Select } from 'antd';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { filterFacebookProfiles } from '../../utils/helpers';
import { setPost, setPostedArticle } from "../../actions/posts";
import { startSetChannels } from "../../actions/channels";
import {
  setComposerModal,
  updatePublishChannels,
  setShowSelectAccount,
  closeModal,
  setContent,
  setPictures,
  setVideos,
  setCategory,
  setDate,
  setPostAtBestTime,
  setPostNow
} from "../../actions/composer";

import ContentInput from './components/ContentInput';
import ChannelsRow from './components/ChannelsRow';
import DateTimeSelector from './components/DateTimeSelector';
import FooterSection from './components/FooterSection';
import SelectAccountModal from './components/SelectAccountsModal';

const { Option } = Select;

class Compose extends React.Component {  
  state = {
    channels: this.props.channels,
    showImagesIcon: true,
    showVideosIcon: true,
  };

  componentDidUpdate() {
    const { updatePublishChannels, publishChannels, channels } = this.props;

    // if there are no publish channels, we populate the array with the selected one
    if (!publishChannels) {
      channels.forEach(channel => {
        if (channel.selected) {
          updatePublishChannels(new Set([channel.details.channel_id]));
          switch (channel.type) {
            case 'twitter':
              this.setState({
                showImagesIcon: true,
                showVideosIcon: true,
              });
              break;
            case 'linkedin':
              this.setState({
                showImagesIcon: true,
                showVideosIcon: false,
              });
              break;
            case 'facebook':
              this.setState({
                showImagesIcon: true,
                showVideosIcon: true,
              });
              break;
          }
        }
      });
    }
  }

  render() {
    const {
      closeModal,
      isOpen,
      showSelectAccounts,
      publishChannels,
      channels,
      content,
      pictures,
      videos,
      category,
      selectedTimezone,
      date,
      startsAt,
      postAtBestTime,
      postNow,
      categoryOptions,
      setCategory,
      setContent,
      setPictures,
      setVideos,
      setShowSelectAccount,
      setDate,
      setPostAtBestTime,
      setPostNow,
      onPost,
      accessLevel
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        className="flex-center modal-no-radius no-outline composer-modal"
      >
        {
          showSelectAccounts ? (
            <SelectAccountModal
              selectedAccounts={publishChannels}
            />
          ) :
          (
            <div className="modal-content composer-modal-content">
              <div>
                <div className="composer-header">
                  <div className="composer-title">Post</div>
                  <button
                    id="closeModal"
                    type="button"
                    onClick={closeModal}
                    className="close fa fa-times"
                  >
                  </button>
                </div>
                <div className="separator"></div>
                <ChannelsRow
                  publishChannels={publishChannels}
                  setShowSelectAccount={setShowSelectAccount}
                  channels={channels}
                />
                <ContentInput
                  setContent={setContent}
                  setPictures={setPictures}
                  setVideos={setVideos}
                  content={content}
                  pictures={pictures}
                  videos={videos}
                  showImagesIcon={this.state.showImagesIcon}
                  showVideosIcon={this.state.showVideosIcon}
                />
                {
                  (date || startsAt) && (
                    <DateTimeSelector
                      selectedTimezone={selectedTimezone}
                      setDate={setDate}
                      setPostAtBestTime={setPostAtBestTime}
                      setPostNow={setPostNow}
                      postDate={date ? date : startsAt}
                      postAtBestTime={postAtBestTime}
                      postNow={postNow}
                      accessLevel={accessLevel}
                    />
                  )
                }
                <div className="category-section">
                  <div className="subtitle">Category</div>
                  <Select
                    value={category}
                    placeholder="Select or create your category (Optional)"
                    onChange={setCategory}
                    size="large"
                    style={{ width: '100%' }}
                  >
                    {
                      categoryOptions && categoryOptions.map(category => (
                        <Option key="topic" value={category.id} title={category.category_name}>
                          {category.category_name}
                        </Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
              <FooterSection
                {...this.props}
                publishChannels={publishChannels}
                onPost={onPost}
                accessLevel={accessLevel}
              />
            </div>
          )
        }
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const channels = filterFacebookProfiles(state.channels.list);

  return {
    channels,
    post: state.posts.post,
    categoryOptions: state.general.composerCategories,
    accessLevel: state.profile.accessLevel,
    ...state.composer,
  }
}

const mapDispatchToProps = (dispatch) => ({
  setPost: (post) => dispatch(setPost(post)),
  setPostedArticle: (article) => dispatch(setPostedArticle(article)),
  setComposerModal: (modal) => dispatch(setComposerModal(modal)),
  startSetChannels: () => dispatch(startSetChannels()),
  updatePublishChannels: (channelId) => dispatch(updatePublishChannels(channelId)),
  setShowSelectAccount: (state) => dispatch(setShowSelectAccount(state)),
  closeModal: () => dispatch(closeModal()),
  setContent: (content) => dispatch(setContent(content)),
  setPictures: (pictures) => dispatch(setPictures(pictures)),
  setVideos: (videos) => dispatch(setVideos(videos)),
  setCategory: (category) => dispatch(setCategory(category)),
  setDate: (date) => dispatch(setDate(date)),
  setPostAtBestTime: (postAtBestTime) => dispatch(setPostAtBestTime(postAtBestTime)),
  setPostNow: (postNow) => dispatch(setPostNow(postNow))
});

export default connect(mapStateToProps, mapDispatchToProps)(Compose);