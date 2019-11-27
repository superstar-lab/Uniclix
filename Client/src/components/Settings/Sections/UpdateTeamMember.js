import React from 'react';
import { connect } from "react-redux";
import Modal from 'react-modal';
import { publishChannels } from '../../../selectors/channels';
import { validateEmail } from "../../../utils/validator";
import SelectChannelsModal from "../../SelectChannelsModal";
import { LoaderWithOverlay } from "../../Loader";
import { updateTeamMember } from '../../../requests/team';

class UpdateTeamMember extends React.Component {

    state = {
        name: !!this.props.member ? this.props.member.details.name : "",
        email: !!this.props.member ? this.props.member.details.email : "",
        admin: !!this.props.member ? this.props.member.is_admin : "",
        publishChannels: !!this.props.member && this.props.member.assignedChannels.length > 0 ? this.props.member.assignedChannels : this.props.channels,
        assignedChannels: !!this.props.member && this.props.member.assignedChannels.length > 0 ? this.props.member.assignedChannels : [],
        assignedApprover: "",
        selectChannelsModal: false,
        teamId: this.props.teamId,
        loading: false,
        error: false,
        success: false
    };


    componentDidMount() {
        const memberChannels = !!this.props.member && this.props.member.assignedChannels.length > 0 ? this.props.member.assignedChannels : [];

        const publishChannels = this.props.channels.map(channel => {
            channel.selected = 0;
            return Object.assign(channel, memberChannels.find(channel2 => {
                return channel2 && channel.id === channel2.id
            }))
        });

        this.setState(() => ({
            publishChannels
        }), () => this.setAssignedChannels());
    }

    onFieldChange = (e) => {
        const id = e.target.id;
        let state = Object.assign({}, this.state);
        state[id] = e.target.value;
        this.setState(() => (state));
    };

    toggleAdmin = () => {
        this.setState(() => ({
            admin: !this.state.admin
        }));
    };
    setRole = (e) => {
        let adminValue = e.target.value;
        this.setState(() => ({
            admin: adminValue
        }));
    };

    onChannelSelectionChange = (obj) => {
        const selectedPinterestChannel = !obj.selected && obj.type == "pinterest" ? obj : false;

        const publishChannels = this.state.publishChannels.map((channel) => {
            if (channel.id === obj.id) {
                return {
                    ...channel,
                    selected: channel.selected ? 0 : 1
                }
            }

            return {
                ...channel
            };
        });

        this.setState(() => ({
            publishChannels,
            selectedPinterestChannel
        }), () => this.setAssignedChannels());
    };

    setAssignedChannels = () => {
        const assignedChannels = this.state.publishChannels.filter(channel => channel.selected === 1)
            .map(channel => ({ ...channel, permissionLevel: channel.permissionLevel ? channel.permissionLevel : "member" }));

        this.setState(() => ({
            assignedChannels
        }));
    };

    setPermissionLevel = (e, channelId) => {
        const assignedChannels = this.state.assignedChannels.map(channel => {
            if (channel.id === channelId) {
                return {
                    ...channel,
                    permissionLevel: e.target.value
                }
            }

            return {
                ...channel
            }
        });

        this.setState(() => ({
            assignedChannels
        }));
    };

    toggleSelectChannelsModal = () => {

        this.setState(() => ({
            selectChannelsModal: !this.state.selectChannelsModal
        }));
    };

    onSubmit = () => {
        this.setState(() => ({ loading: true }));
        if (!validateEmail(this.state.email) || this.state.email === "") {
            this.setState(() => ({
                error: "Email is not right.",
                loading: false
            }));

            return;
        }

        if (this.state.name === "") {
            this.setState(() => ({
                error: "Name cannot be empty.",
                loading: false
            }));

            return;
        }

        if (this.state.assignedChannels.length < 1) {
            this.setState(() => ({
                error: "You need to assign at least one social account.",
                loading: false
            }));

            return;
        }

        const data = {
            name: this.state.name,
            email: this.state.email,
            admin: this.state.admin,
            assignedChannels: this.state.assignedChannels,
            teamId: this.state.teamId
        };

        updateTeamMember(data).then(response => {
            this.setState(() => ({ loading: false }));
            this.props.fetchMembers();
            this.props.close();
        }).catch(e => {
            this.setState(() => ({ loading: false }));
            if (typeof e.response !== "undefined" && typeof e.response.data.error !== "undefined") {
                this.setState(() => ({
                    error: e.response.data.error
                }));
                return;
            }
        });
    };

