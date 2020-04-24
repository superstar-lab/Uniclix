import React from 'react';
import 'react-dates/initialize';
import PropTypes from 'prop-types';

import AnalyticsContext from '../AnalyticsContext';

import FacebookOverviewCard from './FacebookOverviewCard';
import FacebookChartsSection from './FacebookChartsSection';
import PostsTable from './Cards/PostsTable';

class FacebookAnalyticsBoard extends React.Component {
    static propTypes = {
        selectedAccount: PropTypes.number.isRequired
    };

    socialMediasSelectorOptions = [];

    render() {
        const { selectedAccount } = this.props;

        return (
            <AnalyticsContext.Consumer>
                {
                    ({ setForbidden }) => (
                        <div>
                            <div className="row overview-cards-container mb20">
                                <div className="col-md-3 col-xs-12">
                                    <FacebookOverviewCard
                                        title="Posts"
                                        type="postsCount"
                                        icon="edit"
                                        startDate={new Date('1/1/2008').getTime()}
                                        endDate={new Date().getTime()}
                                        selectedAccount={selectedAccount}
                                        setForbidden={setForbidden}
                                    />
                                </div>
                                <div className="col-md-3 col-xs-12">
                                    <FacebookOverviewCard
                                        title="Fans"
                                        type="fansCount"
                                        icon="followers"
                                        startDate={new Date().getTime()}
                                        endDate={new Date().getTime()}
                                        selectedAccount={selectedAccount}
                                        setForbidden={setForbidden}
                                    />
                                </div>
                                <div className="col-md-3 col-xs-12">
                                    <FacebookOverviewCard
                                        title="Engagement"
                                        type="engagementsCount"
                                        icon="chart"
                                        startDate={new Date('1/1/2008').getTime()}
                                        endDate={new Date().getTime()}
                                        selectedAccount={selectedAccount}
                                        setForbidden={setForbidden}
                                    />
                                </div>
                                <div className="col-md-3 col-xs-12">
                                    <FacebookOverviewCard
                                        title="Impressions"
                                        type="impressionsCount"
                                        icon="eye"
                                        startDate={new Date('1/1/2008').getTime()}
                                        endDate={new Date().getTime()}
                                        selectedAccount={selectedAccount}
                                        setForbidden={setForbidden}
                                    />
                                </div>
                            </div>
                            <FacebookChartsSection selectedAccount={selectedAccount} socialMedia="facebook" />
                            <div className="row mb20">
                                <div className="col-xs-12">
                                    <PostsTable
                                        name="Posts Table"
                                        type='postsData'
                                        startDate={new Date('1/1/2008').getTime()}
                                        endDate={new Date().getTime()}
                                        selectedAccount={selectedAccount}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }
            </AnalyticsContext.Consumer>
        );
    }
}

export default FacebookAnalyticsBoard;
