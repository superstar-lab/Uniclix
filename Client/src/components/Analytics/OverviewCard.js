import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

class OverviewCard extends React.Component {
    render() {
        const {icon, ammount, title, isLoading} = this.props;

        return (
            <div className="analytics-overview-card">
                {isLoading && <Loader type="Bars" color="#46a5d1" height={60} width={60} />}
                {
                    !isLoading && <React.Fragment>
                        <div className="icon-container">
                            <img src={`/images/icons/${icon}.svg`} />
                        </div>
                        <div className="ammount">{ammount}</div>
                    </React.Fragment>
                }
                <div className="title">{title}</div>
            </div>
        );
    }
};

OverviewCard.props = {
    title: PropTypes.string.isRequired,
    ammount: PropTypes.string.isRequired,
    icon: PropTypes.oneOf('post', 'followers', 'chart', 'eye')
};

export default OverviewCard;
