import React from 'react';
import 'react-dates/initialize';
import { connect } from "react-redux";

import AnalyticsContext from './AnalyticsContext';
import { startSetChannels } from "../../actions/channels";
import channelSelector from "../../selectors/channels";

import AnalyticsRouter from '../../routes/AnalyticsRouter';
import UpgradeAlert from '../UpgradeAlert';
import AccountSelector from '../../components/AccountSelector';
import SocialMediaSelector from '../../components/SocialMediaSelector';

const ACCOUNT_SELECTOR_FILTERS = {
    'facebook': (account) => account.details.account_type === 'page'
};

class AnalyticsLanding extends React.Component {

    socialMediasSelectorOptions = [];

    constructor(props) {
        super(props);

        const pathParts = this.props.location.pathname.split('/');
        // We get which social media is willing to be viewed by geting it from the URL
        const selectedSocialMedia = pathParts[pathParts.length -1];
        const accountSelectorOptions = this.getAccountSelectorOptions(selectedSocialMedia);

        props.allChannels.forEach(({ type }) => {
            // Getting the options for the socialMedia dropdown
            // Hiding linkedin for the moment
            if (this.socialMediasSelectorOptions.indexOf(type) === -1 && type !== 'linkedin') {
                this.socialMediasSelectorOptions.push(type);
            }
        });        

        this.state = {
            data: false,
            forbidden: false,
            calendarChange: false,
            loading: props.channelsLoading,
            selectedAccount: accountSelectorOptions[0].id,
            selectedSocialMedia
        }
    }

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    };

    setForbidden = (forbidden = false) => {
        if (forbidden != this.state.forbidden) {
            this.setState(() => ({
                forbidden
            }));
        }
    };

    onAccountChange = (value) => this.setState({selectedAccount: value});

    onSocialMediaChange = (value) => {
        this.setState({selectedSocialMedia: value});
        this.props.history.push(`/analytics/${value}`);
    };

    getAccountSelectorOptions = (selectedSocialMedia) => {
        const { allChannels } = this.props;
        const socialMediaFilter = ACCOUNT_SELECTOR_FILTERS[selectedSocialMedia];
        let options = allChannels.filter((account => account.type === selectedSocialMedia));

        if (socialMediaFilter) {
            options = options.filter(socialMediaFilter);
        }

        return options;
    };

    render() {
        const { selectedAccount, selectedSocialMedia } = this.state;

        return (
            <div className="analytics-page">
                <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} />
                {
                    !this.state.forbidden && (
                        <React.Fragment>
                            <div className="section-header mb-20">
                                <h1 className="page-title">Analytics</h1>
                                <div className="section-header__first-row">
                                    <h3>{`${selectedSocialMedia} Overview`}</h3>
                                    <div className="dropdown-selectors">
                                        <SocialMediaSelector
                                            socialMedias={this.socialMediasSelectorOptions}
                                            value={selectedSocialMedia}
                                            onChange={this.onSocialMediaChange}
                                        />
                                        <AccountSelector
                                            socialMedia={selectedSocialMedia}
                                            onChange={this.onAccountChange}
                                            value={selectedAccount}
                                            accounts={this.getAccountSelectorOptions(selectedSocialMedia)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <AnalyticsContext.Provider value={{ setForbidden: this.setForbidden }}>
                                <AnalyticsRouter selectedAccount={selectedAccount} />
                            </AnalyticsContext.Provider>
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const selectedGlobalChannel = { selected: 1, provider: undefined };
    const selectedChannel = channelSelector(state.channels.list, selectedGlobalChannel);

    return {
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {},
        allChannels: state.channels.list
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsLanding);
