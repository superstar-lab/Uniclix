import React from 'react';
import Popup from "reactjs-popup";
import {getInfoById} from '../../requests/facebook/channels';
import Loader from 'react-loader-spinner';
import {abbrNum} from '../../utils/numberFormatter';
import ReadMore from '../ReadMore';

class FacebookInfoCard extends React.Component{

    state = {
        user: false,
        loading: true //Pershtati info feeds and call it
    }

    fetchInfo = () => {
        const {channelId, accountId, simple=false} = this.props;
        this.setState(() => ({
            loading: true
        })); 
        getInfoById(channelId, accountId, simple)
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
                >
                {
                close => ( 
                    user ?
                    <div className="facebook-info-card scrollbar">
                        <div className="facebook-info-card-profile-container">  
                            {typeof user.cover !== "undefined" && user.cover.source && 
                            <img src={user.cover.source} />}                     
                            
                        </div>
                        <div className="facebook-info-card-profile-pic">
                            <img src={user.picture.data.url} />
                            <span>{user.name}</span> 
                        </div>

                        <div className="facebook-info-card-info">
                            {typeof user.fan_count !== "undefined" && user.fan_count &&
                            <div className="facebook-info-card-info-item">
                                <strong>Likes: </strong>{abbrNum(user.fan_count)}
                            </div>}
                            {typeof user.about !== "undefined" && user.about &&
                            <div className="facebook-info-card-info-item">
                                <strong>About: </strong><ReadMore>{user.about}</ReadMore>
                            </div>}
                            {typeof user.company_overview !== "undefined" && user.company_overview &&
                            <div className="facebook-info-card-info-item">
                                <strong>Company Overview: </strong><ReadMore>{user.company_overview}</ReadMore>
                            </div>}
                            {typeof user.general_info !== "undefined" && user.general_info &&
                            <div className="facebook-info-card-info-item">
                                <strong>General Info: </strong><ReadMore>{user.general_info}</ReadMore>
                            </div>}
                            {typeof user.products !== "undefined" && user.products &&
                            <div className="facebook-info-card-info-item">
                                <strong>Products: </strong>{user.products}
                            </div>}
                            {typeof user.website !== "undefined" && user.website &&
                            <div className="facebook-info-card-info-item">
                                <strong>Website: </strong><a href={user.website}>{user.website}</a>
                            </div>}
                        </div>
                    </div>
                    :
                    <div className="facebook-info-card">
                        {this.state.loading ?
                        <div className="flex-center-h full-width">
                            <Loader type="Bars" color="#46a5d1" height={30} width={30} />
                        </div>
                        :
                        <div>"Page Public Content Access" permission needed.</div>
                        }
                    </div>
                )
                }</Popup>
            </div>

        );
    }
}

export default FacebookInfoCard;