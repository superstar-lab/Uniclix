import React from 'react';
import Loader from 'react-loader-spinner';
import { pageInsightsByType } from "../../../../requests/facebook/channels";
import ReadMore from "../../../ReadMore";
import AnalyticsTooltip from '../../AnalyticsTooltip'

class PostsTable extends React.Component{
    state = {
        posts: null,
        loading: false
    };

    componentDidMount(){
        this.fetchAnalytics();
    };

    componentDidUpdate(prevProps){
        if(prevProps.selectedAccount != this.props.selectedAccount || prevProps.calendarChange != this.props.calendarChange)
        {
            this.fetchAnalytics();
        }  
    }

    fetchAnalytics = () => {
        this.setState(() => ({
            loading: true
        }));
        try {
            pageInsightsByType(this.props.selectedAccount, this.props.startDate, this.props.endDate, this.props.type)            
            .then((response) => {
                this.setState(() => ({
                    posts: response,
                    loading: false
                }));
            }).catch(error => {
                this.setState(() => ({
                    loading: false
                }));
                return Promise.reject(error);
            }); 
        } catch (error) {
            
        }
        
    };

    render(){
        const {name} = this.props;
        return (
        <div className="overview-card">
            <div className="card-header">
                <img className="card-img" src="/images/facebook.png"></img> {name}
                <AnalyticsTooltip tooltipDesc={this.props.tooltipDesc} />
            </div>
            <div className="card-table">
                {this.state.posts !=null && !this.state.loading ?
                <div className="table-wrapper-scroll-y table-scrollbar scrollable">
                        <table className="table table-striped mb-0">
                        <thead>
                            <tr>
                                <th scope="col" className="anl-posts-table-th-first">Date</th>
                                <th scope="col" className="anl-posts-table-th-second">Message</th>
                                <th scope="col">Reactions</th>
                                <th scope="col">Comments</th>
                                <th scope="col">Shares</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.posts.map((post, index)=> (
                                <tr key={index} scope="row">
                                    <td className="anl-posts-table-th-first" scope="row">
                                        <div className="post-table-images">
                                            <img className="pt-page-img" src={this.props.selectedChannel.avatar} />
                                            <img className="pt-page-facebook" src="/images/facebook.png"></img>
                                        </div>
                                        <div className="post-table-page-date">
                                            <p className="pt-page-name">{this.props.selectedChannel.name}</p>
                                            <p className="pt-post-date">{post.date}</p>
                                        </div>
                                    </td>
                                    <td className="anl-posts-table-th-second"><ReadMore characters={400}>{post.message ? post.message : ''}</ReadMore></td>
                                    <td>{post.reactions}</td>
                                    <td>{post.comments}</td>
                                    <td>{post.shares}</td>                            
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> : <div className="table-loader-style">{this.state.loading && <Loader type="Bars" color="#46a5d1" height={70} width={70} />}</div>}
            </div>
        </div>
        );
    }
}

export default PostsTable;