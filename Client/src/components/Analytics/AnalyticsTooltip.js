import React from 'react';
import Popup from "reactjs-popup";

class AnalyticsTooltip extends React.Component {
  state = {
    open: false,
  };

  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  render() {
    return <Popup
      trigger={<i className="fa fa-question-circle"></i>}
      on="hover"
      position="bottom center"
      arrow={false}
      closeOnDocumentClick={true}
    >
      {
        close => (
          <div className="anl-tooltip">{this.props.tooltipDesc}</div>
        )}
    </Popup>
  }
}

export default AnalyticsTooltip;