import React from 'react';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import UserList from "../../UserList";
import UpgradeAlert from '../../UpgradeAlert';
import {startSetChannels} from "../../../actions/channels";
import { getRecentUnfollowers, unfollow } from '../../../requests/twitter/channels';
import channelSelector from '../../../selectors/channels';
import Loader from '../../Loader';
import UpgradeIntro from '../../UpgradeIntro';

class RecentUnfollowers extends React.Component{
    state = {
        userItems: [],
        actions: 0,
        forbidden: false,
        loading: this.props.channelsLoading,
        page: 1,
        order: "desc"
    }

    componentDidMount() {
        
        if(!this.props.channelsLoading){
            this.fetchData();
        }
    }

    componentDidUpdate(prevProps) {
        if((this.props.selectedChannel !== prevProps.selectedChannel)){
            this.fetchData();
        }
    }

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    perform = (userId) => {
        this.setState((prevState) => ({
            actions: prevState.actions + 1
        }));

        return unfollow(userId)
            .then((response) => response)
            .catch((error) => {
                this.setState((prevState) => ({
                    actions: prevState.actions - 1
                }));

                if(error.response.status === 401){
                    
                    if(this.props.selectedChannel.active){
                       this.props.startSetChannels();
                    }
                }

                return Promise.reject(error);
            });
    };

    fetchData = (order = 'desc') => {
        this.setLoading(true);
        getRecentUnfollowers(order)
            .then((response) => {
                this.setState(() => ({
                    userItems: response.items,
                    actions: response.actions,
                    loading: false,
                    forbidden: false,
                    page: 1,
                    order
                }));
            }).catch((error) => {
                this.setLoading(false);

                if(error.response.status === 401){
                    
                    if(this.props.selectedChannel.active){
                       this.props.startSetChannels();
                    }
                }

                if(error.response.status === 403){
                    this.setForbidden(true);
                }

                return Promise.reject(error);
            });
    };

    loadMore = () => {
        this.setLoading(true);
        let page = this.state.page + 1;
        const order = this.state.order;
        getRecentUnfollowers(order, page)
            .then((response) => {
                this.setState((prevState) => ({
                    userItems: prevState.userItems.concat(response.items),
                    actions: response.actions,
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
        return (
            <div>
                {this.state.forbidden ? <UpgradeIntro 
                        title="A simpler way to boost your twitter influence"
                        description = "Track your social growth, and engage with your targeted audience."
                        infoData = {[
                            {
                                title: "Grow your audience",
                                description: "Grow your Twitter audience and expand your Influence with UniClix Twitter Booster."
                            },
                            {
                                title: "Target and engage",
                                description: "Grow your community on Twitter by targeting the right audience. Think of our Booster tool as a matchmaker that connects you with people most interested in what you have to offer."
                            },
                            {
                                title: "Stay on top of things",
                                description: "Get started now, Follow relevant users only, Unfollow Inactive users, schedule posts, retweet, and monitor your Twitter mentions and streams with Uniclix Twitter Booster."
                            }
                        ]}
                        image = "/images/analytic_intro.svg"
                        buttonLink = "/settings/billing"
                    />:
                <div>
                    <h2>RECENT UNFOLLOWERS</h2>

                    <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden}/>

                    <UserList 
                        userItems={ this.state.userItems }
                        actionType="unfollow"
                        actions={this.state.actions}
                        loading={this.state.loading}
                        showSortOption={true}
                        fetchData={this.fetchData}
                        perform={this.perform}
                        page="recent-unfollowers"
                        noData={{
                            title: "WOW - great job, you don't have any recent unfollowers",
                            description: "Keep up the good work, keep scheduling post through UniClix and increase your engagement.",
                            text: "We suggest you  increase your engagement with UniClix by following relevant accounts using Keyword Target feature."
                        }}
                    />
                    <BottomScrollListener onBottom={this.loadMore} />
                    {this.state.loading && <Loader />}
                </div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const selectedTwitterChannel = {selected: 1, provider: "twitter"};
    const selectedChannel = channelSelector(state.channels.list, selectedTwitterChannel);

    return {
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentUnfollowers);