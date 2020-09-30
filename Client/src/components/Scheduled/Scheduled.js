import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import moment from 'moment';
import { notification } from 'antd';
import userflow from 'userflow.js';

import FunctionModal from '../Modal';
import { updateTimeZone } from '../../requests/profile';
import { setComposerModal, setPostAtBestTime, setPostCalendar } from '../../actions/composer';
import { isOwnerOrAdmin } from '../../utils/helpers';
import { unapprovedPosts } from '../../requests/channels';
import { setTimezone } from '../../actions/profile';

import ScheduledPosts from './Sections/ScheduledPosts';
import PostScheduling from './Sections/PostScheduling';
import TimezoneSelector from './components/TimezoneSelector';
import AwaitingApproval from './Sections/AwaitingApproval';
import AwaitingApprovalTabTitle from './components/AwaitingApprovalTabTitle';
import Loader from '../Loader';
import channelSelector from "../../selectors/channels";

const { TabPane } = Tabs;

class Scheduled extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'scheduled',
      selectedTimezone: !!props.timezone ? props.timezone : moment.tz.guess(),
      isLoading: false,
      accountsModal: false,
      awaitingApprovalPosts: [],
      awaitingLoading: false
    }
  }

  componentDidMount() {
    const { accessLevel, user: { id, name, email, created_at } } = this.props;
    if (isOwnerOrAdmin(accessLevel)) {
      this.getAwaitingPosts();
    }

    userflow.identify(id, {
      name,
      email,
      signed_up_at: created_at
    })
  }

  componentDidUpdate(prevProps) {
    // This is needed since the scheduled posts is the landing page and by the time
    // the component gets mounted the profile info is not available. This way, when
    // the profile state gets populated, we make sure to show the stored timezone
    if (prevProps.timezone !== this.props.timezone) {
      this.setState({ selectedTimezone: this.props.timezone });
    }
  }

  getAwaitingPosts = () => {
    const { page } = this.state;

    this.setState({ awaitingLoading: true });
    unapprovedPosts(page)
      .then(response => {
        this.setState({ awaitingApprovalPosts: response.items, awaitingLoading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ awaitingLoading: false });
      });
  };

  changeTimezone = (timezone) => {
    this.setState({ isLoading: true });
    updateTimeZone({ timezone })
      .then(() => {
        this.setState({ selectedTimezone: timezone, isLoading: false });
        this.props.setTimezone(timezone);
        notification.success({
          message: 'Done!',
          description: 'The timezone has been changed'
        });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
        FunctionModal({
          type: 'error',
          title: 'Error',
          content: 'Something went wrong when trying to change the timezone, please try again later.'
        });
      });
  }

  getTabExtraContent = () => {
    const { activeTab, selectedTimezone } = this.state;

    switch(activeTab) {
      case 'scheduled':
        return <TimezoneSelector value={selectedTimezone} onChange={this.changeTimezone} />;
    }
  };

  onNewPostClick = () => {
    this.props.setComposerModal(moment().format('YYYY-MM-DDTHH:mmZ'), this.state.selectedTimezone);
    this.props.setPostAtBestTime(true);
  };

  onTabChange = (key) => {
    if (key === 'awaiting') {
      this.getAwaitingPosts();
    }

    this.setState({ activeTab: key });
  };

  onBestPostClick = (e) => {
    if (e.target.id === "") {
      const date = moment().format('YYYY-MM-DDTHH:mm');
      const postTz = moment().tz(this.state.selectedTimezone).format('Z');
      this.props.setComposerModal(`${date}${postTz}`, this.state.selectedTimezone);
      this.props.setPostCalendar('Week');
    } else {
      const date = moment(e.target.id).format('YYYY-MM-DDTHH:mm');
      const postTz = moment().tz(this.state.selectedTimezone).format('Z');
      this.props.setComposerModal(`${date}${postTz}`, this.state.selectedTimezone);
      this.props.setPostCalendar('Day');
    }
    this.props.setPostAtBestTime(true);
  };

  render() {
    const {
      selectedTimezone,
      isLoading,
      activeTab,
      awaitingApprovalPosts,
      awaitingLoading
    } = this.state;
    const { accessLevel, user, selectedChannel } = this.props;

    return (
      <div className="scheduled">
        <div className="section-header no-border mb-40">
          <div className="section-header__first-row row posts">
            <div className="col-xs-12 col-md-8 ">
              <h2>Posts</h2>
            </div>
          </div>
        </div>
        <Tabs
          defaultActiveKey="scheduled"
          onChange={(key) => this.onTabChange(key)}
          tabBarExtraContent={this.getTabExtraContent()}
        >
          <TabPane tab="Post Queue" key="scheduled">
            {/* I needed a way to force the call that is made when the component gets mounted*/}
            { activeTab === 'scheduled' && (<ScheduledPosts
                timezone={selectedTimezone}
                selectedChannel={selectedChannel}
                onBestPostClick={this.onBestPostClick}
                onNewPostClick={this.onNewPostClick}
                />
              )
            }
          </TabPane>
          {
            isOwnerOrAdmin(accessLevel) && (
              <TabPane
                tab={<AwaitingApprovalTabTitle amountOfPendingPosts={awaitingApprovalPosts.length}/>}
                key="awaiting"
              >
                <AwaitingApproval
                  timezone={selectedTimezone}
                  pendingPosts={awaitingApprovalPosts}
                  getAwaitingPosts={this.getAwaitingPosts}
                />
              </TabPane>
            )
          }
          <TabPane tab="Schedule Settings" key="schedule settings">
            {/* I needed a way to force the call that is made when the component gets mounted*/}
            { activeTab === 'schedule settings' && <PostScheduling timezone={selectedTimezone} name={user.name} /> }
          </TabPane>
        </Tabs>
        { (isLoading || awaitingLoading) && <Loader fullscreen /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { profile: { user, accessLevel } = {} } = state;
  const selectedGlobalChannel = { selected: 1, provider: undefined };

  const selectedChannel = channelSelector(state.channels.list, selectedGlobalChannel);

  return {
    timezone: user.timezone,
    accessLevel: accessLevel,
    user,
    selectedChannel: selectedChannel.length ? selectedChannel[0] : {},
  };
};

export default connect(
  mapStateToProps,
  {
    setComposerModal,
    setTimezone,
    setPostAtBestTime,
    setPostCalendar
  }
)(Scheduled);
