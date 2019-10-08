import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import {validateEmail} from "../utils/validator";
import {updateProfile} from "../requests/profile";
import {startSetProfile} from "../actions/profile";

class EmailChecker extends React.Component{

    state = {
        email: "",
        error: false,
        open: false
    };

    componentDidMount(){
        const profile = this.props.profile;
        if(profile){
            if(!profile.user.email){
                this.setState(() => ({
                    open: !this.state.open
                }));
            }
        }
    }

    componentDidUpdate(prevProps){
        if((prevProps.profile != this.props.profile) && !!this.props.profile){
            if(!this.props.profile.user.email){
                this.setState(() => ({
                    open: !this.state.open
                }));
            }
        }
    }

    onChange = (e) => {
        const email = e.target.value;

        this.setState(() => ({
            email
        }));
    };

    addEmail = (e) => {
        e.preventDefault();

        this.setState(() => ({
            error: false
        }));

        if(!validateEmail(this.state.email) || this.state.email === ""){
            this.setState(() => ({
                error: "Please fix the email!"
            }));

            return;
        }

        updateProfile({
            email: this.state.email
        }).then((response) => {
            this.props.startSetProfile();
            this.setState(() => ({
                open: !this.state.open
            }));
        }).catch((error) => {
            console.log(error);
            this.setState(() => ({
                error: "Something went wrong."
            }));
        });
    };

    render(){
        return (
            <div>
                <Modal
                isOpen={this.state.open}
                ariaHideApp={false}
                >       
                    <form onSubmit={(e) => this.addEmail(e)}>  
                        <div className="form-group flex_container-center">
                            <div>
                                <h3>We are almost done!</h3>
                                <br/><br/>
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" value={this.state.email} onChange={(e) => this.onChange(e)} placeholder="john@example.com" className="form-control" />
                            </div>
                        </div>
                        <div className="center-inline top-border p10 m10-top">
                        {this.state.error && 
                            <div className="alert alert-danger">{this.state.error}</div>
                        }
                            <button className="upgrade-btn">Save</button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    profile: state.profile
});

const mapDispatchToProps = (dispatch) => ({
    startSetProfile: () => dispatch(startSetProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(EmailChecker);