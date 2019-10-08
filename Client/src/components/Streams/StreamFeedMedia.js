import React from 'react';
import {chunk} from '../../utils/helpers';

class StreamFeedMedia extends React.Component{

    state = {
        videoClicked: false
    }
    
    handleVideoClick = () => {
        this.setState( () => ({
            videoClicked: !this.state.videoClicked
        }));
    }

    render(){
        const {media, setImages} = this.props;
        const {videoClicked} = this.state;

        if(!media.length) return <div></div>;

        let images = media.filter(item => item.type === "photo");
        const thumbnails = chunk(media, 2);

        return thumbnails.map((items, index) => {
            
                    if(index > 1) return;

                    return (<div key={index} className="post-media">

                            {items.map((item, i) => (
                                
                                <div key={i} className={`media-box ${item.type}-media-box ${media.length > 4 && index > 0 && i > 0 ? 'more-images': ''}`}>
                                    
                                    {item.type !== "video" || !videoClicked? <img src={item.src} /> :
                                        <div>
                                            
                                            <button onClick={this.handleVideoClick} className="video-close-btn"><i className="fa fa-close"></i></button>
                                            {item.source.includes("youtube") ? 
                                                <iframe allowFullScreen src={item.source}></iframe>
                                                :
                                                <video autoPlay controls>
                                                    <source src={item.source} type="video/mp4" />
                                                </video> 
                                            }
                                        </div>
                                    }
                                    <div className="hover-overlay" onClick={() => setImages(images, index > 0 ? 2 + i : i)}>
                                        <div className="overlay-text">{media.length > 4 ? "+"+(media.length - 4): ""}</div>
                                    </div>
                                    {item.type === "video" && !this.state.videoClicked && 
                                    <div onClick={this.handleVideoClick} className="video-overlay">
                                        <div className="overlay-text"><i className="fa fa-play"></i></div>
                                    </div>}
                                </div>
                            ))}

                        </div>)
                });
    }        
}

export default StreamFeedMedia;