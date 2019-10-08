import React from 'react';
import { getAnalytics } from "../../requests/twitter/channels";
import Loader from "../Loader";

class TwitterAnalytics extends React.Component {   
    
    constructor(props){
        super(props);
    }

    state = {
        data: false,
        loading: false
    }
    
    componentDidMount() {
        
        if(!this.props.channelsLoading){
            this.fetchAnalytics();
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.days !== prevProps.days){
            this.fetchAnalytics();
        }
    }

    fetchAnalytics = () => {
        this.setState(() => ({
            loading: true
        }));
        try {
           getAnalytics(this.props.channel.id, this.props.days)
            .then((response) => {
                this.setState(() => ({
                    data: response,
                    loading: false
                }));
            }).catch(error => {
                this.setState(() => ({
                    loading: false
                }));

                
                if(error.response.status === 403){
                    this.props.setForbidden(true);
                }

                return Promise.reject(error);
            }); 
        } catch (error) {
            
        }
        
    };

    render(){
        const {channel} = this.props;
        return (
            <div>
            {this.state.loading && <Loader />}
            {this.state.data && 
            <div className="row twitter-profile-analytics">
                <div className="col-xs-12">
                    <div className="row border-bottom tw-img-followers">
                        <div className="col-md-6 col-xs-12 text-left">
                            <div className="twitter-profile-img">
                                <img  src={channel.avatar} />
                                <img className="platform-profile" src="/images/twitter.png"></img>
                            </div>  
                            <div><span className="analytics-header">@{channel.username}</span></div>                        
                        </div>
                        <div className="col-md-6 col-xs-12 text-right">
                                <span className="analytics-header">{this.state.data.profile.followers_count} Followers</span>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-md-6 col-xs-12">
                            <div className="row">
                                <div className="col-md-6 col-xs-12 border-right">
                                    <h3>{this.state.data.followers}</h3>
                                    <p>New followers</p>
                                </div>
                                <div className="col-md-6 col-xs-12 border-right">
                                    <h3>{this.state.data.unfollowers}</h3>
                                    <p>Unfollowers</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xs-12">
                            <div className="row">
                                <div className="col-md-6 col-xs-12 border-right">
                                    <h3>{this.state.data.tweets}</h3>
                                    <p>Tweets</p>
                                </div>
                                <div className="col-md-6 col-xs-12 border-right">
                                    <h3>{this.state.data.likes}</h3>
                                    <p>Likes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            </div>
        );
    }
}

export default TwitterAnalytics;