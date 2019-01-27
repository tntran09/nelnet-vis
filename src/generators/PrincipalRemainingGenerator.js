export default function(state) {
  var allSeries = [];

  for (let group of state.groups) {
    var groupPayments = state.paymentsByGroup[group];
    var originalAmount = groupPayments.reduce((aggregate, current) => aggregate + current.appliedToPrincipal, 0)

    var series = [
      { x: state.minDate, y: originalAmount }
    ];

    for (var i = 0; i < groupPayments.length; i++) {
      series.push({
        x: groupPayments[i].paymentDate,
        y: series[series.length - 1].y
      }, {
        x: groupPayments[i].paymentDate,
        y: series[series.length - 1].y - groupPayments[i].appliedToPrincipal
      });
    }

    series.push({
      x: state.maxDate,
      y: series[series.length - 1].y // Should be 0
    });

    allSeries.push({
      group: group,
      seriesData: series
    });
  }

  return allSeries;
}
