import React from 'react';
import {connect} from 'react-redux';
import {addAccountTarget, destroyAccountTarget} from '../../requests/twitter/channels';
import {startSetChannels} from '../../actions/channels';
import channelSelector from "../../selectors/channels";
import Loader from '../../components/Loader';

class AccountTargetSearchList extends React.Component{
    constructor(props){
        super(props);
    }

    state = {
        target: "",
        loading: false
    };

    onChange = (e) => {
        const target = e.target.value;
        this.setState(() => ({
            target
        }));
    };

    onSubmit = (e) => {
        this.setLoading(true);
        e.preventDefault();
        const target = this.state.target;
        if(target.length){
          addAccountTarget(target)
          .then((response) => {
              this.props.reloadTargets(response);
              this.setLoading(false);
            }).catch((error) => {
                this.setLoading(false);

                if(error.response.status === 401){
                    
                    if(this.props.selectedChannel.active){
                       this.props.startSetChannels();
                    }
                }

                return Promise.reject(error);
            });  
        }
    };

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    }

    removeTarget = (target) => {
        this.setLoading(true);
        destroyAccountTarget(target)
        .then((response) => {
            this.props.reloadTargets(response);
            this.setLoading(false);
        }).catch((error) => {
            this.setLoading(false);

            if(error.response.status === 401){
                    
                if(this.props.selectedChannel.active){
                   this.props.startSetChannels();
                }
            }

            return Promise.reject(error);
        });
    }

    render(){
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="item-list shadow-box">
                        <div className="item-header">
                            <button onClick={() => this.props.showSearchView(false)} className="gradient-background-teal-blue default-button">Done</button>
                        </div>
                        <div className="search-bar mt20">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-row">
                                    <div className="col-md-11 mb-3 p10-5">
                                        <input type="text" 
                                            className="form-control p20 full-radius" 
                                            onChange={this.onChange} id="username" 
                                            name="username" value={this.state.target} 
                                            placeholder="@ Enter Channel" />
                                    </div>
                                    <div className="col-md-1 mb-3 p10-5">
                                        {
                                            this.state.target ?
                                            <button className="gradient-background-teal-blue white-button add-target">ADD</button>
                                            :
                                            <button className="gradient-background-teal-blue white-button add-target disabled" disabled>ADD</button>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
        
                        <div className="added">

                                {!!this.props.targets.length && 
                                    <div>
                                        <div className="list-header">Saved Accounts</div>
                                        <div className="added-items">
                                        
                                            {this.props.targets.map((target) => <TargetItem key={target.id} target={target} removeTarget={this.removeTarget} />)}
                                            
                                        </div>
                                    </div>
                                }
                                {this.state.loading && <Loader />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 

const TargetItem = ({target, removeTarget}) => (
    <div className="item-row">
        <div className="profile-info pull-left">
            <img className="pull-left" src={target.profile_image_url} />
            <div className="pull-left">
                <input type="hidden" className="user_id" value=""/>
                <p className="profile-name mt15">{target.name} <span className="profile-username">@{target.screen_name}</span></p>
            </div>
        </div>
        <div className="item-actions pull-right">
            <ul>
                <li onClick={() => removeTarget(target.screen_name)} className="btn-links"><div className="trash-btn"><i className="fa fa-trash"></i> <span className="delete-text"> Delete</span></div></li>
            </ul>
        </div>
    </div>
);

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
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountTargetSearchList);