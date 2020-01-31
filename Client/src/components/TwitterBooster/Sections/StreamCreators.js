import React from 'react';
import { Typography, Grid, Card, CardContent, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

class StreamCreators extends React.Component {
    state = {

    }

    render() {
        const { creators, onClickCreator } = this.props;

        return (
            <Grid
                className="dashboard-containers"
                container
            >
                {
                    creators.map((kind, key) => (
                        <Grid
                            container
                            item
                            key={key}
                            lg={3}
                            md={4}
                            sm={12}
                            xs={12}
                            onClick={() => onClickCreator(kind.title)}
                        >
                            <Card className="dashboard-cards">
                                <CardContent className="dashboard-spacing">
                                    <img src={kind.icon} />
                                    <Typography className="dashboard-title">
                                        {kind.title}
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

StreamCreators.defaultProps = {
    creators: [],
}

StreamCreators.propTypes = {
    creators: PropTypes.array.isRequired
}

export default StreamCreators;