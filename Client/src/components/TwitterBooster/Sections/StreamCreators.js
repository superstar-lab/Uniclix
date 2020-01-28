import React from 'react';
import { Typography, Grid, Card, CardContent, Button} from '@material-ui/core';
import PropTypes from 'prop-types';

class StreamCreators extends React.Component {
    state = {
        
    }

    render(){
        const {
            props: {
              type,
            },
          } = this;
          
        return(
            <Grid
				className="dashboard-containers"
                container
            >
                {type.map((kind, key) => (
                <Grid
                    container
                    item
                    id={key}
                    lg={3}
                    md={4}
                    sm={12}
                    xs={12}
                >
                    <Card className="dashboard-cards">
                        <CardContent className="dashboard-spacing">
                            <img src={kind.icon}/>
                            <Typography className="dashboard-title">
                                {kind.title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                ))}
            </Grid>
        );
    }
}

StreamCreators.defaultProps = {
    type: [],
}

StreamCreators.propTypes = {
    type: PropTypes.array.isRequired
}

export default StreamCreators;