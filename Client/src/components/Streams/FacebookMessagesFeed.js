import React from 'react';
import Modal from 'react-modal';
import ReadMore from '../ReadMore';
import FacebookConversation from './FacebookConversation';
import { ToastContainer } from "react-toastr";
import {toHumanTime} from '../../utils/helpers';

let toastContainer;

class FacebookMessagesFeed extends React.Component{
    state = {
        conversationOpen: false
    }

    toggleConversation = (message = "") => {

        this.setState(() => ({
            conversationOpen: !this.state.conversationOpen
        }), () => {
            
            if(message == "success"){
                toastContainer.success("Message posted.", "Success", {closeButton: true});
            }

            if(message == "error"){
                toastContainer.error("Something went wrong.", "Error", {closeButton: true});
            }
        });
    };

    render(){
        
        try{    
            const {feedItem, channel, updateItem} = this.props;
            const text = feedItem.messages.data[0].message ? feedItem.messages.data[0].message : "";
                return (
                    <div>
                        <ToastContainer
                            ref={ref => toastContainer = ref}
                            className="toast-top-right"
                        />
                        {this.state.conversationOpen &&
                        <Modal
                            ariaHideApp={false}
                            className="t-reply-modal"
                            isOpen={this.state.conversationOpen}
                        >
                            <FacebookConversation 
                                close={this.toggleConversation} 
                                messages={feedItem.messages} 
                                feedItem={feedItem} 
                                channel={channel} 
                                updateItem={updateItem}/>
                        </Modal>
                        }
                        <div className={`stream-feed-container fb-conversations`} onClick={this.toggleConversation}>
                            <div className="post-info">
                                <img src={channel.name === feedItem.messages.data[0].from.name ? channel.avatar : "/images/dummy_profile.png"} />
                                <div className="post-info-item">
                                    <a href="#" className="username"><strong>{feedItem.messages.data[0].from.name}</strong></a>
                                    <div className="post-date">{toHumanTime(feedItem.messages.data[0].created_time)}</div>
                                </div>
                            </div>
                            <div className="post-content">
                                <ReadMore>{text}</ReadMore>
                            </div>
                        </div>
                    </div>

                )
        }catch(e){
            console.log(e);
            return <div></div>;
        }
    }
};

export default FacebookMessagesFeed;