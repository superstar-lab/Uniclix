import React from 'react';
import Loader from 'react-loader-spinner';
import { pageInsightsByType } from "../../../../requests/twitter/channels";
import AnalyticsTooltip from '../../AnalyticsTooltip';
import ReadMore from '../../../ReadMore';
import TweetCard from './TweetCard';

class TweetsTable extends React.Component{
    state = {
        tweets: null,
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
                    tweets: response,
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

    render() {
        const { tweets, loading } = this.state;

        return (
        <div>
            <div className="table-title">
                Tweets Table
            </div>
            <div>
                {
                    tweets != null && !loading ?
                        <div>
                            {
                                tweets.map((tweet, index) => (
                                    <div key={index}>
                                        <TweetCard
                                            avatar={tweet.user.profile_image_url_https}
                                            username={tweet.user.name}
                                            screenName={tweet.user.screen_name}
                                            date={tweet.date}
                                            text={tweet.text}
                                            retweets={tweet.retweet_count}
                                            comments={0}
                                            likes={tweet.favorite_count}
                                        />
                                    </div>
                                ))
                            }
                        </div> :
                        <div className="table-loader-style">
                            {loading && <Loader type="Bars" color="#46a5d1" height={70} width={70} />}
                        </div>
                }
            </div>
        </div>
        );
    }
}

export default TweetsTable;