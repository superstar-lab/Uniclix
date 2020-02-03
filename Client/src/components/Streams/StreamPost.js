import React from 'react';
import { connect } from 'react-redux'
import Modal from 'react-modal';
import Popup from "reactjs-popup";
import StreamFeedMedia from './StreamFeedMedia';
import ReadMore from '../ReadMore';
import { deleteTweet } from '../../requests/twitter/tweets';
import { deletePost } from '../../requests/facebook/channels';
import { truncate } from '../../utils/helpers';
import { toHumanTime } from '../../utils/helpers';
import TwitterInfoCard from './TwitterInfoCard';
import TwitterReplies from './TwitterReplies';
import FacebookInfoCard from './FacebookInfoCard';
import channelSelector from '../../selectors/channels';
import { setComposerModal } from "../../actions/composer";
import { setPost } from '../../actions/posts';


const popupStyle = {
    width: 145,
    border: 0,
    borderRadius: 8,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)'
}

class StreamPost extends React.Component {

    state = {
        hashStreamModal: false,
        keyword: false
    }

    toggleHashStreamModal = (arg = false) => {

        if (typeof arg === 'string' && arg.indexOf("#") !== -1) {
            this.setState(() => ({
                hashStreamModal: !this.hashStreamModal,
                keyword: arg
            }));
        }
    };

    handlePostDelete = (close) => {
        const { feedItem, channel, updateItem, type } = this.props;

        this.setState(() => ({
            loading: true
        }));

        if (type == "facebook") {
            deletePost(channel.id, feedItem.id).then((response) => {
                if (typeof response !== "undefined") {
                    updateItem(feedItem, "delete");
                }

                this.setState(() => ({
                    loading: false
                }));
                if (typeof close !== "undefined") close();
            }).catch(e => {
                this.setState(() => ({
                    loading: false
                }));
                if (typeof close !== "undefined") close();
            });
        } else {
            deleteTweet(feedItem.id_str, channel.id).then((response) => {
                if (typeof response !== "undefined") {
                    updateItem(feedItem, "delete");
                }

                this.setState(() => ({
                    loading: false
                }));
                if (typeof close !== "undefined") close();
            }).catch(e => {
                this.setState(() => ({
                    loading: false
                }));
                if (typeof close !== "undefined") close();
            });
        }
    };

    handlePostSchedule = (close) => {
        if (typeof close !== "undefined") close();

        const { attachmentData, media, setPost, text, setComposerModal } = this.props;
        const images = media.splice(0, 3);
        let url = typeof (attachmentData) !== "undefined" && typeof (attachmentData.targetUrl) !== "undefined" ? attachmentData.targetUrl : "";
        let content = text;

        if (url && content.indexOf("http") == -1) {
            url = decodeURIComponent(url.substring(url.indexOf("u=h") + 2, url.indexOf("h=") - 1));
            content += " " + url;
        }

        setComposerModal(true);
        setPost(
            {
                content: content,
                images: typeof (images) !== "undefined" ? images.map((image) => image.src) : [],
                type: 'store'
            });
    };

