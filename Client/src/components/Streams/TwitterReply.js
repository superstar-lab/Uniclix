import React from 'react';
import StreamPost from './StreamPost';
import DraftEditor from '../DraftEditor';
import {tweet} from '../../requests/twitter/channels';

class TwitterReply extends React.Component{

    state = {
        content: "",
        pictures: [],
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

    send = () => {

        this.setState(() => ({loading: true}));
        const {content, pictures} = this.state;
        const {postData, channel, close} = this.props;
        const {statusId} = postData;
        const channelId = channel.id;
        const replyTweet = `@${postData.username} ${content}`;
        
        tweet(replyTweet, pictures, statusId, channelId).then((response) => {
            this.setState(() => ({loading: false}));
            close("success");
            
        }).catch(e => {
            this.setState(() => ({loading: false}));
            console.log(e);
            close("error");
        });
    }

    render(){
        const {close, postData, channel} = this.props;
        return (
            <div className="t-reply-container">
                <div className="t-reply-heading">
                    <h3>Twitter Reply</h3>
                    <i onClick={close} className="fa fa-close link-cursor"></i>
                </div>
                <div className="t-reply-body">
                    <StreamPost {...postData} type="twitterReply"/>
                </div>
                <div className="t-reply-footer">
                    <div className="t-reply-profile">
                        <img src={channel.avatar} />
                        <p>@{channel.username} replying to @{postData.username}</p>
                    </div>
                    <DraftEditor 
                        content={this.state.content}
                        pictures={this.state.pictures}
                        onChange={this.updateContent}
                        placeholderText="Write a reply..."
                        onImagesChange={this.updatePictures}
                        network="twitter"
                    />
                    <p className={`letter-count pull-left ${this.state.letterCount > 280 ? 'red-txt' : ''}`}>{this.state.letterCount}</p>
                    <div className="t-reply-actions">
                        <button onClick={close} className="cancelBtn" >Cancel</button>
                        {this.state.letterCount < 1 || this.state.letterCount > 280 ?
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

export default TwitterReply;