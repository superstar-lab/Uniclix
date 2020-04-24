import React from 'react';
import TwitterActions from './TwitterActions';
import StreamPost from './StreamPost';
import FacebookActions from './FacebookActions';
import FacebookMessagesFeed from './FacebookMessagesFeed';
import FacebookComments from './FacebookComments';

const StreamFeedItem = ({feedItem, streamItem, channel, setImages, updateItem, reload, selectedTab}) => {
    try{
        if(streamItem.type == "scheduled"){
            return <ScheduledFeed reload={reload} feedItem={feedItem} setImages={setImages} channel={channel} selectedTab={selectedTab} />
        }

        if(streamItem.network === "twitter"){
            if(streamItem.type === "followers"){
                return <TwitterFollowersFeed reload={reload} feedItem={feedItem} setImages={setImages} channel={channel} updateItem={updateItem} selectedTab={selectedTab} />;
            }else{
                return <TwitterDefaultFeed reload={reload} feedItem={feedItem} setImages={setImages} channel={channel} updateItem={updateItem} selectedTab={selectedTab} />;
            }
        }
        else if(streamItem.network === "facebook"){

            if(streamItem.type === "conversations"){
                return <FacebookMessagesFeed reload={reload} feedItem = {feedItem} channel={channel} setImages={setImages} updateItem={updateItem} selectedTab={selectedTab} />
            }else{
                return <FacebookPostsFeed reload={reload} feedItem = {feedItem} setImages={setImages} channel={channel} updateItem={updateItem} selectedTab={selectedTab} />
            }
            
        }else{
            return <div></div>;
        }
    }catch(e){
        return <div></div>
    }
};

const TwitterDefaultFeed = ({feedItem, setImages, channel, updateItem, reload, selectedTab}) => {
    try{
        const text = feedItem.text ? feedItem.text : "";
        const profileImg = feedItem.user.profile_image_url_https;
        const sharedStatus = feedItem.retweeted_status;
        const username = feedItem.user.screen_name;
        const accountId = feedItem.user.id_str;
        const date = feedItem.created_at;
        const statusId = feedItem.id_str;
        const networkType = "twitter";
        let media = typeof feedItem.extended_entities !== "undefined" && typeof feedItem.extended_entities.media !== "undefined" ? feedItem.extended_entities.media : [];
        media = media.map(file => {
            const source = file.type === "video" && typeof file.video_info.variants !== "undefined" && file.video_info.variants.length ? file.video_info.variants[0].url : "";
            return {src: file.media_url_https, type: file.type, source}
        });

        const postData = {profileImg, username, text, date, media, setImages, statusId, sharedStatus, networkType, channel, accountId, feedItem, updateItem};

        return (
            <StreamPost {...postData} reload={reload} selectedTab={selectedTab} >
                <TwitterActions 
                    updateItem={updateItem} 
                    channel={channel}
                    feedItem={feedItem}
                    type="twitterDefault"
                    postData={postData}
                />
            </StreamPost>
        );
    }catch(e){
        console.log(e);
        return <div></div>
    }
}

const TwitterFollowersFeed = ({feedItem, setImages, channel, updateItem, reload, selectedTab}) => {
    try{
        const text = typeof feedItem.status !== "undefined" && typeof feedItem.status["text"] !== "undefined" ? feedItem.status["text"] : "";
        const date = typeof feedItem.status !== "undefined" && typeof feedItem.status["created_at"] !== "undefined" ? feedItem.status["created_at"] : "";
        const username = feedItem.screen_name;
        const accountId = feedItem.id_str;
        const profileImg = feedItem.profile_image_url_https;
        const statusId = typeof feedItem.status !== "undefined" ? feedItem.status.id_str: "";
        const networkType = "twitter";
        let media = typeof feedItem.status !== "undefined" && typeof feedItem.status.extended_entities !== "undefined" && typeof feedItem.status.extended_entities.media !== "undefined" ? feedItem.status.extended_entities.media : [];
        media = media.map(file => {
            const source = file.type === "video" && typeof file.video_info.variants !== "undefined" && file.video_info.variants.length ? file.video_info.variants[0].url : "";
            return {src: file.media_url_https, type: file.type, source}
        });

        const postData = {profileImg, username, text, date, media, setImages, statusId, networkType, channel, accountId, updateItem};

        return(
            <div>
            {typeof feedItem.status != "undefined" && 
                <StreamPost {...postData} reload={reload} selectedTab={selectedTab} feedItem={feedItem.status} >
                    <TwitterActions 
                        updateItem={updateItem} 
                        channel={channel} 
                        feedItem={feedItem}
                        type="twitterFollowers"
                        postData={postData}
                        />
                </StreamPost>}
            </div>
        ); 
    }catch(e){
        console.log(e);
        return <div></div>
    }

}

