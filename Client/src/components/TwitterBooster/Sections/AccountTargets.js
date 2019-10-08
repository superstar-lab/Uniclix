import React from 'react';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import UserList from "../../UserList";
import UpgradeAlert from '../../UpgradeAlert';
import { getAccountTargets, follow } from '../../../requests/twitter/channels';
import {startSetChannels} from "../../../actions/channels";
import channelSelector from '../../../selectors/channels';
import Loader from '../../Loader';

class AccountTargets extends React.Component{
    state = {
        userItems: [],
        actions: 0,
        targets: [],
        loading: this.props.channelsLoading,
        searchView: false,
        page: 1,
        forbidden: false
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

    fetchTargets = () => {
        this.setLoading(true);
        getAccountTargets()
            .then((response) => {
                this.setState(() => ({
                    userItems: response.items,
                    actions: response.actions,
                    targets: response.targets,
                    loading: false,
                    forbidden: false,
                    page: 1
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
        getAccountTargets(page)
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

    reloadTargets = (targets) =>{
        this.setState(() => ({
            targets
        }));
    };

    render(){
        return (
            <div>
                <h2>ACCOUNT TARGETS</h2>
                <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden}/>
                <UserList 
                    userItems={ this.state.userItems }
                    actionType="follow"
                    showTargetLink={true}
                    searchView={this.state.searchView}
                    showSearchView={this.showSearchView}
                    reloadTargets={this.reloadTargets}
                    targetType="account"
                    targets={this.state.targets}
                    actions={this.state.actions}
                    loading={this.state.loading}
                    perform={this.perform}
                    page="account-targets"
                />
                <BottomScrollListener onBottom={this.loadMore} />
                {this.state.loading && <Loader />}
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountTargets);