import React from 'react';
import {Modifier, EditorState, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-mention-plugin/lib/plugin.css';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import FileUploader from '../components/FileUploader/component/index';
import moment from "moment";
import hashtagSuggestionList from '../fixtures/hashtagSuggestions';
import FunctionModal from "./Modal";
import {upload} from '../requests/channels';

class DraftEditor extends React.Component{

    imageIcon = React.createRef();
    videoRef = React.createRef();   

    constructor(props){
        super(props);
        if(typeof(emojiPlugin) === "undefined"){
            this.emojiPlugin = createEmojiPlugin();
            this.hashtagMentionPlugin = createMentionPlugin({
                mentionPrefix: "#",
                mentionTrigger: "#"
            });
        }
    }

    defaultPost = {
        id: "",
        content: "", 
        type: "store",
        images: [],
        videos: [],
        scheduled_at: moment(),
        scheduled_at_original: moment()
    };
    
    state = {
        editorState: createEditorStateWithText(this.props.content),
        hashtagSuggestions: hashtagSuggestionList,
        letterCount: 0,
        pictures: this.props.pictures,
        videos: this.props.videos,
        showEmojiIcon: typeof(this.props.showEmojiIcon) !== "undefined" ? this.props.showEmojiIcon : true,
        showImagesIcon: typeof(this.props.showImagesIcon) !== "undefined" ? this.props.showImagesIcon : true,
        showVideosIcon: typeof(this.props.showVideosIcon) !== "undefined" ? this.props.showVideosIcon : true,
        showHashtagsIcon: typeof(this.props.showHashtagsIcon) !== "undefined" ? this.props.showHashtagsIcon : true,
        placeholderText: typeof(this.props.placeholderText) !== "undefined" ? this.props.placeholderText : "What's on your mind?",
        singleImage: typeof(this.props.singleImage) !== "undefined" ? this.props.singleImage : true,
        videoName: '',
        progressBarValue: 0,
        uploadCount: -1,
    };


    focus = () => {
        this.editor.focus();
    };

    onChange = (editorState) => {

        const text = editorState.getCurrentContent().getPlainText();
        console.log(text);
        this.setState(() => ({
            editorState,
            letterCount: text.length
        }), () => {
            if(typeof(this.props.onChange) !== "undefined"){
                this.props.onChange(text);
            }
        });
    };

    onDrop = (pictures, pictureDataUrls) => {
        this.setState((prevState) => {
            if(prevState.pictures !== pictures){
                return {
                    pictures: pictureDataUrls
                }
            }
        }, () => {
            if(typeof(this.props.onImagesChange) !== "undefined"){
                this.props.onImagesChange(pictureDataUrls);
            }
        });
    };

    onVideo = (videos, videoDataUrls) => {
        this.setState((prevState) => {
            if(prevState.videos !== videos){
                return {
                    videos: videoDataUrls
                }
            }
        }, () => {
            if(typeof(this.props.onVideosChange) !== "undefined"){
                this.props.onVideosChange(videoDataUrls);
            }
        });
    };

    onDone = () => {
        const text = this.state.editorState.getCurrentContent().getPlainText();
        const pictures = this.state.pictures;

        this.props.onDone(text, pictures);
    };

    onImageIconClick = () => {
        this.imageIcon.current.
        inputElement.
        previousSibling.
        click();
    };

    onVideoIconClick = () => {
        let selectedLinkedIn = false;
        const selectedChannels = this.getPublishChannels();
        selectedChannels.forEach(channel => {
          if (channel.type == "linkedin") {
            selectedLinkedIn = true;
          }
        });
        if (selectedLinkedIn == true) {
          FunctionModal({
            type: 'error',
            title: 'Warning',
            content: 'Video scheduling is not supported with LinkedIn due to LinkedIn API.',
            onOk: this.onOpenFileBrowser
          });
        } else {
            this.onOpenFileBrowser();
        }
    };

    onOpenFileBrowser = () => {
        this.videoRef.current.inputElement.
        previousSibling.click();
    };
    
    onHashIconClick = () => {
        const editorState = this.state.editorState;
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const ncs = Modifier.insertText(contentState, selection, "#");
        const es = EditorState.push(editorState, ncs, 'insert-fragment');
        this.setState(() => ({
            editorState: es
        }), () => this.focus());
    };

    onHashtagSearchChange = ({ value }) => {
        this.setState(() => ({
            hashtagSuggestions: defaultSuggestionsFilter(value, hashtagSuggestionList)
        }));
    };

    onAddMention = (mention) => {
        //console.log('mention', mention)
    };

    myKeyBindingFn = (e) => {
        const {onEnterKey} = this.props;
        if (e.key === "Enter" && !e.shiftKey) {

            if(typeof(onEnterKey) !== "undefined"){
                onEnterKey(); 
            }
            //return 'myeditor-save';
        }

        return getDefaultKeyBinding(e);
    }

    // This is necessary since we are storing the ids of the channels and the
    // backend expects the whole object
    getPublishChannels = () => {
      const { channels, publishChannels } = this.props;
      const selectedChannels = channels.filter(channel => publishChannels.has(channel.details.channel_id));

      return selectedChannels;
    }

    onUpload = (picture) => {
        const uploadPicture = [picture];
        let count = this.state.uploadCount;
        this.setState({
           uploadCount: count + 1,
        });
        if (picture.substring(5, 10) == "image") {
            upload({
                images: uploadPicture,
                videos: [],
            }, ProgressEvent => {
                this.setState({
                    progressBarValue: Math.floor(ProgressEvent.loaded / ProgressEvent.total * 100) % 101
                });
            }).then((res) => {
                this.props.onUploadMedia(res.uploadedImages, res.uploadedVideos);
            });
        } else {
            upload({
                images: [],
                videos: uploadPicture,
            }, ProgressEvent => {
                this.setState({
                    progressBarValue: Math.floor(ProgressEvent.loaded / ProgressEvent.total * 100) % 101
                });
            }).then((res) => {
                this.props.onUploadMedia(res.uploadedImages, res.uploadedVideos);
            });
        }
    }

    getErrors = () => {
        const { withTwitter, content, setWithError, withError } = this.props;
        let errors = [];

        if (withTwitter && content.length >= 280) {
            errors.push('Twitter does\'t allow more that 280 characters.');
        }

        if (errors.length && !withError) {
            setWithError(true);
        } else if (!errors.length && withError) {
            setWithError(false);
        }

        return errors;
    }
    
    render(){
        const emojiPlugin = this.emojiPlugin;
        const hashtagMentionPlugin = this.hashtagMentionPlugin;

        const { EmojiSuggestions, EmojiSelect} = emojiPlugin;
        const { MentionSuggestions: HashtagSuggestions } = hashtagMentionPlugin;
        const plugins = [emojiPlugin, hashtagMentionPlugin];
        const {scheduledLabel, inclusive, toggle, network, imageLimit} = this.props;
        const { videoName } = this.state;
        const errors = this.getErrors();

        return(
            <React.Fragment>
                <div className="draft_editor_container">

                    {inclusive &&
                        <div className="modal-header">
                            <button
                                id="closeModal"
                                onClick={toggle}
                                className="close fa fa-times-circle"
                                data-dismiss="modal">
                            </button>
                            <h4>Editing</h4>
                        </div>
                    }

                    <div className="draft-body">
                        <form id="draft_form">
                            <div>
                                <div className="editor" onClick={this.focus}>

                                    {scheduledLabel}

                                    <Editor
                                        editorState={this.state.editorState}
                                        onChange={this.onChange}
                                        handleKeyCommand={this.props.handleKeyCommand}
                                        keyBindingFn={this.myKeyBindingFn}
                                        plugins={plugins}
                                        placeholder={this.state.placeholderText}
                                        ref={(element) => { this.editor = element; }}
                                    />
                                    <FileUploader
                                        withIcon={false}
                                        buttonText=''
                                        onChange={this.onDrop}
                                        imgExtension={['.jpg', '.gif', '.png', '.gif', '.webp', '.jpeg', '.svg']}
                                        maxFileSize={5242880}
                                        withPreview={true}
                                        withLabel={false}
                                        buttonClassName='dnone'
                                        ref={this.imageIcon}
                                        defaultImages={this.state.pictures}
                                        singleImage={this.state.singleImage}
                                        fileType='image'
                                        onUpload={this.onUpload}
                                        progressBarValue={this.state.progressBarValue}
                                        uploadCount={this.state.uploadCount}
                                    />
                                    <FileUploader
                                        withIcon={false}
                                        buttonText=''
                                        onChange={this.onVideo}
                                        imgExtension={['.mp4', '.avi', '.mov', '.mpg', '.mpeg', '.webm', '.wmv', '.ogm', '.ogv', '.asx', '.m4v']}
                                        accept="video/mp4,video/x-m4v,video/*"
                                        maxFileSize={104857600}
                                        withPreview={true}
                                        withLabel={false}
                                        buttonClassName='dnone'
                                        ref={this.videoRef}
                                        defaultImages={this.state.videos}
                                        singleImage={this.state.singleImage}
                                        fileType='video'
                                        onUpload={this.onUpload}
                                        progressBarValue={this.state.progressBarValue}
                                        uploadCount={this.state.uploadCount}
                                    />

                                    <EmojiSuggestions />
                                    <HashtagSuggestions
                                        onSearchChange={this.onHashtagSearchChange}
                                        suggestions={this.state.hashtagSuggestions}
                                        onAddMention={this.onAddMention}
                                        onClose={() => this.setState({ ...this, suggestions: hashtagSuggestionList })}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="video-label">{videoName}</div>
                    <div className="editor-icons">
                        {this.state.showEmojiIcon && <EmojiSelect />}
                        {this.state.showImagesIcon && 
                            (   (imageLimit <= this.state.pictures.length) || (this.state.videos.length > 0) ?
                                <i className="fa fa-image upload-images disabled-btn"></i>
                                :
                                <i onClick={this.onImageIconClick} className="fa fa-image upload-images" style={{color: '#2D86DA'}}></i>
                            )
                        }
                        {this.state.showVideosIcon && 
                            ((imageLimit <= this.state.videos.length) || (this.state.pictures.length > 0) ?
                                <i className="fa fa-file-video-o disabled-btn"></i>
                                :
                                <i className="fa fa-file-video-o" onClick={this.onVideoIconClick}></i>
                            )
                        }
                    </div>
                </div>
                {
                    !!errors.length && (
                        <div className="editor-errors">
                            {
                                errors.map(error => <div className="error-msg">{error}</div>) 
                            }
                        </div>
                    )
                }
            </React.Fragment>
        );
    }
}


export default DraftEditor;