import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

class PostsChart extends React.Component {
  render() {
    const { data, dataKey } = this.props;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" fill="#FFF" />
          <XAxis
            dataKey="name"
            axisLine={false}
            />
          <YAxis
            axisLine={false}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#D83E7F"
            fill="rgba(216, 62, 127, 0.12)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}


export default PostsChart;