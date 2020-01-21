import React from 'react';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import { pageInsightsByType } from "../../../requests/twitter/channels";

class TwitterOverviewCard extends React.Component {
    state = {
        isLoading: false,
        analyticsData: "null"
    }

    getAnalyticsData = () => {
        const {selectedAccount, startDate, endDate, type} = this.props;

        this.setState(() => ({isLoading: true}));
        pageInsightsByType(selectedAccount, startDate, endDate, type)
            .then((response) => {
                this.setState(() => ({
                    isLoading: false,
                    analyticsData: response
                }));
            })
            .catch(() => {
                this.setState(() => ({isLoading: false}));
            });
    }

    componentDidMount() {
        this.getAnalyticsData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedAccount !== prevProps.selectedAccount) {
            this.getAnalyticsData();
        }
    }

    render() {
        const {title, icon} = this.props;
        const {analyticsData, isLoading} = this.state;

        return <OverviewCard isLoading={isLoading} title={title} ammount={analyticsData} icon={icon} />;
    }
};

TwitterOverviewCard.props = {
    title: PropTypes.string.isRequired
};

export default TwitterOverviewCard;
