import React from 'react';

import { UTC_MONTHS } from '../../../utils/constants';

import { pageInsightsByType } from '../../../requests/twitter/channels';
import PostsChart from '../PostsChart';

const data = [
  {
    name: 'Page A', Tweets: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', Tweets: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', Tweets: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', Tweets: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', Tweets: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', Tweets: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', Tweets: 3490, pv: 4300, amt: 2100,
  },
];

class TweetsChart extends React.Component {
  state = {
    isLoading: false,
    data: []
  };

  generateWeekData = (response, startDate) => {
    const mappedData = {};

    // We initialize the object that will contain the amount of
    // tweets that we have per day
    for (let i = 0; i <= 7; i++) {
      const nextDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      mappedData[nextDay.getDate()] = {
        name: `${nextDay.getDate()} ${UTC_MONTHS[nextDay.getUTCMonth()]}`,
        Tweets: 0
      };
    }
    
    response.map(record => {
      const recordDate = new Date(record[0]);
      mappedData[recordDate.getDate()].Tweets += record[1];
    });

    console.log(mappedData.values());
    this.setState({data: mappedData.values()})
  }

  fetchAnalyticsData = (accountId, startDate, endDate, cb) => {
    this.setState(() => ({isLoading: true}));
    pageInsightsByType(accountId, startDate.getTime(), endDate.getTime(), 'tweetsChartData')
      .then((response) => {
        cb(response, startDate);
      })
      .catch(() => {
        this.setState(() => ({isLoading: false}));
      });
  }

  getAnalyticsData() {
    const {accountId, period} = this.props;
    let startDate, endDate;

    switch(period) {
      case 'Week':
        endDate = new Date();
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
        const response = this.fetchAnalyticsData(accountId, startDate, endDate, this.generateWeekData);
        break;
      case 'Month':
        endDate = new Date();
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 31);
        break;
      case 'Year':
        endDate = new Date();
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 365);
        break;
      case 'Day':
        startDate = new Date();
        endDate = new Date();
        break;
    }    
  }

  componentDidMount() {
    this.getAnalyticsData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.period !== prevProps.period) {
      this.getAnalyticsData();
    }
  }

  render() {
    return <PostsChart data={data} dataKey="Tweets" />;
  }
}

export default TweetsChart;