const ScheduledFeed = ({feedItem, channel, setImages, reload, selectedTab}) => {
    try{
        const text = feedItem.content ? feedItem.content : "";
        const profileImg = channel.avatar;
        const username = channel.username;
        const accountId = channel.details.payload.id;
        const date = feedItem.scheduled_at_original;
        let media = typeof feedItem.payload.images !== "undefined" && feedItem.payload.images.length ? feedItem.payload.images : [];

        media = media.map(file => ({src: file.absolutePath, type: "photo"}));

        return (
            <StreamPost {...{profileImg, username, text, date, media, setImages, channel, accountId}} reload={reload} selectedTab={selectedTab} />
        )}catch(e){ 
            console.log(e);
            return <div></div>
        }
};

const FacebookPostsFeed = ({feedItem, setImages, channel, updateItem, reload, selectedTab}) => {

    try{    
        let text = feedItem.message ? feedItem.message : "";
        const attachmentData = {
            title: "",
            description: "",
            attachmentType: "",
            targetUrl: "",
        }

        const profileImg = feedItem.from.picture.data.url;
        const username = feedItem.from.name;
        const accountId = feedItem.from.id;
        const date = feedItem.created_time;

        const attachments = typeof feedItem.attachments !== "undefined" ? feedItem.attachments.data : [];
        const subAttachments = attachments.length && typeof attachments[0].subattachments !== "undefined" ? (typeof attachments[0].subattachments.data !== "undefined" ? attachments[0].subattachments.data : []) : [];
        const networkType = "facebook";

        let mainMedia = attachments.map((item) => {
            if(typeof item.media !== "undefined"){
                return item.media;
            }
        }).filter(item => typeof item !== "undefined");

        let subMedia = subAttachments.map((item) => {
            if(typeof item.media !== "undefined"){
                return item.media;
            }
        }).filter(item => typeof item !== "undefined");

        let media = [...mainMedia, ...subMedia];

        if(attachments.length){
            text = text ? text : attachments[0].title;
            attachmentData.title = attachments[0].title;
            attachmentData.description = attachments[0].description;
            attachmentData.attachmentType = attachments[0].type;
            attachmentData.targetUrl = attachments[0].url;
        }

        media = media.map(file => (
            {
            src: file.image.src, 
            type: typeof file.source !== "undefined" ? "video": "photo", 
            source: typeof file.source !== "undefined" ? file.source : ""
        }));

        attachmentData.media = media;

        const statusId = feedItem.id;
        const postData = {profileImg, username, text, attachmentData, date, media, setImages, statusId, networkType, channel, accountId, feedItem, updateItem};

        return (
            <StreamPost {...postData} reload={reload} type="facebook" selectedTab={selectedTab} >
                <div>
                    <FacebookActions 
                        updateItem={updateItem} 
                        channel={channel} 
                        feedItem={feedItem}
                        postData={postData}
                    />
                    
                    <FacebookComments post={feedItem} channel={channel}/>
                </div>
            </StreamPost>
        )
    }catch(e){
        console.log(e);
        return <div></div>;
    }
};

export default StreamFeedItem;