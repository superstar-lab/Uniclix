import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import moment from 'moment';
import { notification } from 'antd';

import FunctionModal from '../Modal';
import { updateTimeZone } from '../../requests/profile';
import { setComposerModal } from '../../actions/composer';
import { isOwnerOrAdmin } from '../../utils/helpers';

import ScheduledPosts from './Sections/ScheduledPosts';
import TimezoneSelector from './components/TimezoneSelector';
import AwaitingApproval from './Sections/AwaitingApproval';
import Loader from '../Loader';
import Modal from 'react-modal';

const { TabPane } = Tabs;

class Scheduled extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'scheduled',
      selectedTimezone: !!props.timezone ? props.timezone : moment.tz.guess(),
      isLoading: false,
      accountsModal: false,
      message: ''
    }
  }

  componentDidUpdate(prevProps) {
    // This is needed since the scheduled posts is the landing page and by the time
    // the component gets mounted the profile info is not available. This way, when
    // the profile state gets populated, we make sure to show the stored timezone
    if (prevProps.timezone !== this.props.timezone) {
      this.setState({ selectedTimezone: this.props.timezone });
    }
  }

  componentWillMount() {
    if(this.props.main_profile.remain_date <= 0 && this.props.main_profile.subscription.activeSubscription == false){
      this.setState({
        accountsModal: true,
        message: 'Your free trial has expired, please upgrade.'
      });
    }
  }

  changeTimezone = (timezone) => {
    this.setState({ isLoading: true });
    updateTimeZone({ timezone })
      .then(() => {
        this.setState({ selectedTimezone: timezone, isLoading: false });
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
  };

  render() {
    const { selectedTimezone, isLoading, accountsModal, message } = this.state;
    const { accessLevel } = this.props;

    return (
      <div className="scheduled">
        {!!accountsModal && 
          <Modal
          ariaHideApp={false}
          className="billing-profile-modal"
          isOpen={!!accountsModal}
          >
              <div className="modal-title">{`Attention`}</div>
              <div className="modal-content1">{message}</div>
              <div style={{float:'right'}}>
                  <button onClick={() => this.setState({accountsModal: false})} className="cancelBtn" >No</button>
                  <a href="/settings/billing" className="cancelBtn1" >Yes</a>
              </div>
          </Modal>
        }
        <div className="section-header no-border mb-40">
          <div className="section-header__first-row row">
            <div className="col-xs-12 col-md-8 ">
              <h2>Posts</h2>
            </div>
            <div className="col-xs-12 col-md-4">
              <button
                  className="magento-btn pull-right"
                  onClick={this.onNewPostClick}
              >
                  New Post
              </button>
            </div>
          </div>
        </div>
        <Tabs
          defaultActiveKey="scheduled"
          onChange={(key) => this.setState({ activeTab: key })}
          tabBarExtraContent={this.getTabExtraContent()}
        >
          <TabPane tab="Scheduled" key="scheduled">
            <ScheduledPosts timezone={selectedTimezone} />
          </TabPane>
          {
            isOwnerOrAdmin(accessLevel) && (
              <TabPane tab="Awaiting Approval" key="awaiting">
                <AwaitingApproval timezone={selectedTimezone} />
              </TabPane>
            )
          }
        </Tabs>
        { isLoading && <Loader fullscreen /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { profile: { user: { timezone }, accessLevel } = {} } = state;
  const main_profile = state.profile;
  return {
    timezone,
    main_profile,
    accessLevel
  };
};

export default connect(mapStateToProps, { setComposerModal })(Scheduled);
