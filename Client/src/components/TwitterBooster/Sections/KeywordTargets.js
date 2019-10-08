import React from 'react';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import UserList from "../../UserList";
import UpgradeAlert from '../../UpgradeAlert';
import { getKeywordTargets, follow } from '../../../requests/twitter/channels';
import {startSetChannels} from "../../../actions/channels";
import channelSelector from '../../../selectors/channels';
import Loader from '../../Loader';
import UpgradeIntro from '../../UpgradeIntro';

class KeywordTargets extends React.Component{
    state = {
        userItems: [],
        actions: 0,
        targets: [],
        loading: this.props.channelsLoading,
        searchView: false,
        forbidden: false,
        page: 1
    }

    componentDidMount() {
        
        if(!this.props.channelsLoading){
            this.fetchTargets();
        }
    }

    componentDidUpdate(prevProps) {
        if((this.props.selectedChannel !== prevProps.selectedChannel)){
            this.fetchTargets();
        }
    }

    showSearchView = (searchView = false) => {
        this.setState(() => ({
            searchView
        }));

        if(!searchView){
            this.fetchTargets();
        }
    };

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

        return follow(userId)
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

    fetchTargets = () => {
        this.setLoading(true);
        getKeywordTargets()
            .then((response) => {
                if(typeof(response.items) === "undefined") return;
                this.setState(() => ({
                    userItems: response.items,
                    actions: response.actions,
                    targets: response.targets,
                    loading: false,
                    forbidden: false,
                    page: 1
                }));
            }).catch(error => {
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
        getKeywordTargets(page)
            .then((response) => {
                if(typeof(response.items) === "undefined") return;
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

    reloadTargets = (targets) =>{
        this.setState(() => ({
            targets
        }));
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
                    <h2>KEYWORD TARGETS</h2>

                    <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden}/>
                    <UserList 
                        userItems={ this.state.userItems }
                        actionType="follow"
                        showTargetLink={true}
                        searchView={this.state.searchView}
                        showSearchView={this.showSearchView}
                        reloadTargets={this.reloadTargets}
                        targetType="keyword"
                        targets={this.state.targets}
                        actions={this.state.actions}
                        loading={this.state.loading}
                        perform={this.perform}
                        page="keyword-targets"
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

export default connect(mapStateToProps, mapDispatchToProps)(KeywordTargets);