import React from 'react';
import {NavLink} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import ReactInterval from 'react-interval';
import Loader from 'react-loader-spinner';
import StreamFeedItem from './StreamFeedItem';
import {getStreamFeed} from '../../requests/streams';
import Lightbox from 'react-images';
import {PostLoader} from '../Loader';

class StreamFeed extends React.Component{
    state = {
        items: [],
        images: [],
        imageViewer: false,
        imageIndex: 0,
        loading: false,
        loadMore: false,
        hasMore: false,
        nextPage: "",
        error: false,
        errorStatus: false
    };

    refreshInterval = '';

    componentDidMount(){
        this.fetchFeed();
    }

    componentDidUpdate(){        
        if(typeof(this.props.streamItem) !== "undefined" && this.props.refreshId === this.props.streamItem.id){
            this.fetchFeed();
            this.props.resetRefresh();
        }
    }

    fetchFeed = () => {
        const {streamItem} = this.props;
        this.setState(() => ({loading: true}));
        getStreamFeed(streamItem.type, streamItem.network, streamItem.channel_id, streamItem.search_query, "").then((response) => {
            const items = typeof response["data"] !== "undefined" ? response["data"] : response;
            let data = items.length ? items[items.length - 1] : "";
            let nextPage = data && typeof(data.id) !== "undefined" ? data.id : "";
            if(typeof(response["paging"]) !== "undefined" 
            && typeof(response["paging"]["cursors"]) !== "undefined" 
            && typeof(response["paging"]["cursors"]["after"]) !== "undefined"){
                nextPage = response["paging"]["cursors"]["after"];
            }

            this.setState(() => ({
                items: items.length ? items : this.state.items,
                loading: false,
                hasMore: !!items,
                error: false,
                nextPage
            }));

            this.props.resetLoading();
            
            if(!items.length) return;
        }).catch(e => {
            let error = "You may have exceeded the rate limit.";
            let errorStatus = e.response.status;
                      
            if(errorStatus === 401){
                error = e.response.data.message;
            }
            
            this.setState(() => ({loading: false, error, errorStatus}));  
        });
    };

    setImages = (images, index = 0) => {
        this.setState(() => ({
          images,
          imageViewer: !this.state.imageViewer,
          imageIndex: index
        }));
    };

    updateItem = (currentItem, type = "twitterDefault", kind = "") => {
        let items = [];
        if(type == "delete"){
            items = this.state.items.filter(item => item.id !== currentItem.id);
        }else{
            
            items = this.state.items.map(item => {
                
                if(kind == "twitterLike" && !!item.id && item.id == currentItem.id){
                    if(type == "twitterDefault"){
                        item.favorite_count += 1;
                    } else {
                        item.status.favorite_count += 1;
                    }
                    return item;
                }

                if(kind == "twitterUnlike" && !!item.id && item.id == currentItem.id){
                    if(type == "twitterDefault"){
                        item.favorite_count -= 1;
                    } else {
                        item.status.favorite_count -= 1;
                    }
                    return item;
                }

                if(kind == "twitterRetweets" && !!item.id && item.id == currentItem.id){
                    if(type == "twitterDefault"){
                        item.retweet_count += 1;
                    } else {
                        item.status.retweet_count += 1;
                    }
                    return item;
                }

                if(type == "facebookLike" && !!item.id && item.id == currentItem.id){
                    item.likes.summary.has_liked = true;
                    item.likes.summary.total_count += 1;
                    return item;
                }

                if(type == "facebookUnlike" && !!item.id && item.id == currentItem.id){
                    item.likes.summary.has_liked = false;
                    item.likes.summary.total_count -= 1;
                    return item;
                }

                if(type == "facebookMessage" && !!item.id && item.id == currentItem.id){
                    return currentItem;
                }

                if(type == "facebookComment" && !!item.id && item.id == currentItem.id){
                    item.comments.summary.total_count += 1;
                    return item;
                }

                return item;
            });
        }

        this.setState(() => ({
            items
        }));
    }

    loadMore = () => {
        const {streamItem} = this.props;
        
        if(!this.state.items.length) return;

        this.setState(() => ({loadMore: true, hasMore: false}));
        getStreamFeed(streamItem.type, streamItem.network, streamItem.channel_id, streamItem.search_query, this.state.nextPage).then((response) => {
        
            let items = typeof response["data"] !== "undefined" ? response["data"] : response;
            let nextPage = this.state.nextPage;
            if(typeof(response["paging"]) !== "undefined" 
            && typeof(response["paging"]["cursors"]) !== "undefined" 
            && typeof(response["paging"]["cursors"]["after"]) !== "undefined"){
                nextPage = response["paging"]["cursors"]["after"];
            }else{
                items = items.filter(item => item.id != nextPage);
                let data = items.length ? items[items.length - 1] : "";
                nextPage = data && typeof(data.id) !== "undefined" ? data.id : "";
            }

            if(items.length && this.state.items.length && items[0].id === this.state.items[0].id){
                items = [];
            }

            this.setState((prevState) => ({
                items: prevState.items.concat(items),
                loadMore: false,
                hasMore: !!items.length,
                nextPage
            }));
            
            if(!items.length) return;
        }).catch(e => {
            this.setState(() => ({loadMore: false, hasMore: false}));
        });
    };

    render(){
        const {streamItem, channel, refreshRate, reload, selectedTab} = this.props;
        const {imageViewer, imageIndex, images} = this.state;
        return (
            <div ref={(ref) => this.scrollParentRef = ref} className="stream-feed scrollbar">

            <ReactInterval timeout={refreshRate * 60000} enabled={true}
            callback={() => this.fetchFeed()} />

                {imageViewer && (
                    <Lightbox
                        currentImage={imageIndex}
                        images={images}
                        isOpen={imageViewer}
                        onClickPrev={() =>
                            this.setState({
                              imageIndex: (imageIndex + images.length - 1) % images.length,
                            })}
                        onClickNext={() =>
                            this.setState({
                              imageIndex: (imageIndex + 1) % images.length,
                            })}
                        onClose={() => this.setState({ imageViewer: false })}
                        />
                )}                    
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMore}
                    useWindow={false}
                    hasMore={this.state.hasMore && !!this.state.items.length}
                    getScrollParent={() => this.scrollParentRef}
                >
                    {this.state.items.length ? this.state.items.map((item, index) => (               

                            <StreamFeedItem  
                                feedItem={item} 
                                streamItem={streamItem} 
                                key={index} 
                                setImages={this.setImages} 
                                updateItem={this.updateItem} 
                                channel={channel}
                                reload={reload}
                                selectedTab={selectedTab}
                            />

                    )) : this.state.loading ? 
                            <div className="container-p10">
                                <PostLoader /><PostLoader />
                            </div> : 
                            <div className="container-nodata">
                                <div>
                                    <p><i className="fa fa-folder-open"></i> </p>
                                    <span>{this.state.error ? this.state.error : "No data found."}</span>
                                    {this.state.errorStatus === 401 && <div><NavLink to={`/accounts/${channel.type}`}>Reconnect</NavLink></div>}
                                </div>
                            </div>
                    }
                </InfiniteScroll>


                {this.state.loadMore &&                         
                <div className="flex-center-h full-width">
                    <Loader type="Bars" color="#46a5d1" height={30} width={30} />
                </div>
                }
            </div>
        );
    }
}

export default StreamFeed;