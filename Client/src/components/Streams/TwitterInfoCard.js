import React from 'react';
import Popup from "reactjs-popup";
import {getUserInfo} from '../../requests/twitter/channels';
import Loader from 'react-loader-spinner';
import {abbrNum} from '../../utils/numberFormatter';


const popupStyle = {
    width: 500,
}

class TwitterInfoCard extends React.Component{

    state = {
        user: false,
        loading: true
    }

    fetchInfo = () => {
        const {channelId, username} = this.props;
        this.setState(() => ({
            loading: true
        })); 
        getUserInfo(channelId, username)
        .then(response => {
            this.setState(() => ({
                user: response,
                loading: false
            })); 
        }).catch(e => {
            console.log(e);
            this.setState(() => ({
                loading: false
            })); 
        });
    };

    render(){
        const {user} = this.state;
        const {username} = this.props;
        return (
            <div>
                <Popup
                trigger={<a href="javascript:void(0)" className="username"><strong>{username}</strong></a>}
                on="click"
                onOpen={this.fetchInfo}
                position="right center"
                arrow={false}
                closeOnDocumentClick={true}
                contentStyle={popupStyle}
                >
                {
                close => ( 
                    user ?
                    <div className="twitter-info-card scrollbar">
                        <div className="twitter-info-card-profile-container">  
                            {typeof user.profile_banner_url !== "undefined" && user.profile_banner_url && 
                            <img src={user.profile_banner_url} />}                     
                            
                        </div>
                        <div className="twitter-info-card-profile-pic">
                            <img src={user.profile_image_url_https} />
                            <span>{user.name} @{user.screen_name}</span> 
                        </div>

                        <div className="twitter-info-card-stats">
                            <div className="twitter-info-card-stat-item">
                                <h4>Followers</h4>
                                <div>{abbrNum(user.followers_count)}</div>
                            </div>
                            <div className="twitter-info-card-stat-item">                                
                                <h4>Following</h4>
                                <div>{abbrNum(user.friends_count)}</div>
                            </div>
                            <div className="twitter-info-card-stat-item">                                
                                <h4>Tweets</h4>
                                <div>{abbrNum(user.statuses_count)}</div>
                            </div>
                        </div>

                        <div className="twitter-info-card-info">
                            {typeof user.description !== "undefined" && user.description &&
                            <div className="twitter-info-card-info-item">
                                <strong>Bio: </strong>{user.description}
                            </div>}
                            {typeof user.url !== "undefined" && user.url &&
                            <div className="twitter-info-card-info-item">
                                <strong>Website: </strong><a target="_blank" href={user.url}>{user.url}</a>
                            </div>}
                            {typeof user.screen_name !== "undefined" && user.screen_name &&
                            <div className="twitter-info-card-info-item">
                                <strong>Twitter: </strong><a target="_blank" href={`https://twitter.com/${user.screen_name}`}>https://twitter.com/{user.screen_name}</a>
                            </div>}
                        </div>
                    </div>
                    :
                    <div className="twitter-info-card">
                        {this.state.loading ?
                        <div className="flex-center-h full-width">
                            <Loader type="Bars" color="#46a5d1" height={30} width={30} />
                        </div>
                        :
                        <div>Failed to retrieve profile data.</div>
                        }
                    </div>
                )
                }</Popup>
            </div>

        );
    }
}

export default TwitterInfoCard;