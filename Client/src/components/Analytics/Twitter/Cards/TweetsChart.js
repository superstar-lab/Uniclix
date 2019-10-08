import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { pageInsightsByType } from "../../../../requests/twitter/channels"
import AnalyticsTooltip from '../../AnalyticsTooltip'

class TweetsChart extends React.Component{
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
            console.log(error);
        }
        
    };

    render(){
        const {name} = this.props;
        const options = {
            chart: {
                type: 'spline',
                height: '320'
            },
            title: {
                text:''
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0
            },
        
            plotOptions: {
                spline: {
                    marker: {
                        enabled: false
                    }
                }
            },
        
            colors: ['#46a5d1'],
        
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            series: [{
                showInLegend: false,
                name: name,
                data: this.state.data
            }]
        }
        return (
            <div className="overview-card analytics-card">
                <div className="card-header">
                    <img className="card-img" src="/images/twitter.png"></img> {name}
                    <AnalyticsTooltip tooltipDesc={this.props.tooltipDesc} />
                </div>
                <div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                        allowChartUpdate={true}
                    />
                </div>
            </div>
            );
    }
}

export default TweetsChart;