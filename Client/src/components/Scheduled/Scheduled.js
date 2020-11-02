import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import moment from 'moment';
import { notification, Button } from 'antd';
import userflow from 'userflow.js';
import Modal from 'react-modal';

import FunctionModal from '../Modal';
import { updateTimeZone } from '../../requests/profile';
import { setComposerModal, setPostAtBestTime, setPostCalendar } from '../../actions/composer';
import { isOwnerOrAdmin } from '../../utils/helpers';
import { unapprovedPosts } from '../../requests/channels';
import { setTimezone } from '../../actions/profile';
import channelSelector from "../../selectors/channels";

import ScheduledPosts from './Sections/ScheduledPosts';
import PostScheduling from './Sections/PostScheduling';
import TimezoneSelector from './components/TimezoneSelector';
import AwaitingApproval from './Sections/AwaitingApproval';
import AwaitingApprovalTabTitle from './components/AwaitingApprovalTabTitle';
import Loader from '../Loader';
import TourWizard from '../TourWizard';

const { TabPane } = Tabs;

const tourWizardConfig = [
  {
    target: '.new-post.step-1',
    title: 'Create a new post',
    message: 'Do you want to create a post right away? Start by clicking on "what\'s on yout mind" section',
    imageLocation: '../images/alone.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.infinite-scroll-component > div:first-child',
    title: 'Schedule a post',
    message: 'Do you want to schedule a post? Click on the desired time slot to start scheduling your post. (Don\'t worry, you can set up your preferred slots from the settings section).',
    imageLocation: '../images/alone.svg',
    cardPosition: 'bottom-left'
  },
  {
    target: '.display-by.step-3',
    title: 'Switch to calendar view',
    message: 'You can change the layout to what\'s best for you, and display your scheduled posts by day, week or month.',
    imageLocation: '../images/alone.svg',
    cardPosition: 'bottom-right',
    offsetPosition: 70
  },
  {
    target: '.ant-tabs-nav.ant-tabs-nav-animated > div > div:nth-child(3)',
    title: 'Schedule settings',
    message: 'You can configure your preferred posting times from the schedule settings tad. Add, edit or delete your time slots from here.',
    imageLocation: '../images/alone.svg',
    cardPosition: 'bottom-left',
    offsetPosition: 70
  }
];

const tutorialFinalMsg = {
  image: '../images/alone.svg',
  title: 'That\s all!',
  message: 'Now you know how to manage your posts easily. What will you share next?',
  buttonLabel: 'Got it!'
};

class Scheduled extends React.Component {

  constructor(props) {
    super(props);

    const {
      location: {
        state: { comingFromOnBoarding } = { comingFromOnBoarding: false }
      }
    } = this.props;

    this.state = {
      activeTab: 'scheduled',
      selectedTimezone: !!props.timezone ? props.timezone : moment.tz.guess(),
      isLoading: false,
      accountsModal: false,
      awaitingApprovalPosts: [],
      awaitingLoading: false,
      tourModalOpen: comingFromOnBoarding,
      showTour: false
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

  closeTourModal = () => {
    this.setState({ tourModalOpen: false });
  }

  startTour = () => {
    this.setState({ tourModalOpen: false, showTour: true });
  }

  render() {
    const {
      selectedTimezone,
      isLoading,
      activeTab,
      awaitingApprovalPosts,
      awaitingLoading,
      tourModalOpen,
      showTour
    } = this.state;
    const { accessLevel, user, selectedChannel } = this.props;

    return (
      <div className="scheduled">
        <Modal
          isOpen={tourModalOpen}
          className="tour-modal"
        >
          <div className="tour-container">
            <div className="close-icon fa fa-times" onClick={this.closeTourModal}></div>
            <div className="picture">
              <img src="/images/welcome-tour.svg" />
            </div>
            <div className="content">
              <div className="tour-title">
                Welcome to your 14-day Uniclix Basic trial!
              </div>
              <div className="list">
                <ul>
                  <li>Connect your social accounts</li>
                  <li>Schedule unlimited posts</li>
                  <li>Get a calendar view of you social media schedule</li>
                  <li>And much more!</li>
                </ul>
              </div>
              <Button
                onClick={this.startTour}
                className="continue"
                type="primary"
                shape="round"
                size="large"
              >
                Start Exploring
              </Button>
            </div>
          </div>
        </Modal>
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
                startTour={this.startTour}
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
        {
          showTour && <TourWizard
            steps={tourWizardConfig}
            generalClassName={'schedule-posts'}
            closeTutorial={() => this.setState({ showTour: false })}
            finalMessage={tutorialFinalMsg}
          />
        }
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
