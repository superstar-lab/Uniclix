import React from 'react';
import StreamPost from './StreamPost';
import {getStatusReplies} from '../../requests/twitter/channels';
import {getStreamFeed, addStream} from '../../requests/streams';
import {AvatarWithText} from '../Loader';


class TwitterReplies extends React.Component{
    state = {
        replies: [],
        items: [],
        loading: false
    }

    componentDidMount(){
        const {postData, channel, keyword = false} = this.props;
        this.setState(() => ({
            loading: true
        }));

        if(!keyword){
            getStatusReplies(channel.id, postData.username, postData.statusId)
            .then(response => {
                this.setState(() => ({
                    replies: response,
                    loading: false
                }));
            }).catch(error => {
                this.setState(() => ({
                    loading: false
                }));
                console.log(error);
            });
        }else{
            getStreamFeed("search", "twitter", channel.id, keyword, "").then((response) => {
            
                const items = typeof response["data"] !== "undefined" ? response["data"] : response;
    
                this.setState(() => ({
                    items: items.length ? items : this.state.items,
                    loading: false
                }));
                
                if(!items.length) return;
            }).catch(e => {
                this.setState(() => ({loading: false}));  
            });
        }

    }

    submitStream = () => {

        this.setState(() => ({
            loading: true
        }));

        const {channel, selectedTab, close, reload, keyword} = this.props;

        const channelId = channel.id;
        const network = "twitter";
        const searchTerm = keyword;
        const item = {label: searchTerm, value: 'search'}

        return addStream(item, channelId, selectedTab, network, searchTerm).then(() => reload()).then(() => {
            this.setState(() => ({
                loading: false
            }));
           if(typeof close !== "undefined") close();
        });
    };

    render(){
        const {close, postData, keyword, reload} = this.props;
        const {replies, loading, items} = this.state;

        return (
            <div className="body-wrap">            
                <div className="t-reply-container">
                    <div className="t-reply-heading">
                        <h3>Show {keyword ? keyword + ' results' : 'Conversations'}</h3>
                        <i onClick={close} className="fa fa-close link-cursor"></i>
                    </div>
                    <div className="t-reply-body-container">
                        <div className="t-reply-body">
                            {!keyword && <StreamPost {...postData} reload={reload} type="twitterReplies"/>}
                            {keyword && items.map((item, index) => {
                                return <TwitterStatusReply key={index} reply={item} parentPostData={postData} reload={reload}/>
                            })}
                        </div>
                    </div>                        
                    <div className="comments twitter-convo">
                        {loading && <AvatarWithText />}
                        {replies.map((reply, index) => {
                            return <TwitterStatusReply key={index} reply={reply} parentPostData={postData} reload={reload}/>
                        })}
                    </div>
                {keyword && <div className="text-center m10">
                    <button className="btn btn-primary" onClick={this.submitStream}>Save as new stream</button>
                </div>}   
                </div>

            </div>

        );
    }
}

const TwitterStatusReply = ({reply, parentPostData, reload}) => {

    const text = reply.text ? reply.text : "";
    const profileImg = reply.user.profile_image_url_https;
    const sharedStatus = reply.retweeted_status;
    const username = reply.user.screen_name;
    const accountId = reply.user.id_str;
    const date = reply.created_at;
    const statusId = reply.id_str;
    const networkType = "twitter";
    let media = typeof reply.extended_entities !== "undefined" && typeof reply.extended_entities.media !== "undefined" ? reply.extended_entities.media : [];
    media = media.map(file => {
        const source = file.type === "video" && typeof file.video_info.variants !== "undefined" && file.video_info.variants.length ? file.video_info.variants[0].url : "";
        return {src: file.media_url_https, type: file.type, source}
    });

    const setImages = parentPostData.setImages;
    const channel = parentPostData.channel;

    const postData = {profileImg, username, text, date, media, setImages, statusId, sharedStatus, networkType, channel, accountId};
    return (
        <div>
            <StreamPost {...postData} reload={reload}/>
        </div>
    )
}

export default TwitterReplies;