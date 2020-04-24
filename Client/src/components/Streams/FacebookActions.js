import React from 'react';
import Modal from 'react-modal';
import Loader from 'react-loader-spinner';
import {abbrNum} from '../../utils/numberFormatter';
import {like, unlike, comment} from '../../requests/facebook/channels';
import FacebookPost from './FacebookPost';
import StreamLoader from "../../components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StreamPost from './StreamPost';
import DraftEditor from '../DraftEditor';

class FacebookActions extends React.Component{

    state = {
        liked: false,
        content: "",
        pictures: [],
        comment: false,
        loading: false,
        postBox: false,
        letterCount: 0,
    }

    componentDidMount(){
        const {feedItem} = this.props;
        try{
            this.setState(() => ({
                liked: feedItem.likes.summary.has_liked
            }));
        }catch(e){
            this.setState(() => ({
                liked: false
            }));
        }
    }

    likePost = () => {
        const {feedItem, channel, updateItem} = this.props;
        const {liked} = this.state;
        this.setState(() => ({loading: true}));
        if(liked) return;
        this.setState(() => ({liked: true}));

        like(feedItem.id, channel.id).then((response) => {
            this.setState(() => ({loading: false}));
            if(typeof response !== "undefined"){
                updateItem(feedItem, "facebookLike");
            }
        }).catch(e => {this.setState(() => ({liked: false}))});
    };

    unlikePost = () => {
        const {feedItem, channel, updateItem} = this.props;
        const {liked} = this.state;
        this.setState(() => ({loading: true}));
        if(!liked) return;
        this.setState(() => ({liked: false}));

        unlike(feedItem.id, channel.id).then((response) => {
            this.setState(() => ({loading: false}));
            if(typeof response !== "undefined"){
                updateItem(feedItem, "facebookUnlike");
            }
        }).catch(e => {this.setState(() => ({liked: true}))});
    };

    commentPost = () => {

        this.setState(() => ({
            loading: true
        }));

        const {feedItem, channel, updateItem} = this.props;
        const {content, pictures} = this.state;

        let image = pictures.length ? pictures[0] : "";

        comment(feedItem.id, channel.id, content, image).then((response) => {
            this.setState(() => ({
                comment: false
            }));

            if(typeof(response.success) !== "undefined") {
                const {feedItem} = this.props;
                toast(
                    <div>
                        <span className="toast-icon">
                            <i className="fa fa-check" style={{color: '#2D86DA'}}></i>
                        </span>
                        Your comment has been posted!
                    </div>, 
                    {
                        containerId: feedItem.id,
                        className: "toast-body",
                    }
                );
                updateItem(feedItem, "facebookComment");            
                this.setState(() => ({
                    content: "",
                    pictures: [],
                    loading: false
                }));
            }else{
                this.setState(() => ({
                    comment: true,
                    loading: false
                }));
                const {feedItem} = this.props;
                toast(
                    <div>
                        <span className="toast-icon">
                            <i className="fa fa-exclamation" style={{color: 'white'}}></i>
                        </span>
                        Your comment has been failed!
                    </div>, 
                    {
                        containerId: feedItem.id,
                        className: "toast-error",
                    }
                );
            }


        }).catch(e => {
            const {feedItem} = this.props;
                toast(
                    <div>
                        <span className="toast-icon">
                            <i className="fa fa-exclamation" style={{color: 'white'}}></i>
                        </span>
                        Your comment has been failed!
                    </div>, 
                    {
                        containerId: feedItem.id,
                        className: "toast-error",
                    }
                );
            this.setState(() => ({
                comment: true,
                loading: false
            }));
        });
    };

    updateContent = (content = "") => {
        this.setState(() => ({
            content: content,
            letterCount: content.length
        }));
    };

    updatePictures = (pictures = []) => {
        this.setState(() => ({
            pictures: pictures
        }));
    };

    toggleLike = () => {
        const {liked} = this.state;

        if(!liked){
            this.likePost();
            return;
        }

        this.unlikePost();
        return
    };

    toggleComment = () => {
        this.setState(() => ({
            comment: !this.state.comment
        }));
    };

