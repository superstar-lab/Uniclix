import React from 'react';
import Loader from 'react-loader-spinner';

import { pageInsightsByType } from '../../../../requests/facebook/channels';
import PostsTableRow from '../../PostsTableRow';

class PostsTable extends React.Component{
    state = {
        posts: null,
        loading: false
    };

    componentDidMount() {
        this.fetchAnalytics();
    };

    componentDidUpdate(prevProps) {
        if (
            prevProps.selectedAccount != this.props.selectedAccount ||
            prevProps.calendarChange != this.props.calendarChange
        ) {
            this.fetchAnalytics();
        }  
    }

    fetchAnalytics = () => {
        this.setState(() => ({
            loading: true
        }));

        try {
            pageInsightsByType(
                this.props.selectedAccount,
                this.props.startDate,
                this.props.endDate,
                this.props.type
            )
            .then((response) => {
                this.setState(() => ({
                    posts: response,
                    loading: false
                }));
            })
            .catch(error => {
                this.setState(() => ({
                    loading: false
                }));
                return Promise.reject(error);
            }); 
        } catch (error) {
            
        }
        
    };

    render() {
        const { posts, loading } = this.state;

        return (
            <div>
                <div className="table-title">
                    Posts Table
                </div>
                <div className="card-table">
                    {
                        posts != null && !loading ?
                        <div>
                            {
                                posts.map((post, index) => (
                                    <div key={index}>
                                        <PostsTableRow
                                            avatar={post.from.picture.data.url}
                                            username={post.from.name}
                                            date={post.date}
                                            text={post.message}
                                            shares={post.shares}
                                            sharesLabel="Shares"
                                            comments={post.comments}
                                            likes={post.reactions}
                                            likesLabel="Reactions"
                                        />
                                    </div>
                                ))
                            }
                        </div> :
                        <div className="table-loader-style">
                            {
                                this.state.loading &&
                                    <Loader
                                        type="Bars"
                                        color="#46a5d1"
                                        height={70}
                                        width={70}
                                    />
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default PostsTable;
