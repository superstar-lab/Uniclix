import React from 'react';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import UpgradeAlert from '../../UpgradeAlert';
import channelSelector from '../../../selectors/channels';
import {unapprovedPosts, destroyPost, postNow, approvePost} from '../../../requests/channels';
import PostList from '../../PostList';
import Loader from '../../Loader';

export class UnapprovedPosts extends React.Component{

    defaultAction = {
        type: '',
        id: ''
    };

    state = {
        posts: [],
        page: 1,
        loading: this.props.channelsLoading,
        action: this.defaultAction,
        forbidden: false,
        error: false
    }

    componentDidMount() {
        
        if(!this.props.channelsLoading){
            this.fetchPosts();
        }
    }

    componentDidUpdate(prevProps) {
        if((this.props.selectedChannel !== prevProps.selectedChannel)){
            this.fetchPosts();
        }
    }

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    };

    setAction = (action = this.defaultAction) => {
        this.setState(() => ({
            action
        }));
    };

    setError = (error = true) => {
        this.setState(() => ({
            error
        }));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    publishPost = (postId) => {
        this.setLoading(true);
        return postNow(postId)
        .then((response) => {
            this.fetchPosts();
            this.setLoading(false);
        }).catch((error) => {
            
            if(typeof error.response.data.message != 'undefined'){
                this.setState(() => ({
                    error: error.response.data.message
                }));
            }

            if(typeof error.response.data.error != 'undefined'){
                this.setState(() => ({
                    error: error.response.data.error
                }));
            }

            this.setLoading(false);
        });
    };

    destroy = (postId) => {
        this.setLoading(true);
        return destroyPost(postId)
        .then((response) => {
            this.fetchPosts();
            this.setLoading(false);
        }).catch((error) => {

            if(typeof error.response.data.message != 'undefined'){
                this.setState(() => ({
                    error: error.response.data.message
                }));
            }

            if(typeof error.response.data.error != 'undefined'){
                this.setState(() => ({
                    error: error.response.data.error
                }));
            }

            this.setLoading(false);
        });
    };

    approve = (postId) => {
        this.setLoading(true);
        return approvePost(postId)
        .then((response) => {
            this.fetchPosts();
            this.setLoading(false);
        }).catch((error) => {

            if(typeof error.response.data.message != 'undefined'){
                this.setState(() => ({
                    error: error.response.data.message
                }));
            }

            if(typeof error.response.data.error != 'undefined'){
                this.setState(() => ({
                    error: error.response.data.error
                }));
            }

            this.setLoading(false);
        });
    };

    fetchPosts = () => {
        this.setLoading(true);
        unapprovedPosts()
            .then((response) => {
                this.setState(() => ({
                    posts: response.items,
                    loading: false,
                    forbidden: false,
                    page: 1
                }));
            }).catch((error) => {

                if(typeof error.response.data.message != 'undefined'){
                    this.setState(() => ({
                        error: error.response.data.message
                    }));
                }

                if(typeof error.response.data.error != 'undefined'){
                    this.setState(() => ({
                        error: error.response.data.error
                    }));
                }    

                if(error.response.status === 403){
                    this.setForbidden(true);
                }

                this.setLoading(false);
            });
    };

    loadMore = () => {
        this.setLoading(true);
        let page = this.state.page + 1;
        unapprovedPosts(page)
            .then((response) => {
                this.setState((prevState) => ({
                    posts: prevState.posts.concat(response.items),
                    page,
                    loading: false
                }));
            }).catch((error) => {
                this.setLoading(false);

                if(error.response.status === 401){
                    
                    if(this.props.selectedChannel.active){
                       this.props.startSetChannels();
                    }
                }

                return Promise.reject(error);
            });
    };

    render(){
        return(
            <div>
            <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden}/>
                <PostList 
                    action={this.state.action}
                    setAction={this.setAction}
                    destroyPost={this.destroy}
                    approvePost={this.approve}
                    publishPost={this.publishPost}
                    error={this.state.error}
                    setError={this.setError}
                    posts={this.state.posts}
                    loading={this.state.loading}
                    title="AWAITING APPROVAL"
                    type="unapproved-posts"
                />

                <BottomScrollListener onBottom={this.loadMore} />
                {this.state.loading && <Loader />}
            </div>
            
        );
    }
}

//TODO refresh schedule page when publishing, fetch past scheduled posts
const mapStateToProps = (state) => {
    const selectedGlobalChannel = {selected: 1, provider: undefined};
    const selectedChannel = channelSelector(state.channels.list, selectedGlobalChannel);

    return {
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

export default connect(mapStateToProps)(UnapprovedPosts);