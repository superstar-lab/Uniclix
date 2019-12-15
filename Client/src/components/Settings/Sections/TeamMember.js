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
        let created_at_date = member.created_at;
        created_at_date = created_at_date.split(' ')[0];
        created_at_date = created_at_date.split("-").reverse().join("-");
        return (
            <div>
                <div className="twitter-middleware-btn added-channel-btn">
                    <div className="block-urls2">
                        <div className="profile-info account-info pull-right h65">
                            <div className="channel-profile-info">
                                <img className="pull-left" onError={(e) => e.target.src = '/images/dummy_profile.png'} src={member.assignedChannels[0].avatar} />
                                <div>
                                    <p className="profile-name acc-name">{member.details.name}  <span className="profile-state"></span></p>
                                    <p className="profile-email">{member.details.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="item-actions pull-right w50 h50">
                        <div className="team-info">
                            <ul>
                                <li>
                                    <p className="date-team">added {created_at_date}</p>
                                </li>
                                <li>
                                    <p className="profile-title">{member.is_admin ? "Admin" : "Member"}</p>
                                    <p>Role</p>
                                </li>
                            </ul>
                        </div>
                        <div className="team-info-hover pull-right">
                            <div className="user-action mrnone blue-icon">
                                <div onClick={this.update}><i class="fas fa-user-edit"></i></div>
                                <div onClick={this.remove}>
                                    <i className="fas fa-user-slash" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TeamMember;