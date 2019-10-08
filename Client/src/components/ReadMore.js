import React, { Component } from 'react';
import {truncate, parseTextWithLinks} from '../utils/helpers';

class ReadMore extends Component {

    state = {
      expanded: false,
      text: "",
      length: 200
    }

    componentDidMount(){
        const { expanded } = this.state;
        const {children, characters, onTagClick = false} = this.props;
        const length = characters ? characters : 200;

        let text = "";

        if(typeof(children) !== "undefined"){
            text = expanded ? parseTextWithLinks(children, onTagClick) : parseTextWithLinks(truncate(children, length), onTagClick);
        }
        
        this.setState(() => ({
            text,
            length
        }));
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.expanded !== this.state.expanded || prevProps.children !== this.props.children){
            const { expanded, length } = this.state;
            const {children, onTagClick = false} = this.props;
            const text = expanded ? parseTextWithLinks(children, onTagClick) : parseTextWithLinks(truncate(children, length), onTagClick);

            this.setState(() => ({
                text
            }));
        }
    }

    //function that takes in expanded and makes it the opposite of what it currently is
    toggleExpand = () => { 
        this.setState({ expanded: !this.state.expanded });
    }

    prepareHtml = () => {
        return <div dangerouslySetInnerHTML={{__html: this.state.text}}></div>
    }

    render() {
        const { expanded, length } = this.state;
        const {children, onTagClick = (str) => {}} = this.props;
        
        return (
            
            <div onClick={(e) => onTagClick(e.target.text)}>            
                {this.prepareHtml()}
                {typeof(children) !== "undefined" && children.length > length ?
                    <p className="linkify-text" onClick={this.toggleExpand}>{!expanded ? "Read more" : "Read less"}</p> : ""
                }
                
            </div>
        )
    }
}

export default ReadMore;