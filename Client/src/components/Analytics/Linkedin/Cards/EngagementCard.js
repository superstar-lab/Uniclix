import React from 'react';
import Loader from 'react-loader-spinner';
import AnalyticsTooltip from '../../AnalyticsTooltip';
import { pageInsightsByType } from "../../../../requests/linkedin/channels";

class EngagementCard extends React.Component{
    state = {
        data: null,
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
                    data: response,
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
        const {name, tooltipDesc} = this.props;
        return (
            <div className="overview-card analytics-card">
            <div className="card-header">
                <img className="card-img" src="/images/linkedin-logo.png"></img> {name}
                <AnalyticsTooltip tooltipDesc={tooltipDesc}/>
            </div>
            <div className="eng-card-section">
                <span className="anl-desc card-description">Shares</span>
                <span className="anl-count">
                    {this.state.loading ? <Loader type="Bars" color="#ffffff" height={15} width={15} /> : this.state.data !=null && this.state.data.shares}              
                </span>         
            </div>
            <div className="eng-card-section eng-card-section-middle">
                <span className="anl-desc card-description">Comments</span>
                <span className="anl-count">
                    {this.state.loading ? <Loader type="Bars" color="#ffffff" height={15} width={15} /> : this.state.data !=null && this.state.data.comments}
                </span>
            </div>
            <div className="eng-card-section">
                <span className="anl-desc card-description">Likes</span>
                <span className="anl-count">
                    {this.state.loading ? <Loader type="Bars" color="#ffffff" height={15} width={15} /> : this.state.data !=null && this.state.data.likes}
                </span>
            </div>
        </div>
            );
    }
}

export default EngagementCard;