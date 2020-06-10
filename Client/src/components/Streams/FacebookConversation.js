import React from 'react';
import ReadMore from '../ReadMore';
import DraftEditor from '../DraftEditor';
import {sendMessage} from '../../requests/facebook/channels';
import {toHumanTime} from '../../utils/helpers';

class FacebookConversation extends React.Component{

    state = {
        content: "",
        pictures: [],
        videos:[],
        letterCount: 0,
        loading: false
    }

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

    updateVideos = (videos = []) => {
        this.setState(() => ({
            videos: videos
        }));
    };

    send = () => {

        this.setState(() => ({loading: true}));
        const {content} = this.state;
        const {channel, close, feedItem, updateItem} = this.props;
        const conversationId = feedItem.id;
        const channelId = channel.id;
        let updatedItem = feedItem;
        
        sendMessage(content, conversationId, channelId).then((response) => {
            this.setState(() => ({loading: false}));
            console.log(response);
            if(typeof(response.conversation) !== "undefined") {
                updatedItem.messages = response.conversation;
                updateItem(updatedItem, "facebookMessage");
            }
            close("success");
            
        }).catch(e => {
            this.setState(() => ({loading: false}));
            console.log(e);
            close("error");
        });
    }

    render(){
        const {close, messages, channel} = this.props;
        return (
            <div className="t-reply-container scrollbar">
                <div className="t-reply-heading">
                    <h3>Facebook Conversation</h3>
                    <i onClick={close} className="fa fa-close link-cursor"></i>
                </div>
                <div className="t-reply-body fb-conversation-body scrollbar">
                    {typeof(messages) !== "undefined" && typeof(messages.data) !== "undefined" && messages.data.map((message, index) => {
                        return (<div key={index} className={`stream-feed-container`}>
                            <div className="post-info">
                                <img src={channel.name === message.from.name ? channel.avatar : "/images/dummy_profile.png"} />
                                <div className="post-info-item">
                                    <a href="#" className="username"><strong>{message.from.name}</strong></a>
                                    <div className="post-date">{toHumanTime(message.created_time)}</div>
                                </div>
                            </div>
                            <div className="post-content">
                                <ReadMore>{message.message}</ReadMore>
                            </div>
                        </div>)
                    }).reverse()}
                        
                </div>
                <div className="t-reply-footer">
                    <DraftEditor 
                        content={this.state.content}
                        pictures={this.state.pictures}
                        videos={this.state.videos}
                        onChange={this.updateContent}
                        showImagesIcon={false}
                        placeholderText="Write a reply..."
                        onImagesChange={this.updatePictures}
                        onVideoschange={this.updateVideos}
                        network="twitter"
                    />
                    
                    <div className="t-reply-actions">
                        <button onClick={close} className="cancelBtn" >Cancel</button>
                        {this.state.letterCount < 1 ?
                            <button className="doneBtn disabled-btn" >Send</button> :
                            !this.state.loading ? 
                            <button onClick={this.send} className="doneBtn" >Send</button> :
                            <button className="doneBtn" ><i className="fa fa-circle-o-notch fa-spin"></i> Send</button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default FacebookConversation;