import React from 'react';
import {Modifier, EditorState, getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-mention-plugin/lib/plugin.css';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import ImageUploader from 'react-images-browse/src/component/compiled';
import moment from "moment";
import hashtagSuggestionList from '../fixtures/hashtagSuggestions';

const {hasCommandModifier} = KeyBindingUtil;

class DraftEditor extends React.Component{

    imageIcon = React.createRef();

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
        scheduled_at: moment(),
        scheduled_at_original: moment()
    };
    
    state = {
        editorState: createEditorStateWithText(this.props.content),
        hashtagSuggestions: hashtagSuggestionList,
        letterCount: 0,
        pictures: this.props.pictures,
        showEmojiIcon: typeof(this.props.showEmojiIcon) !== "undefined" ? this.props.showEmojiIcon : true,
        showImagesIcon: typeof(this.props.showImagesIcon) !== "undefined" ? this.props.showImagesIcon : true,
        showHashtagsIcon: typeof(this.props.showHashtagsIcon) !== "undefined" ? this.props.showHashtagsIcon : true,
        placeholderText: typeof(this.props.placeholderText) !== "undefined" ? this.props.placeholderText : "What's on your mind?",
        singleImage: typeof(this.props.singleImage) !== "undefined" ? this.props.singleImage : true,
        imageLimit:  typeof(this.props.imageLimit) !== "undefined" ? this.props.imageLimit : 4
    };


    focus = () => {
        this.editor.focus();
    };

    onChange = (editorState) => {

        const text = editorState.getCurrentContent().getPlainText();

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

    render(){

        const emojiPlugin = this.emojiPlugin;
        const hashtagMentionPlugin = this.hashtagMentionPlugin;

        const { EmojiSuggestions, EmojiSelect} = emojiPlugin;
        const { MentionSuggestions: HashtagSuggestions } = hashtagMentionPlugin;
        const plugins = [emojiPlugin, hashtagMentionPlugin];
        const {scheduledLabel, inclusive, toggle, network} = this.props;

        return(
            <div className="draft_editor_container">

                {inclusive &&
                    <div className="modal-header">
                        <button type="button" id="closeModal" onClick={toggle} className="close fa fa-times-circle" data-dismiss="modal"></button>
                        <h4>Editing</h4>
                    </div>
                }

                <div className="modal-body">
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
                                <ImageUploader
                                    withIcon={false}
                                    buttonText=''
                                    onChange={this.onDrop}
                                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                    withPreview={true}
                                    withLabel={false}
                                    buttonClassName='dnone'
                                    ref={this.imageIcon}
                                    defaultImages={this.state.pictures}
                                    singleImage={this.state.singleImage}
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
                <div className="editor-icons">
                    {this.state.showImagesIcon && 
                        (   this.state.imageLimit <= this.state.pictures.length ?
                            <i className="fa fa-image upload-images disabled-btn"></i>
                            :
                            <i onClick={this.onImageIconClick} className="fa fa-image upload-images"></i>
                        )
                    }
                    {/* <i className="fa fa-map-marker add-location"></i> */}
                    {this.state.showEmojiIcon && <EmojiSelect />}
                    {this.state.showHashtagsIcon && <i onClick={this.onHashIconClick} className="fa fa-hashtag add-hashtag"></i>}
                </div>

                {inclusive && 
                    <div className="modal-footer" style={{position:"relative"}}>
                    
                        <p className={`letter-count pull-left ${this.state.letterCount > 280 && network == 'twitter' ? 'red-txt' : ''}`}>{this.state.letterCount}</p>

                        {(this.state.letterCount > 280 && network == "twitter") || (this.state.pictures.length < 1 && network == "pinterest") || (this.state.letterCount < 1 && this.state.pictures.length < 1) ?
                            <button disabled onClick={this.onDone} className={`upgrade-btn pull-right disabled-btn`}>Done</button>
                        :
                            <button onClick={this.onDone} className={`upgrade-btn pull-right`}>Done</button>
                        }
                        
                    </div>
                }
            </div>
        );
    }
}


export default DraftEditor;