    render() {
        return (
            <div className="main-modal-style">
                <Modal isOpen={this.state.selectChannelsModal} closeTimeoutMS={300} ariaHideApp={false} className="flex-center modal-no-radius no-outline">
                    <SelectChannelsModal
                        channels={this.state.publishChannels}
                        onChange={this.onChannelSelectionChange}
                        toggle={this.toggleSelectChannelsModal}
                        twitterSelectType="checkbox"
                        toggleComposer={this.props.close}
                    />
                </Modal>

                <div className="modal-header-container">
                    <h3>Add new team member</h3>
                </div>

                {this.state.loading && <LoaderWithOverlay />}

                <div className="modal-body">
                    {this.state.error &&
                        <div className="alert alert-danger">{this.state.error}</div>
                    }

                    {this.state.success &&
                        <div className="alert alert-success">{this.state.success}</div>
                    }

                    <div className="profile-form">
                        <div className="team-form scrollbar">

                            <div className="col-6 col-md-6 form-field">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" onChange={(e) => this.onFieldChange(e)} id="name" value={this.state.name} placeholder="John Doe" />
                            </div>

                            <div className="col-6 col-md-6 form-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" onChange={(e) => this.onFieldChange(e)} value={this.state.email} placeholder="johndoe@example.com" />
                            </div>
                        </div>

                        <div className="clearer">
                            <div className="col-6 col-md-6">
                                <select type="text" value={this.state.admin}  onChange={(e) => this.setRole(e)} name="admin" className="" id="admin">
                                    <option selected value="null">Select Role</option>
                                    <option value="false">Menager</option>
                                    <option value="true">Admin</option>
                                </select>

                                {/* <div className="custom-control custom-switch">
                                    {
                                        !!this.state.admin ?
                                            <input type="checkbox" onChange={this.toggleAdmin} value={this.state.admin} className="custom-control-input" id="admin" checked />
                                            :
                                            <input type="checkbox" onChange={this.toggleAdmin} value={this.state.admin} className="custom-control-input" id="admin" />
                                    }

                                    <label className="custom-control-label" htmlFor="admin">&nbsp;Make Admin</label>
                                </div> */}
                            </div>
                        </div>

                        <div className="seperator"></div>

                        <div className="form-group">

                            <div className="mb20 clearer">
                                <button onClick={this.toggleSelectChannelsModal} className="default-white-btn pull-right" ><span className="cus-plus-icon">+</span>Select Social Accounts</button>
                            </div>

                            <div className="clearer team-form scrollbar">

                                {!!this.state.assignedChannels.length && <div>

                                    <div className="col-6 col-md-6 mb15">

                                        <label className="bolden">Assign Social Account</label>

                                    </div>


                                    <div className="col-6 col-md-6 mb15">

                                        <label className="bolden">Permission Level</label>

                                    </div>

                                </div>}

                                {this.state.assignedChannels.map((channel, index) => (
                                    <div key={index}>
                                        <div className="col-6 col-md-6 form-field">

                                            <input type="text" value={`${channel.name} - ${channel.type}`} className="form-control whiteBg" onClick={this.toggleSelectChannelsModal} readOnly id={`channel-${channel.id}`} placeholder="Name of the social account" />
                                        </div>

                                        <div className="col-6 col-md-6 form-field">

                                            <select id={`permission-${channel.id}`} onChange={(e) => this.setPermissionLevel(e, channel.id)} value={channel.permissionLevel} className="form-control">
                                                <option value="member">Approval Required</option>
                                                <option value="publisher">Publisher</option>
                                            </select>
                                        </div>
                                    </div>))}
                            </div>


                        </div>
                    </div>

                    <div className="modal-footer">
                        <div>
                            <button className="magento-btn small-btn pull-right" onClick={this.onSubmit}>Submit</button>
                            <button onClick={this.props.close} className="btn btn-link pull-right">Cancel</button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    const channels = publishChannels(state.channels.list);
    return {
        channels
    };
};

export default connect(mapStateToProps)(UpdateTeamMember);