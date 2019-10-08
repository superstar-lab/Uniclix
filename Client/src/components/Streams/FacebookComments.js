import React from 'react';
import {getComments} from '../../requests/facebook/channels';
import FacebookInfoCard from './FacebookInfoCard';
import {AvatarWithText} from '../Loader';
import ReadMore from '../ReadMore';

class FacebookComments extends React.Component{

    state = {
        showComments: false,
        comments: [],
        emptyList: false,
        loading: false,
        loadingReplies: false
    }

    componentDidMount(){

    }

    componentDidUpdate(prevProps){
        const {post, channel} = this.props;
        if(prevProps.post.comments !== post.comments && this.state.showComments){
            this.setState(() => ({loading: true}));
            
            getComments(post.id, channel.id).then(response => {
                this.setState(() => ({
                    comments: response,
                    emptyList: response.length < 1 ? true : false,
                    loading: false
                }));

            }).catch(e => {
                this.setState(() => ({loading: false}));
            });
        }
    }

    toggleShowComments = () => {
        const {post, channel} = this.props;

        if(this.state.comments.length < 1 && post.comments.data.length > 0){

            if(!this.state.showComments) this.setState(() => ({loading: true}));

            getComments(post.id, channel.id).then(response => {
                this.setState(() => ({
                    comments: response,
                    emptyList: response.length < 1 ? true : false,
                    loading: false
                }));

            }).catch(e => {
                this.setState(() => ({loading: false}));
            });
        }

        this.setState(() => ({
            showComments: !this.state.showComments
        }));
    };

    getReplies = (id) => {
        const {channel} = this.props;
        this.setState(() => ({loadingReplies: id}));
        getComments(id, channel.id).then(response => {
            this.setState(() => ({
                comments: this.state.comments.map(comment => {
                    if(comment.id === id){
                        comment.replies = response;
                    }

                    return comment;
                }),
                loadingReplies: false
            }));

        }).catch(e => {
            this.setState(() => ({loadingReplies: false}));
        });
    };

    render(){
        const {post} = this.props;
        return (
            <div className="comments">
                {post.comments.data.length > 0 && !this.state.emptyList && <a href="javascript:void(0)" onClick={this.toggleShowComments} className="show-comments">{this.state.showComments ? 'Hide comments' : 'Show comments'}</a>}
                {this.state.loading && <div className="loader-container"><AvatarWithText /></div>}
                {this.state.showComments && 

                    this.state.comments.map((comment, index) => (
                        <div className="comment" key={comment.id}>
                            <div className="comments__commenter">
                                <div className="commenter__profile">
                                    <div className="commenter__profile__pic">
                                        {typeof comment.from !=='undefined' ?
                                            <img src={comment.from.picture.data.url} />
                                            :
                                            <img src="/images/dummy_profile.png" />
                                        }
                                    </div>                             
                                </div>
                                <div>
                                    <div className="commenter_message">
                                        {typeof comment.from !=='undefined' ?
                                            <FacebookInfoCard username={comment.from.name} channelId={this.props.channel.id} accountId={comment.from.id} simple={true}/>
                                            :
                                            <strong>Anonymous</strong>
                                        }
                                        
                                        <ReadMore>{comment.message}</ReadMore>
                                        
                                    </div>                                        
                                    {typeof comment.replies === 'undefined' && <div className="view-replies">
                                        <a href="javascript:void(0)" onClick={() => this.getReplies(comment.id)}>View replies</a>
                                    </div>}
                                </div>
                            </div>
                            
                            {this.state.loadingReplies === comment.id && <div className="loader-container"><AvatarWithText /></div>}

                            {typeof comment.replies !== 'undefined' && comment.replies.map((reply) => (
                              <div key={reply.id} className="comments__commenter comments__reply">
                                    <div className="commenter__profile">
                                        <div className="commenter__profile__pic">
                                            {typeof reply.from !=='undefined' ?
                                                <img src={reply.from.picture.data.url} />
                                                :
                                                <img src="" />
                                            }
                                        </div>                             
                                    </div>
                                    <div className="commenter_message">
                                        {typeof reply.from !=='undefined' ?
                                            <FacebookInfoCard username={reply.from.name} channelId={this.props.channel.id} accountId={reply.from.id} simple={true}/>
                                            :
                                            <strong>Anonymous </strong>
                                        }
                                        <ReadMore>{reply.message}</ReadMore>
                                    </div>
                                </div>  
                            ))}
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default FacebookComments;