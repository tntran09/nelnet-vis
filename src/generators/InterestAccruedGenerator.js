export default function(state) {
  var allSeries = [];

  for (let group of state.groups) {
    var groupPayments = state.paymentsByGroup[group];

    var series = [
      { x: state.minDate, y: 0 }
    ];

    for (var i = 0; i < groupPayments.length; i++) {
      series.push({
        x: groupPayments[i].paymentDate,
        y: series[series.length - 1].y + groupPayments[i].appliedToInterest
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
