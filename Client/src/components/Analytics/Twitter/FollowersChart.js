import React from 'react';

import { UTC_MONTHS } from '../../../utils/constants';
import { pageInsightsByType } from '../../../requests/twitter/channels';

import SimpleAreaChart from '../SimpleAreaChart';

class FollowersChart extends React.Component {
  state = {
    isLoading: false,
    data: []
  };

  mapDataForDay = (data) => {
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      const hour = date.getHours();
      mappedData.push({
        name: `${hour < 10 ? '0' + hour.toString() : hour}:00`,
        Followers: row[1]
      });
    });

    this.setState({ data: mappedData });
  }

  mapDataForWeek = (data) => {
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);

      mappedData.push({
        name: `${date.getDate()} ${UTC_MONTHS[date.getMonth()]}`,
        Followers: row[1]
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
        Followers: row[1]
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
        Followers: row[1]
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
      'followersChartData',
      selectedPeriod.toLowerCase()
    )
      .then((response) => {
        switch (selectedPeriod) {
          case 'Day':
            this.mapDataForDay(response);
            break;
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
    return <SimpleAreaChart data={this.state.data} dataKey="Followers" />;
  }
}

export default FollowersChart;
