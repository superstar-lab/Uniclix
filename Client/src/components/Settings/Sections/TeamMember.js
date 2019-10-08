import React from 'react';

class TeamMember extends React.Component{

    remove = () => {
        const {member} = this.props;
        this.props.remove(true, member);
    };

    update = () => {
        const {member} = this.props;
        this.props.update(true, member);
    };


    render(){
        const {member} = this.props;
        return (
            <div className="clear-both">
            
                <div className="item-row">

                    <div>
                        <div className="profile-info pull-left">
                            
                            <div className="pull-left">
                                <p className="profile-name">{member.details.name}<span className="profile-username lowercase"> {member.details.email}</span></p>
                                <p className="profile-title">{member.is_admin ? "Admin" : "Member"}</p>
                            </div>

                        </div>
                    </div>

                    <div className="item-actions pull-right">

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
        
            </div>
        );
    }
}

export default TeamMember;