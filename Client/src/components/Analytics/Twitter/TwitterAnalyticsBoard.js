import React from 'react';
import 'react-dates/initialize';
import PropTypes from 'prop-types';

import TweetsTable from './Cards/TweetsTable';
import TwitterOverviewCard from './TwitterOverviewCard';
import ChartsSection from '../Sections/ChartsSection';

class TwitterAnalyticsBoard extends React.Component {
    static propTypes = {
        selectedAccount: PropTypes.number.isRequired
    };

    socialMediasSelectorOptions = [];

    render() {
        const { selectedAccount } = this.props;

        return (
            <div>
                <div className="row overview-cards-container mb20">
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard
                            title="Tweets"
                            type="tweetsCount"
                            icon="edit"
                            selectedAccount={selectedAccount}
                        />
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard
                            title="Followers"
                            type="followersCount"
                            icon="followers"
                            selectedAccount={selectedAccount}
                        />
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard
                            title="Engagements"
                            type="followingCount"
                            icon="chart"
                            selectedAccount={selectedAccount}
                        />
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard
                            title="Impressions"
                            type="totalLikesCount"
                            icon="eye"
                            selectedAccount={selectedAccount}
                        />
                    </div>
                </div>
                <ChartsSection selectedAccount={selectedAccount} socialMedia="twitter" />
                <div className="row mb20">
                    <div className="col-xs-12">
                        <TweetsTable
                            name="Tweets Table"
                            type='tweetsTableData'
                            selectedAccount={selectedAccount} />
                    </div>
                </div>
            </div>
        );
    }
}

export default TwitterAnalyticsBoard;
