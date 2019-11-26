import React from 'react';

class TeamMember extends React.Component {

    remove = () => {
        const { member } = this.props;
        this.props.remove(true, member);
    };

    update = () => {
        const { member } = this.props;
        this.props.update(true, member);
    };


    render() {
        const { member } = this.props;
        console.log('mem', member)
        return (
            <div>
                {member.assignedChannels[0].active === 1 
                ?
                <div className="twitter-middleware-btn added-channel-btn">
                    <div className="block-urls2">
                        <div className="profile-info account-info pull-right">
                            <div className="channel-profile-info">
                                <img className="pull-left" onError={(e) => e.target.src = '/images/dummy_profile.png'} src={member.assignedChannels[0].avatar} />
                                <div>
                                    <p className="profile-name acc-name">{member.details.name}  <span className="profile-state"></span></p>
                                    <p className="profile-username">{member.details.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="user-action mrnone blue-icon" onClick={() => setAction({ id: member.id, type: "delete" })}><i className="fa fa-trash"></i></div> */}
                    <div className="item-actions pull-right">
                        <div className="team-info">
                            <div className="row">
                                <div className="col-md-6">
                                    {/* <p>added {member.created_at}</p> */}
                                    <p>added 12/05/2018</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="profile-title">{member.is_admin ? "Admin" : "Member"}</p>
                                    <p>Role</p>
                                </div>
                            </div>
                        </div>
                        {/* <ul className="v-center-align">
                            <li className="text-links">
                                <a href="javascript:void(0);" onClick={this.update} className="link-cursor">Edit</a>
                            </li>
                            <li className="text-links">
                                <a href="javascript:void(0);" onClick={this.remove} className="link-cursor">Remove</a>
                            </li>
                        </ul> */}
                    </div>
                </div>
                :
                <div>
                    <p>You dont have an active account</p>
                </div>
                }
            </div>
        );

            {/* <div className="clear-both">
            
                <div className="item-row">

                    <div>
                        <div className="profile-info pull-left">
                        <img className="pull-left" onError={(e) => e.target.src = '/images/dummy_profile.png'} src={channel.avatar} />
                            <div className="">
                                <p className="profile-name">{member.details.name}</p>
                                <span className="profile-username lowercase"> {member.details.email}</span>
                            </div>

                        </div>
                    </div>

                    <div className="item-actions pull-right">
                    <p className="profile-title">{member.is_admin ? "Admin" : "Member"}</p>

                        <ul className="v-center-align">
                            <li className="text-links">
                                <a href="javascript:void(0);" onClick={this.update} className="link-cursor">Edit</a>
                            </li>
                            <li className="text-links">
                                <a href="javascript:void(0);" onClick={this.remove} className="link-cursor">Remove</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> */}
    }
}

export default TeamMember;