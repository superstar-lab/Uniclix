import React from 'react';

import { pageInsightsByType } from '../../../requests/twitter/channels';
import EngagementsChart from '../EngagementsChart';

const data = [
  {
    name: 'Page A', Reactions: 12, Comments: 20, Shares: 4
  },
  {
    name: 'Page B', Reactions: 10, Comments: 3, Shares: 1
  },
  {
    name: 'Page C', Reactions: 3, Comments: 8, Shares: 4
  },
  {
    name: 'Page D', Reactions: 22, Comments: 10, Shares: 15
  },
  {
    name: 'Page E', Reactions: 1, Comments: 5, Shares: 0
  },
  {
    name: 'Page F', Reactions: 6, Comments: 4, Shares: 3
  },
  {
    name: 'Page G', Reactions: 11, Comments: 9, Shares: 6
  },
];

class TwitterEngagementsChart extends React.Component {
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
    return <EngagementsChart data={data} />;
  }
}

export default TwitterEngagementsChart;
