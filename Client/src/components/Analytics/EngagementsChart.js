import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

class EngagementsChart extends React.Component {
  render() {
    const { data } = this.props;

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
            tickMargin={20}
            />
          <YAxis
            axisLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Reactions"
            stroke="#D83E7F"
            fill="rgba(216, 62, 127, 0.3)"
          />
          <Area
            type="monotone"
            dataKey="Comments"
            stroke="#2D86DA"
            fill="rgba(45, 134, 218, 0.3)"
          />
          <Area
            type="monotone"
            dataKey="Shares"
            stroke="#EB8666"
            fill="rgba(235, 134, 102, 0.3)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}


export default EngagementsChart;