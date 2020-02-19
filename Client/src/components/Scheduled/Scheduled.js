import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import ScheduledPosts from './Sections/ScheduledPosts';
import TimezoneSelector from './components/TimezoneSelector';

const { TabPane } = Tabs;

class ScheduledPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'scheduled',
      selectedTimezone: props.profile.user.timezone
    }
  }

  changeTimezone = (value) => {
    this.setState({ selectedTimezone: value });
  }

  getTabExtraContent = () => {
    const { activeTab, selectedTimezone } = this.state;

    switch(activeTab) {
      case 'scheduled':
        return <TimezoneSelector value={selectedTimezone} onChange={this.changeTimezone} />;
    }
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
  return {
    profile: state.profile
  };
};

export default connect(mapStateToProps)(ScheduledPage);
