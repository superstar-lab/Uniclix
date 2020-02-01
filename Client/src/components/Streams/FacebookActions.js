import React from 'react';
import {connect} from 'react-redux';
import { ToastContainer } from "react-toastr";
import Modal from 'react-modal';
import Popup from "reactjs-popup";
import Loader from 'react-loader-spinner';
import DraftEditor from '../DraftEditor';
import {abbrNum} from '../../utils/numberFormatter';
import {like, unlike, comment, deletePost} from '../../requests/facebook/channels';
import FacebookPost from './FacebookPost';
import {setComposerModal} from "../../actions/composer";
import {setPost} from '../../actions/posts';


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
        if(liked) return;
        this.setState(() => ({liked: true}));

        like(feedItem.id, channel.id).then((response) => {
            if(typeof response !== "undefined"){
                updateItem(feedItem, "facebookLike");
            }
        }).catch(e => {this.setState(() => ({liked: false}))});
    };

    unlikePost = () => {
        const {feedItem, channel, updateItem} = this.props;
        const {liked} = this.state;
        if(!liked) return;
        this.setState(() => ({liked: false}));

        unlike(feedItem.id, channel.id).then((response) => {
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

        const {feedItem, channel} = this.props;
        const {content, pictures} = this.state;

        let image = pictures.length ? pictures[0] : "";

        comment(feedItem.id, channel.id, content, image).then((response) => {
            if(typeof(response.success) !== "undefined") {
                
                toastContainer.success("Message posted.", "Success", {closeButton: true});            
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

    handlePostDelete = () => {
        const {feedItem, channel, updateItem} = this.props;

        this.setState(() => ({
            loading: true
        }));

        deletePost(channel.id, feedItem.id).then((response) => {
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

                <div className="stream-action-icons">
                    <span>
                        <i onClick={() => this.toggleLike()} className={`fa fa-thumbs-up ${likedPost}`}></i>
                        <span className={`status-counter ${likedPost} `}> {likesCount}</span>
                    </span>
                    <span>
                    <i onClick={() => this.toggleComment()} className={`fa fa fa-comment ${commentPost}`}></i>
                        <span className={`status-counter ${commentPost}`}> {commentsCount}</span>
                    </span>
                
                    <img onClick={this.togglePostBox} src="images/monitor-icons/back-small.svg"></img>

                    <Popup
                    trigger={<img className="stream-action-menu" src="images/monitor-icons/menu.svg"></img>}
                    on="click"
                    position="bottom left"
                    arrow={true}
                    closeOnDocumentClick={true}
                    >
                    {
                    close => ( 
                        <div className="t-action-menu menu-with-icons">
                            <a href={`mailto:?Subject=I'd like to share this story with you&Body=${postData.text}`}>
                                <i className={`fa fa-envelope`}></i>&nbsp;Email
                            </a>
                            <button onClick={() => this.handlePostSchedule(close)}>
                                <i className={`fa fa-clock-o`}></i>Schedule
                            </button>
                            {feedItem.from.id === channel.details.payload.id &&
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

const mapDispatchToProps = (dispatch) => ({
    setPost: (post) => dispatch(setPost(post)),
    setComposerModal: (modal) => dispatch(setComposerModal(modal))
});

export default connect(undefined, mapDispatchToProps)(FacebookActions);