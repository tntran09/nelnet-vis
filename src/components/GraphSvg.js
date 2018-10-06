import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, DiscreteColorLegend } from 'react-vis';

export default class GraphSvg extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getState(props.groups, props.payments);
  }

  render() {
    var allSeries = this._generateSeries();

    return (
      <div style={{margin: 'auto', width: this.state.width}}>
        <XYPlot width={this.state.width} height={this.state.height} xType="time" style={{padding: '10px'}}>
          <XAxis />
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

  _getState(groups, payments) {
    var groupNames = Object.keys(groups);
    var paymentsByGroup = {};
    for(let group of groupNames) {
      paymentsByGroup[group] = [];
    }

    var minDate = new Date(payments[0].paymentDate);
    var maxDate = minDate;

    var paymentsByGroup = payments.reduce((aggregate, current) => {
      var date = new Date(current.paymentDate);
      minDate = Math.min(minDate, date);
      maxDate = Math.max(maxDate, date);

      aggregate[current.groupName].push({
        paymentDate: date,
        appliedToPrincipal: current.appliedToPrincipal,
        appliedToInterest: current.appliedToInterest
      });

      return aggregate;
    }, paymentsByGroup);

    for(var group in paymentsByGroup) {
      paymentsByGroup[group].sort((a,b) => a.paymentDate - b.paymentDate);
    }

    return {
      groups: groupNames,
      height: 600,
      maxDate: new Date(maxDate),
      minDate: new Date(minDate),
      paymentsByGroup: paymentsByGroup,
      width: 800
    };
  }
}
