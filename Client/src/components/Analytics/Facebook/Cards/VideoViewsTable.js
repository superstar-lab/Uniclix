import React from 'react';
import AnalyticsTooltip from '../../AnalyticsTooltip'

const VideoViewsTable = ({name}) => 

    (
        <div className="overview-card analytics-card">
            <div className="card-header">
                <img className="card-img" src="/images/facebook.png"></img> {name}
                <AnalyticsTooltip tooltipDesc={this.props.tooltipDesc} />
            </div>
            <div className="card-table">
                <table className="table anl-posts-table">
                    <thead>
                        <tr>
                            <th className="anl-posts-table-th-first">Date</th>
                            <th className="anl-posts-table-th-second">Video Description</th>                            
                            <th>Reach</th>
                            <th>Views</th>
                            <th>Video Length</th>
                            <th>View Time</th>
                            <th>Average Completion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">
                                <div className="post-table-images">
                                    <img className="pt-page-img" src="/images/uniclix.png" />
                                    <img className="pt-page-facebook" src="/images/facebook.png"></img>
                                </div>
                                <div className="post-table-page-date">
                                    <p className="pt-page-name">UniClix</p>
                                    <p className="pt-post-date">Jan 11, 18:38</p>
                                </div>
                            </th>
                            <td className="anl-posts-table-th-second">TIP OF THE DAY Connect with your audience, Expanding your reach is undoubtedly forefront in your mind. And the best way to do this is by connecting in a genuine way with your audience. Check our blog for more relevant content https://uniclixapp.com/blog 👇FOLLOW US @uniclix . . #socialmediamanager #socialmediamarketing #socialmediaschedule #socialmedia #socialmediatool #twitter #instagram #instafeed #socialmedia #instagram #instagramm #facebook #marketing #socialmediamarketing #selling #socialsharing #psychological #marketingideas #marketinglife #marketingplan #socialmediamarketingtips #socialmediamarketingstrategy #socialmediamarketingservices #facebookmarketing</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <div className="post-table-images">
                                    <img className="pt-page-img" src="/images/uniclix.png" />
                                    <img className="pt-page-facebook" src="/images/facebook.png"></img>
                                </div>
                                <div className="post-table-page-date">
                                    <p className="pt-page-name">UniClix</p>
                                    <p className="pt-post-date">Jan 11, 18:38</p>
                                </div>
                            </th>
                            <td className="anl-posts-table-th-second">TIP OF THE DAY Connect with your audience, Expanding your reach is undoubtedly forefront in your mind. And the best way to do this is by connecting in a genuine way with your audience. Check our blog for more relevant content https://uniclixapp.com/blog 👇FOLLOW US @uniclix . . #socialmediamanager #socialmediamarketing #socialmediaschedule #socialmedia #socialmediatool #twitter #instagram #instafeed #socialmedia #instagram #instagramm #facebook #marketing #socialmediamarketing #selling #socialsharing #psychological #marketingideas #marketinglife #marketingplan #socialmediamarketingtips #socialmediamarketingstrategy #socialmediamarketingservices #facebookmarketing</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <div className="post-table-images">
                                    <img className="pt-page-img" src="/images/uniclix.png" />
                                    <img className="pt-page-facebook" src="/images/facebook.png"></img>
                                </div>
                                <div className="post-table-page-date">
                                    <p className="pt-page-name">UniClix</p>
                                    <p className="pt-post-date">Jan 11, 18:38</p>
                                </div>
                            </th>
                            <td className="anl-posts-table-th-second">TIP OF THE DAY Connect with your audience, Expanding your reach is undoubtedly forefront in your mind. And the best way to do this is by connecting in a genuine way with your audience. Check our blog for more relevant content https://uniclixapp.com/blog 👇FOLLOW US @uniclix . . #socialmediamanager #socialmediamarketing #socialmediaschedule #socialmedia #socialmediatool #twitter #instagram #instafeed #socialmedia #instagram #instagramm #facebook #marketing #socialmediamarketing #selling #socialsharing #psychological #marketingideas #marketinglife #marketingplan #socialmediamarketingtips #socialmediamarketingstrategy #socialmediamarketingservices #facebookmarketing</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

export default VideoViewsTable;