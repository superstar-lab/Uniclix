import React from 'react';
import PropTypes from 'prop-types';

import AddMemberModal from './AddMemberModal';
import MemberRow from './MemberRow';

class ActivePane extends React.Component {

  static propTypes = {
    members: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    fetchActiveMembers: PropTypes.func.isRequired,
    refreshMembers: PropTypes.func.isRequired
  };

  state = {
    isAddModalOpen: false,
    memberToEdit: null
  };

  toggleModal = () => {
    this.setState({ isAddModalOpen: !this.state.isAddModalOpen, memberToEdit: null });
  }

  editMember = (member) => {
    this.setState({ isAddModalOpen: true, memberToEdit: member });
  }

  render() {
    const { teams, members, fetchActiveMembers, refreshMembers } = this.props;
    const { isAddModalOpen, memberToEdit } = this.state;

    return (
      <div>
        {
          members.map(member => (
            <MemberRow
              member={member}
              refreshMembers={refreshMembers}
              editMember={this.editMember}
            />
          ))
        }
        <button onClick={this.toggleModal} className="add-button">
          <div className="add-channel-plus-btn">
              <i className="fa fa-plus"></i>
          </div>
          <span className="btn-label">Add New Team Member</span>
        </button>
        <AddMemberModal
          isOpen={isAddModalOpen}
          toggleModal={this.toggleModal}
          teamId={teams.length ? teams[0].id : 0}
          refreshMembers={refreshMembers}
          editMember={memberToEdit}
        />
      </div>
    );
  }
}

export default ActivePane;
