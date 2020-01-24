import React from 'react';

import { UTC_MONTHS } from '../../../utils/constants';

import { pageInsightsByType } from '../../../requests/twitter/channels';
import SimpleAreaChart from '../SimpleAreaChart';

const data = [
  {
    name: 'Page A', Tweets: 30
  },
  {
    name: 'Page B', Tweets: 24
  },
  {
    name: 'Page C', Tweets: 31
  },
  {
    name: 'Page D', Tweets: 28
  },
  {
    name: 'Page E', Tweets: 41
  },
  {
    name: 'Page F', Tweets: 22
  },
  {
    name: 'Page G', Tweets: 25
  },
];

class TweetsChart extends React.Component {
  state = {
    isLoading: false,
    data: []
  };

  mapDataForWeek = (data) => {
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: `${date.getDate()} ${UTC_MONTHS[date.getMonth()]}`,
        Tweets: row[1]
      });
    });

    this.setState({ data: mappedData });
  };

  mapDataForMonth = (data) => {
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: date.getDate(),
        Tweets: row[1]
      });
    });

    this.setState({ data: mappedData });
  }

  mapDataForYear = (data) => {
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: UTC_MONTHS[date.getUTCMonth()],
        Tweets: row[1]
      });
    });

    this.setState({ data: mappedData });
  }

  fetchAnalyticsData = () => {
    const { accountId, startDate, endDate, selectedPeriod } = this.props;
    this.setState(() => ({isLoading: true}));
    pageInsightsByType(
      accountId,
      startDate,
      endDate,
      'tweetsChartData',
      selectedPeriod.toLowerCase()
    )
      .then((response) => {
        switch (selectedPeriod) {
          case 'Week':
            this.mapDataForWeek(response);
            break;
          case 'Month':
            this.mapDataForMonth(response);
            break;
          case 'Year':
            this.mapDataForYear(response);
            break;
        }
      })
      .catch(() => {
        this.setState(() => ({isLoading: false}));
      });
  }

  componentDidMount() {
    this.fetchAnalyticsData();
  }

  componentDidUpdate(prevProps) {
    const { selectedPeriod, accountId, startDate } = this.props;
    if (
      selectedPeriod !== prevProps.selectedPeriod ||
      accountId !== prevProps.accountId ||
      startDate !== prevProps.startDate
    ) {
      this.fetchAnalyticsData();
    }
  }

  render() {
    return <SimpleAreaChart data={this.state.data} dataKey="Tweets" />;
  }
}

export default TweetsChart;
