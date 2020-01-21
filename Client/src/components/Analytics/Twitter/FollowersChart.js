import React from 'react';

import { pageInsightsByType } from '../../../requests/twitter/channels';
import SimpleAreaChart from '../SimpleAreaChart';

const data = [
  {
    name: 'Page A', Followers: 30
  },
  {
    name: 'Page B', Followers: 10
  },
  {
    name: 'Page C', Followers: 15
  },
  {
    name: 'Page D', Followers: 2
  },
  {
    name: 'Page E', Followers: 13
  },
  {
    name: 'Page F', Followers: 45
  },
  {
    name: 'Page G', Followers: 32
  },
];

class TweetsChart extends React.Component {
  state = {
    isLoading: false,
    data: []
  };

  fetchAnalyticsData = () => {
    this.setState(() => ({isLoading: true}));
    pageInsightsByType(this.props.accountId, null, null, 'followersChartData')
      .then((response) => {
        console.log(response, startDate);
      })
      .catch(() => {
        this.setState(() => ({isLoading: false}));
      });
  }

  // componentDidMount() {
  //   this.fetchAnalyticsData();
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.period !== prevProps.period) {
  //     this.getAnalyticsData();
  //   }
  // }

  render() {
    return <SimpleAreaChart data={data} dataKey="Followers" />;
  }
}

export default TweetsChart;
