import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { pageInsightsByType } from "../../../../requests/facebook/channels";
import AnalyticsTooltip from '../../AnalyticsTooltip'

class EngagementChart extends React.Component{
    state = {
        data: [],
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
        const {name} = this.props;
        const options = {
            chart: {
                type: 'column',
                height: '320'
            },
            yAxis: {
                min: 0,
            },
            xAxis: {
                type: 'datetime'
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: this.state.data
        }
        return (
            <div className="overview-card analytics-card">
                <div className="card-header">
                    <img className="card-img" src="/images/facebook.png"></img> {name}
                    <AnalyticsTooltip tooltipDesc={this.props.tooltipDesc} />
                </div>
                <div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
            </div>
            );
    }
}

export default EngagementChart;