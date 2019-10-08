import React from 'react';
import { connect } from 'react-redux';
import TwitterAnalytics from '../TwitterAnalytics';
import FacebookAnalytics from '../FacebookAnalytics';
import UpgradeIntro from '../../UpgradeIntro';
import channelSelector from '../../../selectors/channels';
import SocialAccountsPrompt from '../../SocialAccountsPrompt';

class Overview extends React.Component {

    constructor(props){
        super(props);
    }

    state = {
        data: false,
        forbidden: false,
        days: 1
    }

    onDaysChange = (days) => {
        this.setState(()=> ({
            days
        }));
    };
    
    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    render(){
        const {channels} = this.props;
        const Analytics = ({channel}) => {
            if(channel.type == "twitter") {
                return <TwitterAnalytics days={this.state.days} channel={channel} setForbidden={this.setForbidden}/>
            }

            if(channel.type == "facebook") {
                return <FacebookAnalytics days={this.state.days} channel={channel} setForbidden={this.setForbidden}/>
            }

            return <div></div>
        }
        return (
            <div>
                {!this.state.forbidden && channels.length > 0 ?
                <div>
                    <h2>ANALYTICS OVERVIEW</h2>  
                    
                    <div>
                        <ul className="analytics-filter">
                            <li className="analytics-filter-li" onClick={() => this.onDaysChange(1)}><a>Today</a></li>
                            <li className="analytics-filter-li" onClick={() => this.onDaysChange(7)}><a>Last 7 Days</a></li>
                            <li className="analytics-filter-li" onClick={() => this.onDaysChange(30)}><a>Last 30 Days</a></li>
                        </ul>

                        {channels.map((channel, index) => {
                            return <Analytics key={index} channel={channel}/>
                        })}           
                    </div>
                </div>
                :
                this.state.forbidden ? 
                    <UpgradeIntro 
                        title="A simpler way to measure performance"
                        description = "Track your social growth, and get meaningful stats on your social media accounts."
                        infoData = {[
                            {
                                title: "Social Snapshot",
                                description: "Get a meaningful and concise snapshot of your key Twitter, Facebook, and LinkedIn activities."
                            },
                            {
                                title: "Engagement Metrics",
                                description: "Get a clear view of engagement for each of your social media accounts."
                            },
                            {
                                title: "Post Performance Metrics",
                                description: "Track engagement for all of your individual post in one platform."
                            }
                        ]}
                        image = "/images/analytic_intro.svg"
                        buttonLink = "/settings/billing"
                    /> :
                    
                        <SocialAccountsPrompt 
                            image = "/images/connect_linkedin_accounts.svg"
                            title = "Prove the impact of your social media initiatives"
                            description = "Track your social growth, and get meaningful stats"
                            buttonTitle = "Connect your Social Accounts"
                            buttonLink = "/accounts"
                        />           
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const channels = channelSelector(state.channels.list, {selected: undefined, provider: undefined, publishable: true});
    return {
        channels
    }
}

export default connect(mapStateToProps)(Overview);
