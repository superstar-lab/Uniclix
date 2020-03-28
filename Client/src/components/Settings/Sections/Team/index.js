import React from 'react';
import { Tabs } from 'antd';

import { getTeamMembers, getTeams, getPendingMembers } from '../../../../requests/team';

import FunctionModal from '../../../Modal';
import Loader from '../../../Loader';
import ActivePane from './ActivePane';
import PendingPane from './PendingPane';

const { TabPane } = Tabs;

class Team extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIsLoading: false,
      teamsIsLoading: false,
      pendingIsLoading: false,
      activeMembers: [],
      pendingMembers: [],
      teams: []
    };
  }

  componentDidMount() {
    this.fetchTeams();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.teams.length && this.state.teams.length) {
      this.fetchActiveMembers();
      this.fetchPendingMembers();
    }
  }

  fetchTeams() {
    this.setState({ teamsIsLoading: true });
    getTeams()
      .then(response => {
        this.setState({
          teamsIsLoading: false,
          teams: response
        })
      })
      .catch(() => {
        this.setState({ activeIsLoading: false });
        FunctionModal({
          type: 'error',
          title: 'Error',
          content: 'There was a problem trying to get your teams. Please reload the page.'
        });
      });
  }

  fetchActiveMembers = () => {
    const { teams } = this.state;
    this.setState({ activeIsLoading: true });
    getTeamMembers(teams[0].id)
      .then(response => {
        this.setState({
          activeMembers: response,
          activeIsLoading: false
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ activeIsLoading: false });
        FunctionModal({
          type: 'error',
          title: 'Error',
          content: 'There was a problem trying to get the active members. Please reload the page.'
        });
      });
  }

  fetchPendingMembers = () => {
    const { teams } = this.state;
    this.setState({ pendingIsLoading: true });
    getPendingMembers(teams[0].id)
      .then(response => {
        this.setState({
          pendingMembers: response,
          pendingIsLoading: false
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ activeIsLoading: false });
        FunctionModal({
          type: 'error',
          title: 'Error',
          content: 'There was a problem trying to get the pending members. Please reload the page.'
        });
      });
  }

  refreshMembers = () => {
    this.fetchActiveMembers();
    this.fetchPendingMembers();
  }

  render() {
    const {
      activeIsLoading,
      pendingIsLoading,
      teamsIsLoading,
      activeMembers,
      pendingMembers,
      teams
    } = this.state;

    return (
      <div className="settings-team">
        <h3>Team</h3>
        <Tabs defaultActiveKey="active">
          <TabPane tab="Active" key="active">
            <ActivePane
              members={activeMembers}
              teams={teams}
              fetchActiveMembers={this.fetchActiveMembers}
              refreshMembers={this.refreshMembers}
            />
          </TabPane>
          <TabPane tab="Pending" key="pending">
            <PendingPane
              pendingMembers={pendingMembers}
            />
          </TabPane>
        </Tabs>
        { (teamsIsLoading || activeIsLoading || pendingIsLoading) && <Loader fullscreen/> }
      </div>
    );
  }
};

export default Team;