    togglePostBox = (message = "") => {
        this.setState(() => ({
            postBox: !this.state.postBox
        }),  () => {
            
            if(message == "success"){
                const {feedItem} = this.props;
                toast(
                    <div>
                        <span className="toast-icon">
                            <i className="fa fa-check" style={{color: '#2D86DA'}}></i>
                        </span>
                        Your sharing has been posted!
                    </div>, 
                    {
                        containerId: feedItem.id,
                        className: "toast-body",
                    }
                );
            }

            if(message == "error"){
                const {feedItem} = this.props;
                toast(
                    <div>
                        <span className="toast-icon">
                            <i className="fa fa-exclamation" style={{color: 'white'}}></i>
                        </span>
                        Your sharing has been failed!
                    </div>, 
                    {
                        containerId: feedItem.id,
                        className: "toast-error",
                    }
                );
            }
        });
    };

    render(){
        
        const {liked, comment} = this.state;
        const {feedItem, postData, channel} = this.props;
        const likedPost = liked ? 'acted' : '';
        const commentPost = comment ? 'acted' : '';
        const likesCount = feedItem.likes.summary.total_count > 0 ? abbrNum(feedItem.likes.summary.total_count) : '';
        const commentsCount = feedItem.comments.summary.total_count > 0 ? abbrNum(feedItem.comments.summary.total_count) : '';
        
        return (
            <div className="fb-actions-container">
                <ToastContainer 
                    enableMultiContainer 
                    containerId={feedItem.id} 
                    position={toast.POSITION.TOP_RIGHT}
                    hideProgressBar={true}
                />

                {this.state.postBox &&
                    <Modal
                        ariaHideApp={false}
                        className="t-reply-modal"
                        isOpen={this.state.postBox}
                    >   
                        <FacebookPost close={this.togglePostBox} postData={postData} channel={channel}/>
                    </Modal>
                }

                {this.state.loading && <StreamLoader />}
                <div className="stream-action-icons">
                    <img className="action-icon-button" onClick={this.togglePostBox} src="images/monitor-icons/back-small.svg"></img>                    
                    <span>
                        <img className="action-facebook-icon-button" onClick={() => this.toggleComment()} src="images/monitor-icons/conversations.svg" />
                        <span className={`status-counter ${commentPost}`}> {commentsCount}</span>
                    </span>
                    <span>
                        <img className="action-icon-button" onClick={() => this.toggleLike()} src="images/monitor-icons/heart-contact-small.svg"/>
                        <span className={`status-counter ${likedPost} `}> {likesCount}</span>
                    </span>
                </div>
                <div>
                    {comment &&
                        <Modal
                        ariaHideApp={false}
                        className="t-reply-modal"
                        isOpen={this.state.comment}
                        >
                            <div className="t-reply-container">
                                <div className="t-reply-heading">
                                <h3>Comment</h3>
                                    <i onClick={this.toggleComment} className="fa fa-close link-cursor"></i>
                                </div>
                                <div className="t-reply-body">
                                    <StreamPost {...postData} type="twitterReply" />
                                </div>
                                <div className="t-reply-footer">
                                    <div className="t-reply-profile">
                                        <span className="pull-left profile-img-container">
                                            <img src={channel.avatar} style={{width: 52}}/>
                                            <i className={`fab fa-${channel.type} ${channel.type}_bg smallIcon`}></i>
                                        </span>
                                        <p>
                                            <span className="font-shape">
                                                {channel.name.charAt(0).toUpperCase() + channel.name.slice(1)}&nbsp;&nbsp;
                                            </span>
                                            replying to @{postData.username}
                                        </p>
                                    </div>
                                    <DraftEditor 
                                        content={this.state.content}
                                        pictures={this.state.pictures}
                                        onChange={this.updateContent}
                                        placeholderText="Write a comment..."
                                        onImagesChange={this.updatePictures}
                                        imageLimit={1}
                                        network="facebook"
                                    />
                                    <p className={`letter-count pull-left ${this.state.letterCount > 250 ? 'red-txt' : ''}`}>{250 - this.state.letterCount} characters left</p>
                                    <div className="t-reply-actions">
                                        <button onClick={this.toggleComment} className="cancelBtn" >Cancel</button>
                                        {this.state.letterCount < 1 || this.state.letterCount > 250 ?
                                            <button className="doneBtn disabled-btn" >Send</button> :
                                            !this.state.loading ? 
                                            <button onClick={this.commentPost} className="doneBtn" >Send</button> :
                                            <button className="doneBtn" ><i className="fa fa-circle-o-notch fa-spin"></i> Sending</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    }
                    {this.state.loading && 
                        <div className="flex-center-h full-width">
                            <Loader type="Bars" color="#46a5d1" height={30} width={30} />
                        </div>
                    }
                </div>

            </div>
        );
    }
}

export default FacebookActions;