import React from 'react';
import { ToastContainer } from "react-toastr";
import Modal from 'react-modal';
import Loader from 'react-loader-spinner';
import DraftEditor from '../DraftEditor';
import {abbrNum} from '../../utils/numberFormatter';
import {like, unlike, comment} from '../../requests/facebook/channels';
import FacebookPost from './FacebookPost';
import StreamLoader from "../../components/Loader";

let toastContainer;

class FacebookActions extends React.Component{

    state = {
        liked: false,
        content: "",
        pictures: [],
        comment: false,
        loading: false,
        postBox: false
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
            comment: false,
            loading: true
        }));

        const {feedItem, channel, updateItem} = this.props;
        const {content, pictures} = this.state;

        let image = pictures.length ? pictures[0] : "";

        comment(feedItem.id, channel.id, content, image).then((response) => {
            if(typeof(response.success) !== "undefined") {
                toastContainer.success("Message posted.", "Success", {closeButton: true});
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
                toastContainer.error("Something went wrong.", "Error", {closeButton: true});
            }


        }).catch(e => {
            toastContainer.error("Something went wrong.", "Error", {closeButton: true});
            this.setState(() => ({
                comment: true,
                loading: false
            }));
        });
    };

    updateContent = (content = "") => {
        this.setState(() => ({
            content
        }));
    };

    updatePictures = (pictures = []) => {
        this.setState(() => ({
            pictures
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
                toastContainer.success("Message posted.", "Success", {closeButton: true});
            }

            if(message == "error"){
                toastContainer.error("Something went wrong.", "Error", {closeButton: true});
            }
        });
    };

    onEnterKey = () => {
        this.commentPost();
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
                    ref={ref => toastContainer = ref}
                    className="toast-top-right"
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
                    <span>
                        <img className="action-icon-button" onClick={() => this.toggleLike()} src="images/monitor-icons/heart-contact-small.svg"/>
                        <span className={`status-counter ${likedPost} `}> {likesCount}</span>
                    </span>
                    <span>
                        <img className="action-facebook-icon-button" onClick={() => this.toggleComment()} src="images/monitor-icons/conversations.svg" />
                        <span className={`status-counter ${commentPost}`}> {commentsCount}</span>
                    </span>
                
                    <img className="action-icon-button" onClick={this.togglePostBox} src="images/monitor-icons/back-small.svg"></img>                    
                </div>
                <div>
                    {   comment &&
                        <div>
                            <DraftEditor 
                                content={this.state.content}
                                pictures={this.state.pictures}
                                onChange={this.updateContent}
                                onImagesChange={this.updatePictures}
                                showEmojiIcon={false}
                                placeholderText="Write a comment..."
                                imageLimit={1}
                                onEnterKey={this.onEnterKey}
                                network="facebook"
                            /> 
                            <div className="under-txt">Press ENTER to submit</div>
                        </div>
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