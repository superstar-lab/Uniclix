import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

import { UTC_MONTHS } from '../../../utils/constants';

import { pageInsightsByType } from '../../../requests/twitter/channels';
import EngagementsChart from '../EngagementsChart';
import EngagementCardsSection from '../EngagementCardsSection';

class TwitterEngagementsChart extends React.Component {
  static propTypes = {
    accountId: PropTypes.number.isRequired,
    startDate: PropTypes.number.isRequired,
    endDate: PropTypes.number.isRequired,
    selectedPeriod: PropTypes.string.isRequired
  };

  state = {
    isLoading: false,
    data: []
  };

  mapDataForDay = (data) => {
    const mappedData = [];

    data.map((row) => {
      // We are using Europe/London because the time of where the tweets
      // were published is comming in GMT +0 and we need to be precise with
      // the time in the chart.
      const date = moment(row[0]).tz('Europe/London');
      const hour = date.hour();
      mappedData.push({
        name: `${hour < 10 ? '0' + hour.toString() : hour}:00`,
        Reactions: row[1],
        Comments: row[2],
        Shares: row[3]
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
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: `${date.getDate()} ${UTC_MONTHS[date.getMonth()]}`,
        Reactions: row[1],
        Comments: row[2],
        Shares: row[3]
      });
    });

    this.setState({ data: mappedData, isLoading: false });
  };

  mapDataForMonth = (data) => {
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: date.getDate(),
        Reactions: row[1],
        Comments: row[2],
        Shares: row[3]
      });
    });

    this.setState({ data: mappedData, isLoading: false });
  }

  mapDataForYear = (data) => {
    const mappedData = [];

    data.map((row) => {
      const date = new Date(row[0]);
      mappedData.push({
        name: UTC_MONTHS[date.getMonth()],
        Reactions: row[1],
        Comments: row[2],
        Shares: row[3]
      });
    });

    this.setState({ data: mappedData, isLoading: false });
  }

  fetchAnalyticsData = () => {
    const { accountId, startDate, endDate, selectedPeriod } = this.props;
    this.setState(() => ({isLoading: true}));
    pageInsightsByType(
      accountId,
      startDate,
      endDate,
      'engagementsChartData',
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
      .catch((error) => {
        console.log(error);
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
    const { isLoading, data } = this.state;
    const { accountId, startDate, endDate, selectedPeriod, socialMedia } = this.props;

    return (
    <div>
      <EngagementsChart data={data} />
      {isLoading && (
        <div className="loading-layer">
          <Loader type="Bars" color="#46a5d1" height={60} width={60} />
        </div>
      )}
      {/* <EngagementCardsSection
        socialMedia={socialMedia}
        accountId={accountId}
        startDate={startDate}
        endDate={endDate}
        selectedPeriod={selectedPeriod}
      /> */}
    </div>
    );
  }
}

export default TwitterEngagementsChart;
