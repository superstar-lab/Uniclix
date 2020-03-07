import React from 'react';
import 'react-dates/initialize';
import PropTypes from 'prop-types';

import AnalyticsContext from '../AnalyticsContext';

import TweetsTable from './Cards/TweetsTable';
import TwitterOverviewCard from './TwitterOverviewCard';
import TwitterChartsSection from './TwitterChartsSection';

class TwitterAnalyticsBoard extends React.Component {
    static propTypes = {
        selectedAccount: PropTypes.number.isRequired
    };

    socialMediasSelectorOptions = [];

    render() {
        const { selectedAccount } = this.props;

        return (
            <AnalyticsContext.Consumer>
                {
                    ({ setForbidden })  => (
                        <div>
                            <div className="row overview-cards-container mb20">
                                <div className="col-md-3 col-xs-12">
                                    <TwitterOverviewCard
                                        title="Tweets"
                                        type="tweetsCount"
                                        icon="edit"
                                        selectedAccount={selectedAccount}
                                        setForbidden={setForbidden}
                                    />
                                </div>
                                <div className="col-md-3 col-xs-12">
                                    <TwitterOverviewCard
                                        title="Followers"
                                        type="followersCount"
                                        icon="followers"
                                        selectedAccount={selectedAccount}
                                        setForbidden={setForbidden}
                                    />
                                </div>
                                <div className="col-md-3 col-xs-12">
                                    <TwitterOverviewCard
                                        title="Following"
                                        type="followingCount"
                                        icon="chart"
                                        selectedAccount={selectedAccount}
                                        setForbidden={setForbidden}
                                    />
                                </div>
                                <div className="col-md-3 col-xs-12">
                                    <TwitterOverviewCard
                                        title="Likes"
                                        type="totalLikesCount"
                                        icon="eye"
                                        selectedAccount={selectedAccount}
                                        setForbidden={setForbidden}
                                    />
                                </div>
                            </div>
                            <TwitterChartsSection selectedAccount={selectedAccount} socialMedia="twitter" />
                            <div className="row mb20">
                                <div className="col-xs-12">
                                    <TweetsTable
                                        name="Tweets Table"
                                        type='tweetsTableData'
                                        selectedAccount={selectedAccount} />
                                </div>
                            </div>
                        </div>
                    )
                }
            </AnalyticsContext.Consumer>
        );
    }
}

export default TwitterAnalyticsBoard;
