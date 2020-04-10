import React from 'react';
import { Badge } from 'antd';

const AwaitingApprovalTabTitle = ({ amountOfPendingPosts }) => {
  return amountOfPendingPosts ?
    (
      <Badge count={amountOfPendingPosts}>
        <span>Awaiting Approval</span>
      </Badge>
    ) : 'Awaiting Approval';
};

export default AwaitingApprovalTabTitle;
