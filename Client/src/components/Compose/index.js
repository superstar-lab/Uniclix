import React from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import moment from "moment";
import { Select, Input } from "antd";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import { filterFacebookProfiles } from "../../utils/helpers";
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
  setPostNow,
  setPostCalendar,
  setWithError,
} from "../../actions/composer";

import ContentInput from "./components/ContentInput";
import ChannelsRow from "./components/ChannelsRow";
import DateTimeSelector from "./components/DateTimeSelector";
import FooterSection from "./components/FooterSection";
import SelectAccountModal from "./components/SelectAccountsModal";
import { schedulingCount } from "../../requests/channels";
import Preview from "./components/Preview";

const { Option } = Select;

const SCHEDULE = ["Daily", "Weekly", "Monthly", "Yearly"];

class Compose extends React.Component {
  state = {
    channels: this.props.channels,
    showImagesIcon: true,
    showVideosIcon: true,
    uploadImages: [],
    uploadVideos: [],
    scheduleOption: "Daily",
    advancedVisible: true,
    cntRepeat: 0,
    cntScheduling: 0,
  };

  componentWillMount() {
    try {
      schedulingCount()
        .then((response) => {
          this.setState({
            cntScheduling: response.count,
          });
        })
        .catch((error) => {});
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate() {
    const { updatePublishChannels, publishChannels, channels } = this.props;

    // if there are no publish channels, we populate the array with the selected one
    if (!publishChannels) {
      channels.forEach((channel) => {
        if (channel.selected) {
          updatePublishChannels(new Set([channel.details.channel_id]));
          switch (channel.type) {
            case "twitter":
              this.setState({
                showImagesIcon: true,
                showVideosIcon: true,
              });
              break;
            case "linkedin":
              this.setState({
                showImagesIcon: true,
                showVideosIcon: true,
              });
              break;
            case "facebook":
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

  onUploadMedia = (uploadImage = [], uploadVideo = []) => {
    let images = this.state.uploadImages;
    let videos = this.state.uploadVideos;

    uploadImage.forEach((image) => {
      images.push(image);
      this.setState({
        uploadImages: images,
      });
    });

    uploadVideo.forEach((video) => {
      videos.push(video);
      this.setState({
        uploadVideos: videos,
      });
    });
  };

  onUploadCancelMedia = () => {
    this.setState({
      uploadImages: [],
      uploadVideos: [],
      scheduleOption: "Daily",
      advancedVisible: true,
      cntRepeat: 0,
    });
    try {
      schedulingCount()
        .then((response) => {
          this.setState({
            cntScheduling: response.count,
          });
        })
        .catch((error) => {});
    } catch (error) {
      console.log(error);
    }
  };

  onScheduleChange = (scheduleOption) => {
    this.setState({ scheduleOption });
  };

  onAdvancedChange = () => {
    this.setState({
      advancedVisible: false,
    });
  };

  onRepeatChange = (event) => {
    this.setState({
      cntRepeat: event.target.value,
    });
  };

  setPostType = (type) => {
    switch (type) {
      case "now":
        {
          const { selectedTimezone, setPostNow, setPostAtBestTime, setDate } =
            this.props;
          const now = moment().tz(selectedTimezone);

          setPostNow(true);
          setPostAtBestTime(false);
          setDate(now.format("YYYY-MM-DDTHH:mmZ"));
        }
        break;
      case "best":
        {
          const { setPostNow, setPostAtBestTime } = this.props;
          setPostNow(false);
          setPostAtBestTime(true);
        }
        break;
      case "schedule":
        {
          const { setPostNow, setPostAtBestTime } = this.props;
          setPostNow(false);
          setPostAtBestTime(false);
        }
        break;
    }
  };

  clearCategory = () => {
    this.props.setCategory();
  };

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
      accessLevel,
      postCalendar,
      withError,
      setWithError,
    } = this.props;

    const { scheduleOption, advancedVisible, cntRepeat, cntScheduling } =
      this.state;

    const hasValidChannels = channels.length > 0;

    return hasValidChannels ? (
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        className="flex-center modal-no-radius no-outline composer-modal"
      >
        {showSelectAccounts ? (
          <SelectAccountModal selectedAccounts={publishChannels} />
        ) : (
          <div className="modal-content composer-modal-content">
            <div className="composer-container">
              <div className="composer-header">
                <div className="composer-title">Create Post</div>
                <button
                  id="closeModal"
                  type="button"
                  onClick={() => {
                    closeModal(), this.onUploadCancelMedia();
                  }}
                  className="close fa fa-times"
                ></button>
              </div>
              <div className="composer-content">
                <div className="inputs">
                  <ContentInput
                    setContent={setContent}
                    setPictures={setPictures}
                    setVideos={setVideos}
                    content={content}
                    pictures={pictures}
                    videos={videos}
                    showImagesIcon={this.state.showImagesIcon}
                    showVideosIcon={this.state.showVideosIcon}
                    publishChannels={publishChannels}
                    channels={channels}
                    onUploadMedia={this.onUploadMedia}
                    setWithError={setWithError}
                    withError={withError}
                  />
                  <ChannelsRow
                    publishChannels={publishChannels}
                    setShowSelectAccount={setShowSelectAccount}
                    channels={channels}
                    videos={videos}
                  />
                  <div className="separator"></div>
                  <div className="category-section">
                    <div className="subtitle">Category</div>
                    {!category && (
                      <Select
                        value={category}
                        placeholder="Select or create your category (Optional)"
                        onChange={setCategory}
                        size="large"
                        style={{ width: "100%" }}
                      >
                        {categoryOptions &&
                          categoryOptions.map((category) => (
                            <Option
                              key="topic"
                              value={category.id}
                              title={category.category_name}
                            >
                              {category.category_name}
                            </Option>
                          ))}
                      </Select>
                    )}
                    {!!category && (
                      <div className="selected-category-container">
                        <div>
                          {
                            categoryOptions.filter(
                              (cat) => cat.id === category
                            )[0].category_name
                          }
                        </div>
                        <div
                          className="clear-category-button"
                          onClick={this.clearCategory}
                        >
                          <i className="close fa fa-times" />
                        </div>
                      </div>
                    )}
                  </div>
                  {(date || startsAt) && (
                    <DateTimeSelector
                      selectedTimezone={selectedTimezone}
                      setDate={setDate}
                      setPostAtBestTime={setPostAtBestTime}
                      setPostNow={setPostNow}
                      postDate={date ? date : startsAt}
                      postAtBestTime={postAtBestTime}
                      postNow={postNow}
                      accessLevel={accessLevel}
                      cntScheduling={cntScheduling}
                    />
                  )}
                  {advancedVisible == false ? (
                    <div className="repeat-section">
                      <div className="subtitle">Repeating options</div>
                      <div>
                        <div>Repeat</div>
                        <Input
                          className="repeat-input"
                          onChange={this.onRepeatChange}
                        />
                        <div>Times</div>
                        <Select
                          value={scheduleOption}
                          size="large"
                          className="repeat-select"
                          onChange={this.onScheduleChange}
                        >
                          {SCHEDULE &&
                            SCHEDULE.map((schedule) => (
                              <Option
                                key={schedule}
                                value={schedule}
                                title={schedule}
                              >
                                {schedule}
                              </Option>
                            ))}
                        </Select>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <Preview
                  publishChannels={publishChannels}
                  channels={channels}
                  text={content}
                  date={date}
                  timezone={selectedTimezone}
                  pictures={pictures}
                  videos={videos}
                />
              </div>
            </div>
            <FooterSection
              {...this.props}
              publishChannels={publishChannels}
              onPost={onPost}
              accessLevel={accessLevel}
              uploadImages={this.state.uploadImages}
              uploadVideos={this.state.uploadVideos}
              advancedVisible={advancedVisible}
              scheduleOption={scheduleOption}
              cntRepeat={cntRepeat}
              postCalendar={postCalendar}
              onUploadCancelMedia={this.onUploadCancelMedia}
              onAdvancedChange={this.onAdvancedChange}
              setPostType={this.setPostType}
              withError={withError}
            />
          </div>
        )}
      </Modal>
    ) : (
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        className="flex-center modal-no-radius no-outline no-channels-modal"
      >
        <div className="modal-content no-channels-modal-content">
          <h3>Add profiles!</h3>
          <div className="message">
            Due to Facebook policies, we can't post into profile accounts.
            Please go to the accounts settings and add a Facebook group or any
            account from other social media.
          </div>
          <button className="magento-btn pull-right" onClick={closeModal}>
            Got it
          </button>
        </div>
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  setPost: (post) => dispatch(setPost(post)),
  setPostedArticle: (article) => dispatch(setPostedArticle(article)),
  setComposerModal: (modal) => dispatch(setComposerModal(modal)),
  startSetChannels: () => dispatch(startSetChannels()),
  updatePublishChannels: (channelId) =>
    dispatch(updatePublishChannels(channelId)),
  setShowSelectAccount: (state) => dispatch(setShowSelectAccount(state)),
  closeModal: () => dispatch(closeModal()),
  setContent: (content) => dispatch(setContent(content)),
  setPictures: (pictures) => dispatch(setPictures(pictures)),
  setVideos: (videos) => dispatch(setVideos(videos)),
  setCategory: (category) => dispatch(setCategory(category)),
  setDate: (date) => dispatch(setDate(date)),
  setPostAtBestTime: (postAtBestTime) =>
    dispatch(setPostAtBestTime(postAtBestTime)),
  setPostNow: (postNow) => dispatch(setPostNow(postNow)),
  setPostCalendar: (postCalendar) => dispatch(setPostCalendar(postCalendar)),
  setWithError: (withError) => dispatch(setWithError(withError)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
