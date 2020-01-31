import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

import { UTC_MONTHS } from '../../../utils/constants';

import { pageInsightsByType } from '../../../requests/facebook/channels';
import SimpleAreaChart from '../SimpleAreaChart';

class FacebookSimpleChart extends React.Component {
  static propTypes = {
    accountId: PropTypes.number.isRequired,
    startDate: PropTypes.number.isRequired,
    endDate: PropTypes.number.isRequired,
    selectedPeriod: PropTypes.string.isRequired,
    endPointType: PropTypes.string.isRequired,
    chartDataKey: PropTypes.string.isRequired
  }

  state = {
    isLoading: false,
    data: []
  };

  mapDataForDay = (data) => {
    const { chartDataKey } = this.props;
    const mappedData = [];

    data.map((row) => {
      // We are using Europe/London because the time of where the tweets
      // were published is comming in GMT +0 and we need to be precise with
      // the time in the chart.
      const date = moment(row[0]).tz('Europe/London');
      const hour = date.hour();
      mappedData.push({
        name: `${hour < 10 ? '0' + hour.toString() : hour}:00`,
        [chartDataKey]: row[1]
      });
    });

    // We need to sort the elements because of the change in the timezone
    mappedData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a > b.name) {
        return 1;
      } else {
        return 0;
      }
    });

    this.setState({ data: mappedData, isLoading: false });
  }

  mapDataForWeek = (data) => {
    const { chartDataKey } = this.props;
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: `${date.getDate()} ${UTC_MONTHS[date.getMonth()]}`,
        [chartDataKey]: row[1]
      });
    });

    this.setState({ data: mappedData, isLoading: false });
  };

  mapDataForMonth = (data) => {
    const { chartDataKey } = this.props;
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: date.getDate(),
        [chartDataKey]: row[1]
      });
    });

    this.setState({ data: mappedData, isLoading: false });
  }

  mapDataForYear = (data) => {
    const { chartDataKey } = this.props;
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: UTC_MONTHS[date.getMonth()],
        [chartDataKey]: row[1]
      });
    });

    this.setState({ data: mappedData, isLoading: false });
  }

  fetchAnalyticsData = () => {
    const { accountId, startDate, endDate, selectedPeriod, endPointType } = this.props;
    this.setState(() => ({isLoading: true}));
    pageInsightsByType(
      accountId,
      startDate,
      endDate,
      endPointType,
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
    const { chartDataKey } = this.props;
    const { isLoading, data } = this.state;

    return (
      <div>
        <SimpleAreaChart data={data} dataKey={chartDataKey} />
        {isLoading && (
          <div className="loading-layer">
            <Loader type="Bars" color="#46a5d1" height={60} width={60} />
          </div>
        )}
      </div>
    );
  }
}

export default FacebookSimpleChart;
