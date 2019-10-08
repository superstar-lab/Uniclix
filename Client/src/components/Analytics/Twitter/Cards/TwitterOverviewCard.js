import React from 'react';
import Loader from 'react-loader-spinner';
import AnalyticsTooltip from '../../AnalyticsTooltip';
import { pageInsightsByType } from "../../../../requests/twitter/channels";

class TwitterOverviewCard extends React.Component{
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

                if(error.response.status === 403){
                    this.props.setForbidden(true);
                }
                
                return Promise.reject(error);
            }); 
        } catch (error) {
            
        }        
    };

    render(){
        const {name, description, tooltipDesc} = this.props;
        return (
            <div className="overview-card analytics-card">
                <div className="card-header">
                    <img className="card-img" src="/images/twitter.png"></img> {name}
                    <AnalyticsTooltip tooltipDesc={tooltipDesc} />
                </div>
                <div className="card-analytics-body">
                    <div className="card-number">
                        {this.state.loading ?  <Loader type="Bars" color="#46a5d1" height={60} width={60} /> : this.state.count !=null && this.state.count}
                    </div>
                    <div className="card-description">{description}</div>
                </div>
                <div className="card-footer">
                </div>
            </div>
            );
    }
}

export default TwitterOverviewCard;