    render() {
        const { profileImg,
            username,
            date,
            text,
            media,
            setImages,
            children,
            statusId,
            attachmentData,
            sharedStatus,
            networkType,
            channel,
            accountId,
            feedItem,
            type,
            reload,
            selectedTab,
            twitterChannel } = this.props;
        const postTime = date ? toHumanTime(date) : "";
        return (<div className="stream-feed-container">

            <Modal
                ariaHideApp={false}
                className="t-reply-modal"
                isOpen={this.state.hashStreamModal}
            >
                <TwitterReplies close={() => this.setState(() => ({ hashStreamModal: false }))}
                    postData={this.props}
                    keyword={this.state.keyword}
                    channel={networkType !== "twitter" && twitterChannel ? twitterChannel : channel}
                    reload={reload}
                    selectedTab={selectedTab} />
            </Modal>

            <div className="post-info">
                <img src={profileImg} />
                <div className="post-info-item">
                    {networkType == "twitter" && <TwitterInfoCard username={username} channelId={channel.id} />}
                    {networkType == "facebook" && <FacebookInfoCard username={username} channelId={channel.id} accountId={accountId} />}
                    <div className="post-date">{postTime}</div>
                </div>
                {
                    type == "facebook" || networkType == "twitter" ?
                        <Popup
                            trigger={<img className="stream-action-menu" src="images/monitor-icons/menu.svg"></img>}
                            on="click"
                            contentStyle={popupStyle}
                            position="bottom left"
                            arrow={false}
                            closeOnDocumentClick={true}
                        >
                            {
                                close => (
                                    <div className="t-action-menu menu-with-icons">
                                        <a href={`mailto:?Subject=I'd like to share this story with you&Body=${type == "facebook" ? text : feedItem.text}`}>
                                            Email
                                        </a>
                                        <button onClick={() => this.handlePostSchedule(close)}>
                                            Schedule
                                        </button>
                                        {
                                            type == "facebook" ?
                                                feedItem.from.id === channel.details.payload.id &&
                                                (
                                                    this.state.loading ?
                                                        <button className="disabled-btn">
                                                            Delete
                                                        </button>
                                                        :
                                                        <button onClick={this.handlePostDelete}>
                                                            Delete
                                                        </button>
                                                )
                                                :
                                                username === channel.details.username &&
                                                (
                                                    this.state.loading ?
                                                        <button className="disabled-btn">
                                                            Delete
                                                        </button>
                                                        :
                                                        <button onClick={this.handlePostDelete}>
                                                            Delete
                                                        </button>
                                                )
                                        }
                                    </div>
                                )}
                        </Popup>
                        : null
                }
            </div>
            <div className="post-content">
                {
                    typeof (sharedStatus) !== "undefined" ? (

                        <div className="shared-status">
                            <span className="status-type"><i className="fa fa-retweet"></i> Retweeted </span>
                            <div className="post-info">
                                <img src={sharedStatus.user.profile_image_url_https} />
                                <div className="post-info-item">
                                    <TwitterInfoCard username={sharedStatus.user.screen_name} channelId={channel.id} />
                                    <div className="post-date">{sharedStatus.created_at ? toHumanTime(sharedStatus.created_at) : ""}</div>
                                </div>
                            </div>

                            {twitterChannel ?
                                <ReadMore onTagClick={this.toggleHashStreamModal}>{sharedStatus.text}</ReadMore>
                                :
                                <ReadMore>{sharedStatus.text}</ReadMore>
                            }

                            <StreamFeedMedia setImages={setImages} media={media}></StreamFeedMedia>
                        </div>
                    )
                        :
                        (!text && networkType === "facebook" ?

                            <div>{username} shared a <a href={`https://www.facebook.com/${statusId.split('_')[0]}/posts/${statusId.split('_')[1]}`} target="_blank">post</a></div>
                            :
                            twitterChannel ?
                                <ReadMore onTagClick={this.toggleHashStreamModal}>{text}</ReadMore>
                                :
                                <ReadMore>{text}</ReadMore>
                        )
                }

            </div>
            {
                typeof (attachmentData) !== "undefined" && attachmentData.attachmentType === "share" ?
                    <a target="_blank" href={attachmentData.targetUrl}>
                        <div className="link-preview">
                            {
                                attachmentData.media.length ?
                                    <div className="link-img">
                                        <img src={media[0].src} />
                                    </div>
                                    :
                                    <div></div>
                            }
                            <div className="link-info">
                                <h4>{attachmentData.title}</h4>
                                <p>{truncate(attachmentData.description, 150)}</p>
                            </div>

                        </div>
                    </a>
                    :
                    (typeof (sharedStatus) === "undefined" && <StreamFeedMedia setImages={setImages} media={media}></StreamFeedMedia>)
            }

            {children}
        </div>);
    }
};


const mapStateToProps = (state) => {
    const twitterChannels = channelSelector(state.channels.list, { selected: undefined, provider: "twitter" });
    return {
        twitterChannel: twitterChannels.length > 0 ? twitterChannels[0] : false
    }
}

const mapDispatchToProps = (dispatch) => ({
    setPost: (post) => dispatch(setPost(post)),
    setComposerModal: (modal) => dispatch(setComposerModal(modal))
});

export default connect(mapStateToProps, mapDispatchToProps)(StreamPost);