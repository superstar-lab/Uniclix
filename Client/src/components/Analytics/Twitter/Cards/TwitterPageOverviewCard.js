import React from 'react';
import Loader from 'react-loader-spinner';
import { pageInsightsByType } from "../../../../requests/twitter/channels";
import AnalyticsTooltip from '../../AnalyticsTooltip'

class TwitterPageOverviewCard extends React.Component{
    state = {
        count: null,
        loading: false
    };

    componentDidMount(){
        this.fetchAnalytics();
    };

    componentDidUpdate(prevProps){
        if(prevProps.selectedAccount != this.props.selectedAccount || prevProps.calendarChange != this.props.calendarChange)
        {
            this.fetchAnalytics();
        }
    }

    fetchAnalytics = () => {
        this.setState(() => ({
            loading: true
        }));
        try {
            pageInsightsByType(this.props.selectedAccount, this.props.startDate, this.props.endDate, this.props.type)            
            .then((response) => {
                this.setState(() => ({
                    count: response,
                    loading: false
                }));
            }).catch(error => {
                this.setState(() => ({
                    loading: false
                }));
                return Promise.reject(error);
            }); 
        } catch (error) {
            
        }
        
    };

    render(){
        const {name, description} = this.props;
        return (
            <div className="overview-card analytics-card">
                <div className="card-header">
                    <img className="card-img" src="/images/twitter.png"></img> {name}
                    <AnalyticsTooltip tooltipDesc={this.props.tooltipDesc} />
                </div>
                <div className="card-analytics-body anl-post-page">
                    <span className="anl-desc card-description">{description}</span><span className="anl-count">
                        {this.state.loading ? <Loader type="Bars" color="#ffffff" height={15} width={15} /> : this.state.count !=null && this.state.count}
                    </span>
                </div>
            </div>
            );
    }
}

export default TwitterPageOverviewCard;