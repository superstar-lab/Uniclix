import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import moment from 'moment';

import { updateTimeZone } from '../../requests/profile';
import { setComposerModal } from '../../actions/composer';

import ScheduledPosts from './Sections/ScheduledPosts';
import TimezoneSelector from './components/TimezoneSelector';

const { TabPane } = Tabs;

class Scheduled extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'scheduled',
      selectedTimezone: props.timezone ? props.timezone : moment.tz.guess()
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

  changeTimezone = (timezone) => {
    updateTimeZone({ timezone })
      .then(() => {
        this.setState({ selectedTimezone: timezone });
      })
      .catch((error) => {
        console.log(error);
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
    const { selectedTimezone } = this.state;

    return (
      <div className="scheduled">
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
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { profile: { user: { timezone } } = {} } = state;

  return {
    timezone
  };
};

export default connect(mapStateToProps, { setComposerModal })(Scheduled);
