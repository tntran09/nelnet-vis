import React from 'react';
import {
  DiscreteColorLegend,
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';
import store from '../stores/store'

export default class GraphSvg extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getUIState(store.getState());
    store.subscribe(() => this.setState(this._getUIState(store.getState())));
  }

  render() {
    var allSeries = this._generateSeries();

    return (
      <div style={{margin: 'auto', width: this.state.width, height: 680}}>
        <XYPlot width={this.state.width} height={this.state.height} xType="time" margin={{left: 50, right: 50}} style={{padding: '10px'}}>
          <XAxis tickValues={this.state.xTickValues} />
          <YAxis />
          <HorizontalGridLines />
          <VerticalGridLines />
          {allSeries}
          <DiscreteColorLegend items={this.state.groups} orientation="horizontal" />
        </XYPlot>
      </div>
    );
  }

  _generateSeries() {
    var allSeries = [];

    for(let series of this.state.seriesData) {
      allSeries.push(
        <LineSeries key={series.group} data={series.seriesData} />
      );
    }

    return allSeries;
  }

  _getUIState(appState) {
    var xTickValues = [];
    for(let i = appState.minDate.getFullYear(); i <= appState.maxDate.getFullYear()+1; i++) {
      xTickValues.push(new Date(i, 0, 1));
    }

    return {
      groups: appState.groups,
      height: 600,
      maxDate: appState.maxDate,
      minDate: appState.minDate,
      paymentsByGroup: appState.paymentsByGroup,
      seriesData: appState.seriesData,
      xTickValues: xTickValues,
      width: 800
    };
  }
}
