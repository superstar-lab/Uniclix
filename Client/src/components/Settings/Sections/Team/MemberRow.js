import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { notification } from 'antd';

import { removeMember } from '../../../../requests/team';

import FunctionModal from '../../../Modal';

class MemberRow extends React.Component {
  static propTypes = {
    member: PropTypes.object.isRequired,
    refreshMembers: PropTypes.func.isRequired,
    editMember: PropTypes.func.isRequired
  };

  onDelete = () => {
    FunctionModal({
      type: 'confirm',
      title: 'Are you sure you want to delete this member?',
      content: 'The data and permissions related to this member will be erased',
      onOk: this.deleteMember
    });
  };

  deleteMember = () => {
    const { refreshMembers, member: { team_id, member_id } } = this.props;
    
    removeMember({
      teamId: team_id,
      memberId: member_id
    }).then(() => {
      notification.success({
        title: 'Success!',
        message: 'The member was successfully erased!'
      });
      refreshMembers();
    })
    .catch((error) => {
      console.log(error);
      FunctionModal({
        type: 'error',
        title: 'Error',
        content: 'Something went wrong when trying to delete the member, please try again later.'
      })
    })
  };

  onEditMember = () => {
    const { editMember, member } = this.props;

    editMember(member);
  }

  render() {
    const { member } = this.props;
    const createdAt = moment(member.created_at);

    return (
      <div className="team-member-row">
        <div className="left-section">
          <div className="name">
            { member.details.name }
          </div>
          <div className="email">
            { member.details.email }
          </div>
        </div>
        <div className="middle-section">
          <div className="managing">Managing</div>
          <div className="channels-row">
            {
              member.assignedChannels.map(({type, avatar}, index) => (
                <div key={`${type}-${index}`} className="channel-avatar">
                  <img src={avatar} />
                  <i className={`fab fa-${type} ${type}_bg icon`} />
                </div>
              ))
            }
          </div>
        </div>
        <div className="right-section">
          <div className="created-at">
            { `added ${ createdAt.format('MM/DD/YY') }` }
          </div>
          <div className="role">
            { member.is_admin ? 'Admin' : 'Member' }
          </div>
          <div className="edit-member" onClick={this.onEditMember}>
            <div className="svg-container">
              <i class="fas fa-user-edit" aria-hidden="true"></i>
            </div>
            <div className="action-label">Edit</div>
          </div>
          <div className="delete-member" onClick={this.onDelete}>
            <div className="svg-container">
              <i class="fas fa-user-slash" aria-hidden="true"></i>
            </div>
            <div className="action-label">Delete</div>
          </div>
        </div>
      </div>
    );
  }

}

export default MemberRow;
