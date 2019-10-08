import React from 'react';
import { getAnalytics } from "../../requests/facebook/channels";
import Loader from "../Loader";

class FacebookAnalytics extends React.Component { 
    
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
                                <img className="platform-profile" src="/images/facebook.png"></img>
                            </div>  
                            <div><span className="analytics-header">{channel.name}</span></div>                        
                        </div>
                        <div className="col-md-6 col-xs-12 text-right">
                        <span className="analytics-header">55 Page Likes</span>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-md-6 col-xs-12">
                            <div className="row">
                                <div className="col-md-6 col-xs-12 border-right">
                                    <h3>{this.state.data.likes}</h3>
                                    <p>Page Likes</p>
                                </div>
                                <div className="col-md-6 col-xs-12 border-right">
                                    <h3>{this.state.data.unlikes}</h3>
                                    <p>Unlikes</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xs-12">
                            <div className="row">
                                <div className="col-md-4 col-xs-12 border-right">
                                    <h3>{this.state.data.posts}</h3>
                                    <p>Posts</p>
                                </div>
                                <div className="col-md-4 col-xs-12 border-right">
                                    <h3>{this.state.data.reactions}</h3>
                                    <p>Reactions</p>
                                </div>
                                <div className="col-md-4 col-xs-12">
                                    <h3>{this.state.data.engagement}</h3>
                                    <p>Engagement</p>
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

export default FacebookAnalytics;