import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, DiscreteColorLegend } from 'react-vis';
import store from '../stores/store'

export default class GraphSvg extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getState(store.getState());
  }

  render() {
    var allSeries = this._generateSeries();

    return (
      <div style={{margin: 'auto', width: this.state.width}}>
        <XYPlot width={this.state.width} height={this.state.height} xType="time" style={{padding: '10px'}}>
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

    for(let group of this.state.groups) {
      var groupPayments = this.state.paymentsByGroup[group];
      var series = [{
        x: this.state.minDate,
        y: 0
      }, {
        x: groupPayments[0].paymentDate,
        y: 0
      }, {
        x: groupPayments[0].paymentDate,
        y: groupPayments[0].appliedToPrincipal
      }];

      // Add 2 points: <x(i+1), y(i)> <x(i+1), y(i+1)>
      for(var i = 1; i < groupPayments.length; i++) {
        series.push({
          x: groupPayments[i].paymentDate,
          y: series[series.length - 1].y
        });

        series.push({
          x: groupPayments[i].paymentDate,
          y: series[series.length - 1].y
             + groupPayments[i].appliedToPrincipal
        });
      }

      series.push({
        x: this.state.maxDate,
        y: series[series.length - 1].y
      });

      allSeries.push(
        <LineSeries key={group} data={series} />
      );
    }

    return allSeries;
  }

  _getState(appState) {
    var xTickValues = [];
    for(let i = appState.minDate.getFullYear(); i <= appState.maxDate.getFullYear(); i++) {
      xTickValues.push(new Date(i, 0, 1));
    }

    return {
      groups: appState.groups,
      height: 600,
      maxDate: new Date(appState.maxDate),
      minDate: new Date(appState.minDate),
      paymentsByGroup: appState.paymentsByGroup,
      xTickValues: xTickValues,
      width: 800
    };
  }
}
