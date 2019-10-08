import React from 'react';
import {connect} from 'react-redux'
import Modal from 'react-modal';
import StreamFeedMedia from './StreamFeedMedia';
import ReadMore from '../ReadMore';
import {truncate} from '../../utils/helpers';
import {toHumanTime} from '../../utils/helpers';
import TwitterInfoCard from './TwitterInfoCard';
import TwitterReplies from './TwitterReplies';
import FacebookInfoCard from './FacebookInfoCard';
import channelSelector from '../../selectors/channels';

class StreamPost extends React.Component{

    state = {
        hashStreamModal: false,
        keyword: false
    }

    toggleHashStreamModal = (arg = false) => {
        
        if(typeof arg === 'string' && arg.indexOf("#") !== -1){
            this.setState(() => ({
                hashStreamModal: !this.hashStreamModal,
                keyword: arg
            })); 
        }
    };

    render(){
        const {profileImg, 
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
                reload, 
                selectedTab,
            twitterChannel} = this.props;
        const postTime = date ? toHumanTime(date) : "";
        return (<div className="stream-feed-container">

                    <Modal
                        ariaHideApp={false}
                        className="t-reply-modal"
                        isOpen={this.state.hashStreamModal}
                    >
                        <TwitterReplies close={() => this.setState(() => ({hashStreamModal: false}))} 
                        postData={this.props} 
                        keyword={this.state.keyword} 
                        channel={networkType !== "twitter" && twitterChannel ? twitterChannel : channel} 
                        reload={reload} 
                        selectedTab={selectedTab} />
                    </Modal>

                    <div className="post-info">
                        <img src={profileImg} />
                        <div className="post-info-item">
                            {networkType == "twitter" && <TwitterInfoCard username={username} channelId={channel.id}/>}
                            {networkType == "facebook" && <FacebookInfoCard username={username} channelId={channel.id} accountId={accountId}/>}
                            <div className="post-date">{postTime}</div>
                        </div>
                    </div>
                    <div className="post-content">
                        {
                            typeof(sharedStatus) !== "undefined" ? (
                                
                                <div className="shared-status">
                                    <span className="status-type"><i className="fa fa-retweet"></i> Retweeted </span>
                                    <div className="post-info">
                                        <img src={sharedStatus.user.profile_image_url_https} />
                                        <div className="post-info-item">
                                            <TwitterInfoCard username={sharedStatus.user.screen_name} channelId={channel.id}/>
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
                            (   !text && networkType === "facebook" ?
                                
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
                        typeof(attachmentData) !== "undefined" && attachmentData.attachmentType === "share" ?
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
                        (typeof(sharedStatus) === "undefined" && <StreamFeedMedia setImages={setImages} media={media}></StreamFeedMedia>)
                    }

                    {children}
                </div>);
    }
};


const mapStateToProps = (state) => {
    const twitterChannels = channelSelector(state.channels.list, {selected: undefined, provider: "twitter"});
    return {
        twitterChannel: twitterChannels.length > 0 ? twitterChannels[0] : false
    }
}

export default connect(mapStateToProps)(StreamPost);