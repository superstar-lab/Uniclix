import React from 'react';
import Modal from 'react-modal';
import {like, unlike, retweet} from '../../requests/twitter/tweets';
import {abbrNum} from '../../utils/numberFormatter';
import TwitterReply from './TwitterReply';
import TwitterReplies from './TwitterReplies';
import { ToastContainer } from "react-toastr";

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
                    <img className="action-icon-button" onClick={this.toggleReplyBox} src="images/monitor-icons/back-small.svg" />
                    <span>
                        <img onClick={() => this.retweetPost()} src="images/monitor-icons/retweets-contact.svg" style={{width: 28}}/>
                        <span className={`status-counter ${retweetedPost} `}> {retweetCount}</span>
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