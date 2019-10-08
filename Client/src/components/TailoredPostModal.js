import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import UpgradeAlert from './UpgradeAlert';
import channelSelector, {publishChannels as publishableChannels} from '../selectors/channels';
import boardsSelector from '../selectors/boards';
import {publish} from '../requests/channels';
import {setPost, setPostedArticle} from "../actions/posts";
import SelectChannelsModal from './SelectChannelsModal';
import SelectPinterestBoards from './SelectPinterestBoards';
import DraftEditor from './DraftEditor';
import PublishButton from './PublishButton';
import {getUrlFromText, removeUrl} from '../utils/helpers';
import {LoaderWithOverlay} from "./Loader";

class TailoredPostModal extends React.Component{

    state = {
        publishChannels: publishableChannels(this.props.channels),
        selectChannelsModal: false,
        draftEditorModal: false,
        content: "",
        facebookContent: "",
        twitterContent: "",
        linkedinContent: "",
        pinterestContent: "",
        pictures: [],
        facebookPictures: [],
        twitterPictures: [],
        linkedinPictures: [],
        pinterestPictures: [],
        selectedPinterestChannel: false, 
        restricted: false,
        stored: false,
        error: false,
        type: "store",
        network: "",
        loading: false,
        forbidden: false
    };


    componentDidUpdate(prevProps) {

        if(prevProps.channels !== this.props.channels){
            this.setState(() => ({
                publishChannels: publishableChannels(this.props.channels)
            }));
        }
    }

    toggleSelectChannelsModal = () => {

        if(this.state.selectChannelsModal){
            localStorage.setItem('publishChannels', JSON.stringify(this.state.publishChannels));
        }

        this.setState(() => ({
            publishChannels: publishableChannels(this.state.publishChannels),
            selectChannelsModal: !this.state.selectChannelsModal
        }));
    };

    toggleSelectPinterestBoardsModal = () => {
        this.setState(() => ({
            selectedPinterestChannel: false,
            selectChannelsModal: true
        }));
    };

    toggleDraftEditorModal = (network = "") => {
        let body = this.state[network+"Content"];
        let defaultContent = network == "pinterest" ? `${this.props.title} ${this.props.description} ${this.props.source}` : `${this.props.title} ${this.props.source}`;
        let content = body ? body : defaultContent;
        let pictures = (this.state[network+"Pictures"] && this.state[network+"Pictures"].length) ? this.state[network+"Pictures"] : (network == "pinterest" ? [this.props.image] : []);

        if(network == "facebook" && !body){
            content = ` ${this.props.source}`;
        }

        this.setState(() => ({
            draftEditorModal: !this.state.draftEditorModal,
            network,
            content,
            pictures
        }));
    };

    toggleTailoredPostModal = () => {
        this.setState(() => ({
            facebookContent: "",
            facebookPictures: [],
            twitterContent: "",
            twitterPictures: [],
            linkedinContent: "",
            linkedinPictures: [],
            pinterestContent: "",
            pinterestPictures: []
        }), () => this.props.toggleTailoredPostModal({}));
    };

    onDone = (content = "", pictures = []) => {
        this.setState(() => ({
            [this.state.network+"Content"] : content,
            [this.state.network+"Pictures"]: pictures,
            draftEditorModal: !this.state.draftEditorModal,
            letterCount: content.length
        }));
    };

    onChannelSelectionChange = (obj) => {
        const selectedPinterestChannel = (!obj.selected || typeof(obj.boards) === "undefined") && obj.type == "pinterest" ? obj : false;

        const publishChannels = this.state.publishChannels.map((channel) => {
            if(channel.id === obj.id){
                return {
                    ...channel,
                    selected: channel.selected ? 0 : 1
                };
            }
            else{
        
                if(obj.type == "twitter" && channel.type == "twitter"){
                    return {
                        ...channel,
                        selected:0
                    };
                }else{
                    return {
                        ...channel
                    };
                }
            }
        });

        this.setState(() => ({
            publishChannels,
            selectedPinterestChannel
        }));
    };

