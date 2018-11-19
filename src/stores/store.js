import { createStore } from 'redux';
import { groups, payments } from '../data/data.json';

var groupNames = Object.keys(groups);
var paymentsByGroup = {};
for(let group of groupNames) {
  paymentsByGroup[group] = [];
}

var minDate = new Date(payments[0].paymentDate);
var maxDate = minDate;

var paymentsByGroup = payments.reduce((aggregate, current) => {
  var date = new Date(current.paymentDate);
  minDate = new Date(Math.min(minDate, date));
  maxDate = new Date(Math.max(maxDate, date));

  aggregate[current.groupName].push({
    paymentDate: date,
    appliedToPrincipal: current.appliedToPrincipal,
    appliedToInterest: current.appliedToInterest
  });

  return aggregate;
}, paymentsByGroup);

// Push the min/max date to the bookend the full calendar years
minDate = new Date(minDate.getFullYear(), 0, 1);
maxDate = new Date(maxDate.getFullYear(), 11, 31);

for(var group in paymentsByGroup) {
  paymentsByGroup[group].sort((a,b) => a.paymentDate - b.paymentDate);
}

var initialState = {
  // Fixed portion of the state (per data set)
  groups: groupNames,
  maxDate: maxDate,
  minDate: minDate,
  paymentsByGroup: paymentsByGroup
}

function baseReducer(state = initialState, action) {
  // No actions defined
  return state;
}

const store = createStore(baseReducer, initialState);
export default store;
