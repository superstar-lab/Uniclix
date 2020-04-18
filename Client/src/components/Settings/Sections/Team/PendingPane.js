import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class PendingPane extends React.Component {
  static propTypes = {
    pendingMembers: PropTypes.array.isRequired
  };

  render() {
    const { pendingMembers } = this.props;

    return pendingMembers.length ? (
      pendingMembers.map( member => {
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
            </div>
          </div>
        );
      })
    ) : (
      <div className="no-pendings">
        <img src="/images/alone.svg" />
        <div className="text">You are all set! There are no pending members at this time.</div>
      </div>
    );
  }
}

export default PendingPane;
