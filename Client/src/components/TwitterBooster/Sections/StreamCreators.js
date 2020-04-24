import React from 'react';
import { Typography, Grid, Card, CardContent } from '@material-ui/core';



class StreamCreators extends React.Component {
    state = {
        
    }


    render() {
        const { creators, onClickCreator} = this.props;
        
        return (
            <Grid
                className="dashboard-containers"
                container
            >
                {
                    creators.map((item, key) => (
                        <Grid
                            container
                            item
                            key={key}
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                            onClick={() => onClickCreator(item)}
                        >
                            <Card className="dashboard-cards">
                                <CardContent className="dashboard-spacing">
                                    <img src={`/images/monitor-icons/${item.icon}.svg`} />
                                    <Typography className="dashboard-title">
                                        {item.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}


export default StreamCreators;