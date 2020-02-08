import React from 'react';
import Modal from 'react-modal';
import {like, unlike, retweet} from '../../requests/twitter/tweets';
import {abbrNum} from '../../utils/numberFormatter';
import TwitterReply from './TwitterReply';
import TwitterReplies from './TwitterReplies';
import { ToastContainer } from "react-toastr";
import Loader from "../../components/Loader";

let toastContainer;


class TwitterActions extends React.Component{

    state = {
        liked: this.props.feedItem.favorited,
        retweeted: this.props.feedItem.retweeted,
        replyBox: false,
        repliesBox: false,
        loading: true
    }

    componentDidMount() {
        this.setState(() => ({
            loading: false
        }));
    }

    likePost = () => {
        const {feedItem, channel, type, updateItem} = this.props;
        const {liked} = this.state;
        this.setState(() => ({loading: true}));
        if(liked) return;
        this.setState(() => ({liked: true}));
        let feedCurrentItem;

        if(type == "twitterDefault"){
            feedCurrentItem = feedItem;
        } else {
            feedCurrentItem = feedItem.status;
        }
        
        like(feedCurrentItem.id_str, channel.id).then((response) => {
            this.setState(() => ({loading: false}));
            if(typeof response !== "undefined"){
                updateItem(feedItem, type, "twitterLike");
            }
        }).catch(e => {this.setState(() => ({liked: false}))});
    }

    unlikePost = () => {
        
        const {feedItem, channel, type, updateItem} = this.props;
        const {liked} = this.state;
        this.setState(() => ({loading: true}));
        if(!liked) return;
        this.setState(() => ({liked: false}));
        let feedCurrentItem;
        
        if(type == "twitterDefault"){
            feedCurrentItem = feedItem;
        } else {
            feedCurrentItem = feedItem.status;
        }

        unlike(feedCurrentItem.id_str, channel.id).then((response) => {
            this.setState(() => ({loading: false}));
            if(typeof response !== "undefined"){
                updateItem(feedItem, type, "twitterUnlike");
            }
        }).catch(e => {this.setState(() => ({liked: true}))});
    }

    retweetPost = () => {
        
        const {feedItem, channel, type, updateItem} = this.props;
        const {retweeted} = this.state;
        this.setState(() => ({loading: true}));
        if(retweeted) return;
        this.setState(() => ({retweeted: true}));
        let feedCurrentItem;

        if(type == "twitterDefault"){
            feedCurrentItem = feedItem;
        } else {
            feedCurrentItem = feedItem.status;
        }

        retweet(feedCurrentItem.id_str, channel.id).then((response) => {
            this.setState(() => ({loading: false}));
            if(typeof response !== "undefined"){
                updateItem(feedItem, type, "twitterRetweets");
            }
        }).catch(e => {this.setState(() => ({retweeted: false}))});
    }

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
        const {feedItem, postData, channel, type} = this.props;
        const {liked, retweeted} = this.state;
        const likedPost = liked ? 'acted' : '';
        const retweetedPost = retweeted ? 'acted' : '';
        let feedCurrentItem;
        
        if(type == "twitterDefault"){
            feedCurrentItem = feedItem;
        } else {
            feedCurrentItem = feedItem.status;
        }

        const likesCount = feedCurrentItem.favorite_count > 0 ? abbrNum(feedCurrentItem.favorite_count) : '';
        const retweetCount = feedCurrentItem.retweet_count > 0 ? abbrNum(feedCurrentItem.retweet_count) : '';
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

                {this.state.loading && <Loader />}
                <div className="stream-action-icons">
                    <img className="action-icon-button" onClick={this.toggleReplyBox} src="images/monitor-icons/back-small.svg" />
                    <span>
                        <img className="action-twitter-icon-button" onClick={() => this.retweetPost()} src="images/monitor-icons/retweets-contact.svg"/>
                        <span className={`status-counter ${retweetedPost} `}> 
                            {retweetCount}
                        </span>
                    </span>
                    <span>
                        <img className="action-icon-button" onClick={() => this.toggleLike()} src="images/monitor-icons/heart-contact-small.svg" />
                        <span className={`status-counter ${likedPost} `}> {likesCount}</span>
                    </span>
                </div>
                <div className="comments">
                    <a href="javascript:void(0)" className="show-comments" onClick={this.toggleRepliesBox}>Show Conversation</a>
                </div>
            </div>
            )
    }
}

export default TwitterActions;