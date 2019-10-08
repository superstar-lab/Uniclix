import React from 'react';
import { connect } from 'react-redux';
import {getBoards} from '../requests/pinterest/channels';
import {startSetChannels} from "../actions/channels";
import Loader from './Loader';

class SelectPinterestBoards extends React.Component{

    state = {
        boards: [],
        loading: false,
        error: false,
    }

    componentDidMount(){
        const channel = this.props.channel;
        if(channel){
            if(typeof(channel.boards) == "undefined"){
                this.setState(() => ({
                    loading: true
                }));
                getBoards(channel.id).then((response) => {
                    if(typeof(response.data) != "undefined"){
                        this.setState(() => ({
                            boards: response.data,
                            loading: false
                        }));
                    }
                }).catch((error) => {
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
            }else{
                this.setState(() => ({
                    boards: channel.boards
                }));
            }
        }
        
    }

    onChange = (obj) => {

        const boards = this.state.boards.map((board) => {
            if(board.id === obj.id){
                return {
                    ...board,
                    selected: board.selected ? 0 : 1
                };
            }
            else{
                return {
                    ...board
                };
            }
        });

        this.setState(() => ({
            boards
        }), () => this.props.onChange(this.props.channel, boards));
    };

    render(){

        const {toggle} = this.props;
        const boards = this.state.boards;

        return (
            <div className="modal-content"> 
                <div className="modal-header">
                    <button type="button" id="closeModal" onClick={toggle} className="close fa fa-times-circle" data-dismiss="modal"></button>
                    <h4>Select Pinterest Boards</h4>
                </div>               
                <div className="modal-body scrollable-400">

                    {(!!boards.length) ?
                        
                        boards.map((board) => (
                                <label key={board.id} className="channel-item selection-container">
                                    <input type="checkbox" onChange={() => this.onChange(board)} defaultChecked={board.selected ? "checked" : ""} name="pinterest_board" />
                                    <span className="checkmark top-0"></span>
                                    {board.name}
                                </label>
                        )
                    ) : (this.state.loading ? <Loader/> : <div>Please make sure you have created at least one board on your pinterest account.</div>)}
                </div>
        
                <div className="modal-footer">
                    {!this.state.loading && 
                        <div onClick={toggle} className="publish-btn-group gradient-background-teal-blue link-cursor pull-right">
                            <button className="publish-btn naked-button">Done</button>
                        </div>
                    }

                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(undefined, mapDispatchToProps)(SelectPinterestBoards);