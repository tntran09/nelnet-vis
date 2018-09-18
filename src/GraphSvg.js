import React from 'react';

export default class GraphSvg extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getState(props.data);
  }

  render() {
    return (
      <svg id="graphSvg" width={this.state.width} height={this.state.height}>
        <circle cx="50" cy="50" r="10" style={{fill: "red"}} />
      </svg>
    );
  }

  _getState(data) {
    var width = document.body.clientWidth;

    return {
      height: 600,
      width: width
    };
  }
}
