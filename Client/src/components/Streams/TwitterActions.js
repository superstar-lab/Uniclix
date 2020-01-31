import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Popup from "reactjs-popup";
import {like, unlike, retweet, deleteTweet} from '../../requests/twitter/tweets';
import {abbrNum} from '../../utils/numberFormatter';
import TwitterReply from './TwitterReply';
import TwitterReplies from './TwitterReplies';
import { ToastContainer } from "react-toastr";
import { setComposerModal } from "../../actions/composer";
import { setPost } from '../../actions/posts';

let toastContainer;


class TwitterActions extends React.Component{

    state = {
        liked: this.props.feedItem.favorited,
        retweeted: this.props.feedItem.retweeted,
        replyBox: false,
        repliesBox: false
    }

    likePost = () => {
        const {feedItem, channel, type, updateItem} = this.props;
        const {liked} = this.state;
        if(liked) return;
        this.setState(() => ({liked: true}));

        like(feedItem.id_str, channel.id).then((response) => {
            if(typeof response.id !== "undefined"){
                updateItem(response, type);
            }
        }).catch(e => {this.setState(() => ({liked: false}))});
    }

    unlikePost = () => {
        
        const {feedItem, channel, type, updateItem} = this.props;
        const {liked} = this.state;
        if(!liked) return;
        this.setState(() => ({liked: false}));
        
        unlike(feedItem.id_str, channel.id).then((response) => {
            if(typeof response.id !== "undefined"){
                updateItem(response, type);
            }
        }).catch(e => {this.setState(() => ({liked: true}))});
    }

    retweetPost = () => {
        
        const {feedItem, channel, type, updateItem} = this.props;
        const {retweeted} = this.state;
        if(retweeted) return;
        this.setState(() => ({retweeted: true}));
        
        retweet(feedItem.id_str, channel.id).then((response) => {
            if(typeof response.id !== "undefined"){
                updateItem(response, type);
            }
        }).catch(e => {this.setState(() => ({retweeted: false}))});
    }

    handlePostDelete = () => {
        const {feedItem, channel, updateItem} = this.props;

        this.setState(() => ({
            loading: true
        }));

        deleteTweet(feedItem.id_str, channel.id).then((response) => {
            if(typeof response !== "undefined"){
                updateItem(feedItem, "delete");
            }

            this.setState(() => ({
                loading: false
            }));
        }).catch(e => {
            this.setState(() => ({
                loading: false
            }));
        });
    };

    handlePostSchedule = (close) => {
        if(typeof close !== "undefined") close();

        const {postData, setPost, setComposerModal} = this.props;
        const images = postData.media.splice(0, 3);
        let url = typeof(postData.attachmentData) !== "undefined" && typeof(postData.attachmentData.targetUrl) !== "undefined" ? postData.attachmentData.targetUrl : "";
        let content = postData.text;

        if(url && content.indexOf("http") == -1){
            url = decodeURIComponent(url.substring(url.indexOf("u=h") + 2, url.indexOf("h=") - 1));
            content += " "+url;
        } 

        setComposerModal(true); 
        setPost(
            {
             content: content, 
             images: typeof(images) !== "undefined" ? images.map((image) => image.src): [],
             type: 'store'
            });
    };

    toggleLike = () => {
        const {liked} = this.state;

        if(!liked){
            this.likePost();
            return;
        }

        this.unlikePost();
        return
    }

    toggleReplyBox = (message = "") => {

        this.setState(() => ({
            replyBox: !this.state.replyBox
        }), () => {
            
            if(message == "success"){
                toastContainer.success("Message posted.", "Success", {closeButton: true});
            }

            if(message == "error"){
                toastContainer.error("Something went wrong.", "Error", {closeButton: true});
            }
        });
    };

    toggleRepliesBox = () => {

        this.setState(() => ({
            repliesBox: !this.state.repliesBox
        }));
    };

    render(){
        const {feedItem, postData, channel} = this.props;
        const {liked, retweeted} = this.state;
        const likedPost = liked ? 'acted' : '';
        const retweetedPost = retweeted ? 'acted' : '';
        const likesCount = feedItem.favorite_count > 0 ? abbrNum(feedItem.favorite_count) : '';
        const retweetCount = feedItem.retweet_count > 0 ? abbrNum(feedItem.retweet_count) : '';

        return (
            <div>
                <ToastContainer
                    ref={ref => toastContainer = ref}
                    className="toast-top-right"
                />
                {this.state.replyBox &&
                <Modal
                    ariaHideApp={false}
                    className="t-reply-modal"
                    isOpen={this.state.replyBox}
                >
                    <TwitterReply close={this.toggleReplyBox} postData={postData} channel={channel}/>
                </Modal>}

                {this.state.repliesBox && 
                <Modal
                    ariaHideApp={false}
                    className="t-reply-modal"
                    isOpen={this.state.repliesBox}
                >
                    <TwitterReplies close={this.toggleRepliesBox} postData={postData} channel={channel}/>
                </Modal>
                }

                <div className="stream-action-icons">
                    <img onClick={this.toggleReplyBox} src="images/monitor-icons/back-small.svg"></img>
                    <span>
                        <img onClick={() => this.retweetPost()} src="images/monitor-icons/retweets-contact.svg"></img>
                        <span className={`status-counter ${retweetedPost} `}> {retweetCount}</span>
                    </span>
                    <span>
                        <img onClick={() => this.toggleLike()} src="images/monitor-icons/heart-small.svg"></img>
                        <span className={`status-counter ${likedPost} `}> {likesCount}</span>
                    </span>
                    <Popup
                    trigger={<img onClick={() => this.toggleLike()} src="images/monitor-icons/menu.svg"></img>}
                    on="click"
                    position="top center"
                    arrow={true}
                    closeOnDocumentClick={true}
                    >
                    {
                    close => ( 
                        <div className="t-action-menu menu-with-icons">
                            <a href={`mailto:?Subject=I'd like to share this story with you&Body=${feedItem.text}`}>
                                <i className={`fa fa-envelope`}></i>&nbsp;Email
                            </a>
                            <button onClick={() => this.handlePostSchedule(close)}>
                                <i className={`fa fa-clock-o`}></i>Schedule
                            </button>
                            {postData.username === channel.details.username &&
                                (
                                    this.state.loading  ? 
                                    <button className="disabled-btn">
                                        <i className={`fa fa-circle-o-notch fa-spin`}></i>Delete
                                    </button>
                                    :
                                    <button onClick={this.handlePostDelete}>
                                        <i className={`fa fa-trash`}></i>Delete
                                    </button>
                                )
                            }
                        </div>
                    )}
                    </Popup>
                </div>
                <div className="comments">
                    <a href="javascript:void(0)" className="show-comments" onClick={this.toggleRepliesBox}>Show Conversation</a>
                </div>
            </div>
            )
    }
}

const mapDispatchToProps = (dispatch) => ({
    setPost: (post) => dispatch(setPost(post)),
    setComposerModal: (modal) => dispatch(setComposerModal(modal))
});

export default connect(undefined, mapDispatchToProps)(TwitterActions);