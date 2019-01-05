export default function(state) {
  var allSeries = [];

  for(let group of state.groups) {
    var groupPayments = state.paymentsByGroup[group];

    // Set the first 3 points of the line <0, 0> <x1, 0> <x1, y1>
    var series = [{
      x: state.minDate,
      y: 0
    }, {
      x: groupPayments[0].paymentDate,
      y: 0
    }, {
      x: groupPayments[0].paymentDate,
      y: groupPayments[0].appliedToPrincipal
    }];

    // Add 2 points to make a stepped line: <x(i+1), y(i)> <x(i+1), y(i+1)>
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
      x: state.maxDate,
      y: series[series.length - 1].y
    });

    allSeries.push({
      group: group,
      seriesData: series
    });
  }

  return allSeries;
}
