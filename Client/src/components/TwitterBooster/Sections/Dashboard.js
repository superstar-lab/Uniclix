import React from 'react';
import { Typography, Grid, Card, CardContent, Button} from '@material-ui/core';
import PropTypes from 'prop-types';

const containers = {
    textAlign: 'center',
}

const cards = {
    marginTop: 30,
    width: '85%',
    cursor: 'pointer',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    height: 135
}

const spacing = {
    paddingTop: 31,
}

const title = {
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.130517,
    marginTop: 12,
    marginBottom: 20,
    whiteSpace: 'nowrap'
}
class Dashboard extends React.Component {
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
                container
                style={containers}
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
                    <Card style={cards}>
                        <CardContent style={spacing}>
                            <img src={kind.icon}/>
                            <Typography style={title}>
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

Dashboard.defaultProps = {
    type: [],
}

Dashboard.propTypes = {
    type: PropTypes.array.isRequired
}

export default Dashboard;