import React from 'react';
import { Tabs } from 'antd';

import { getTeamMembers, getTeams } from '../../../../requests/team';

import FunctionModal from '../../../Modal';
import Loader from '../../../Loader';
import ActivePane from './ActivePane';

const { TabPane } = Tabs;

class Team extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIsLoading: false,
      teamsIsLoading: false,
      activeMembers: [],
      teams: []
    };
  }

  componentDidMount() {
    this.fetchTeams();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.teams.length && this.state.teams.length) {
      this.fetchActiveMembers();
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

  render() {
    const { activeIsLoading, activeMembers, teams } = this.state;

    return (
      <div className="settings-team">
        <h3>Team</h3>
        <Tabs defaultActiveKey="active">
          <TabPane tab="Active" key="active">
            <ActivePane
              members={activeMembers}
              teams={teams}
              fetchActiveMembers={this.fetchActiveMembers}
            />
          </TabPane>
        </Tabs>
        { activeIsLoading && <Loader fullscreen/> }
      </div>
    );
  }
};

export default Team;