    onPinterestBoardSelectionChange = (obj, boards) => {
        const selectedBoards = boardsSelector(boards, {selected: true});
        const publishChannels = this.state.publishChannels.map((channel) => {
            if(channel.id === obj.id){
                return {
                    ...channel,
                    boards,
                    selectedBoards
                };
            }
            else{
        
                if(obj.type == "twitter" && channel.type == "twitter"){
                    return {
                        ...channel,
                        selected:0
                    };
                }else{
                    return {
                        ...channel
                    };
                }
            }
        });

        this.setState(() => ({
            publishChannels
        }));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden,
            loading: false
        }));
    };

    publish = (scheduled, publishType) => {
        const content = this.state.content;
        const defaultContent = `${this.props.title} ${this.props.source}`;
        const defaultPinterestContent = `${this.props.title} ${this.props.description} ${this.props.source}`
        const facebookContent = this.state.facebookContent ? this.state.facebookContent : this.props.source;
        const twitterContent = this.state.twitterContent ? this.state.twitterContent : defaultContent;
        const linkedinContent = this.state.linkedinContent ? this.state.linkedinContent : defaultContent;
        const pinterestContent = this.state.pinterestContent ? this.state.pinterestContent : defaultPinterestContent;
        const facebookPictures = this.state.facebookPictures;
        const twitterPictures = this.state.twitterPictures;
        const linkedinPictures = this.state.linkedinPictures;
        const pinterestPictures = this.state.pinterestPictures.length ? this.state.pinterestPictures : [this.props.image];
        const type = this.state.type;
        const id = this.props.post ? this.props.post.id : "";
        const articleId = this.props.postId;
        const images = this.state.pictures;
        const publishChannels = channelSelector(this.state.publishChannels, {selected: true, provider: undefined});

        // console.log(pinterestPictures); return;
        this.setState(() => ({
            loading: true
        }));

        publish({
            content, 
            facebookContent,
            twitterContent,
            linkedinContent,
            pinterestContent,
            facebookPictures,
            twitterPictures,
            linkedinPictures,
            pinterestPictures,
            images,                
            publishChannels, 
            publishType, 
            scheduled,
            type,
            id,
            articleId
        })
        .then((response) => {
            this.setState(() => ({
                loading: false,
                stored: true
            }), () => {

                if(articleId){
                    this.props.setPostedArticle({
                        articleId,
                        posted: publishType == "now" ? 1 : 0
                    });
                }

                this.props.toggleTailoredPostModal({});
            });
        }).catch((error) => {            
            
            if(error.response.status === 403){
                this.setForbidden(true);
                return;
            }

            let errorMessage = "Something went wrong";

            if(error.response.status === 401){
                errorMessage = error.response.data.message;
                window.location.reload();
            }

            this.setState(() => ({
                loading: false,
                error: errorMessage
            }));
        });
    };

    render(){
        const {title, image, source, description, body, isOpen} = this.props;
        const selectedChannels = channelSelector(this.state.publishChannels, {selected: true, provider: undefined});

        const facebookContent = this.state.facebookContent;
        const twitterContent = this.state.twitterContent;
        const linkedinContent = this.state.linkedinContent;
        const pinterestContent = this.state.pinterestContent;

        const facebookBody = removeUrl(facebookContent);
        const twitterBody = removeUrl(twitterContent);
        const linkedinBody = removeUrl(linkedinContent);
        const pinterestBody = removeUrl(pinterestContent);

        const facebookPictures = this.state.facebookPictures;
        const twitterPictures = this.state.twitterPictures;
        const linkedinPictures = this.state.linkedinPictures;
        const pinterestPictures = this.state.pinterestPictures;

        return  (
                    <Modal 
                    isOpen={isOpen}
                    ariaHideApp={false}
                    className="tailored-post-wrapper modal-animated-dd"
                    closeTimeoutMS={300}
                    >   
                    <UpgradeAlert 
                    isOpen={this.state.forbidden && !this.state.loading} 
                    text={`You exceeded the post limit for this month.`} 
                    setForbidden={this.setForbidden}/>

                    {this.state.loading && <LoaderWithOverlay/>}

                        <Modal isOpen={this.state.selectChannelsModal} ariaHideApp={false} className="modal-no-bg">
                            <SelectChannelsModal 
                            channels={this.state.publishChannels} 
                            onChange={this.onChannelSelectionChange}
                            toggle={this.toggleSelectChannelsModal}/>
                        </Modal>

                        
                        <Modal isOpen={!!this.state.selectedPinterestChannel} ariaHideApp={false} className="modal-no-bg">
                            <SelectPinterestBoards 
                            onChange={this.onPinterestBoardSelectionChange}
                            channel={this.state.selectedPinterestChannel} 
                            toggle={this.toggleSelectPinterestBoardsModal}/>
                        </Modal>

                        <Modal isOpen={this.state.draftEditorModal} ariaHideApp={false} closeTimeoutMS={300} className="modal-bg-radius">
                            <DraftEditor 
                                content={this.state.content}
                                pictures={this.state.pictures}
                                toggle={this.toggleDraftEditorModal}
                                onDone={this.onDone}
                                network={this.state.network}
                                inclusive={true}
                            />
                        </Modal>

                        <div className="tailored-post-container">
                            <div className="tailored-post-content">
                                <TailoredPostCard 
                                    network="twitter"
                                    body={twitterBody}
                                    content={twitterContent}
                                    pictures={twitterPictures}
                                    title={title}
                                    description={description}
                                    image={image}
                                    source={source}
                                    selectedChannels={selectedChannels}
                                    onOverlayClick={this.toggleSelectChannelsModal}
                                    onEditClick={this.toggleDraftEditorModal}
                                />

                                <TailoredPostCard 
                                    network="facebook"
                                    body={facebookBody}
                                    content={facebookContent}
                                    pictures={facebookPictures}
                                    title={title}
                                    description={description}
                                    image={image}
                                    source={source}
                                    selectedChannels={selectedChannels}
                                    onOverlayClick={this.toggleSelectChannelsModal}
                                    onEditClick={this.toggleDraftEditorModal}
                                />

                                <TailoredPostCard 
                                    network="linkedin"
                                    body={linkedinBody}
                                    content={linkedinContent}
                                    pictures={linkedinPictures}
                                    title={title}
                                    description={description}
                                    image={image}
                                    source={source}
                                    selectedChannels={selectedChannels}
                                    onOverlayClick={this.toggleSelectChannelsModal}
                                    onEditClick={this.toggleDraftEditorModal}
                                />

                                <TailoredPostCard 
                                    network="pinterest"
                                    body={pinterestBody}
                                    content={pinterestContent}
                                    pictures={pinterestPictures}
                                    title={title}
                                    description={description}
                                    image={image}
                                    source={source}
                                    selectedChannels={selectedChannels}
                                    onOverlayClick={this.toggleSelectChannelsModal}
                                    onEditClick={this.toggleDraftEditorModal}
                                />

                            </div>
                            <div className="tailored-post-bottom flex-center">
                                <div className="tailored-post-bottom-content flex-center-h">

                                    <ul className="compose-header">
                                        <li onClick={this.toggleSelectChannelsModal} className="add-new-channel"><i className="fa fa-plus"></i></li>

                                        {!!this.state.publishChannels.length && channelSelector(this.state.publishChannels, {selected: true, provider: undefined}).map((channel) => (
                                            
                                            <li key={channel.id} className="channel-item">
                                                <div className="remove-overlay fa fa-close" onClick={() => this.onChannelSelectionChange(channel)}></div>
                                                <img onError={(e) => e.target.src='/images/dummy_profile.png'} src={channel.avatar}/>
                                                <i className={`fa fa-${channel.type} ${channel.type}_bg smallIcon`}></i>
                                            </li>
                                        ))}

                                    </ul>
                                    <PublishButton 
                                        action={this.publish} 
                                        onChange={this.updateScheduledLabel}
                                        restricted={this.state.restricted || selectedChannels.length < 1}
                                    />

                                </div>

                            </div>
                        </div>
                        <div className="tailored-post-close flex-center-h">
                            <button className="btn tailorCloseBtn" onClick={() => this.toggleTailoredPostModal()}>
                                <i className="fa fa-close"></i>
                            </button>
                        </div>
                    </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    const channels = channelSelector(state.channels.list, {selected: undefined, provider: undefined, publishable: true});

    return {
        channels
    }
};

const mapDispatchToProps = (dispatch) => ({
    setPost: (post) => dispatch(setPost(post)),
    setPostedArticle: (article) => dispatch(setPostedArticle(article))
});

export default connect(mapStateToProps, mapDispatchToProps)(TailoredPostModal);

const TailoredPostCard = ({network, title, body, content, description, pictures, image, source, selectedChannels, onOverlayClick, onEditClick}) => {
    let link = content ? getUrlFromText(content) : [source];
  
    if(link){
        if(source !== link[0]){
            image = "";
            source = "";
            body = content;
        }
    }else{
        image = "";
        source = "";
        body = content;
    }

    if(pictures.length){
        image = pictures[0];
        body = content;
    }

    body = body.trim();

    return(
        <div className="tailored-post-card">

        <div className="tailored-post-card-content">
                <div onClick={() => onEditClick(network)} className="tailored-post-preview">

                    {network != "pinterest" &&
                        <div className="tailored-post-preview__header">
                            <i className={ `socialIcon fa fa-${network} ${network}_bg`}></i>
                            <div>
                                <div className="social-preview-title">{network} preview</div>
                                <div className="small-blurry-text">small text here</div>
                            </div>
                        </div>
                    }

                    
                    {network == "facebook" && !body ?
                        <div className="social-body-text-suggestion">
                            Click here to add text
                        </div>
                        :
                        (network != "pinterest" ? 
                        <div className="social-body-text giveMeEllipsis-2">
                            {body ? body : (source ? title : "")}
                        </div>: ""
                        )
                    }
                    <div className="tailored-post-preview-body">
                        {!!image &&
                            <img className={network == "pinterest" ? "pinterestPreviewImage" : ""} src={image}/>
                        }
                        
                        {network != "pinterest" ? (!!source && !pictures.length &&
                            <div className="tailoredPost__previewCardWrapper__link__text">
                                <div className="tailoredPost__previewCardWrapper__link__title">{title}</div>
                                <div className="tailoredPost__previewCardWrapper__link__domain">{source}</div>
                            </div>) : 
                            <div className="social-body-text noSidePadding height-109">
                                <div className="flex-center-h">
                                    <div className="social-preview-title"><i className={ `socialIcon sideIcon-r fa fa-${network} ${network}_bg`}></i></div>
                                    <div className="giveMeEllipsis-5"> <strong>{network} preview </strong> {body ? body : (source ? `${title} ${description ? description : ""} ${source}` : "")}</div>
                                </div>
                            </div>
                        }

                    </div>
                </div>

                {!(!!channelSelector(selectedChannels, {selected: undefined, provider: network}).length) &&
                    <div onClick={onOverlayClick} className="tailored-post-overlay flex-center-v">
                    
                        <div>
                            <div className="flex-center-h">
                                <i className={`overlaySocialIcon fa fa-${network} ${network}_color`}></i>
                            </div>
                            <div className="flex-center-h center-inline p10">
                                Let's reach more people by posting on {network}
                            </div>
                            <div className="flex-center-h">
                                <button className={`connectButton btn ${network}_bg normalizeText whiteTxt`}>Add {network}</button>
                            </div>
                        </div>

                    </div>
                }
            </div>
        </div>
    );
}