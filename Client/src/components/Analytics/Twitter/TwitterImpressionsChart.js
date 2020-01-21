import React from 'react';

import { pageInsightsByType } from '../../../requests/twitter/channels';
import SimpleAreaChart from '../SimpleAreaChart';

const data = [
  {
    name: 'Page A', Impressions: 30
  },
  {
    name: 'Page B', Impressions: 10
  },
  {
    name: 'Page C', Impressions: 15
  },
  {
    name: 'Page D', Impressions: 2
  },
  {
    name: 'Page E', Impressions: 13
  },
  {
    name: 'Page F', Impressions: 45
  },
  {
    name: 'Page G', Impressions: 32
  },
];

class TweeterImpressionsChart extends React.Component {
  state = {
    isLoading: false,
    data: []
  };

  fetchAnalyticsData = () => {
    this.setState(() => ({isLoading: true}));
    pageInsightsByType(this.props.accountId, null, null, 'impressionsChartData')
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
    return <SimpleAreaChart data={data} dataKey="Impressions" />;
  }
}

export default TweeterImpressionsChart;
