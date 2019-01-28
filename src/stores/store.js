import { createStore } from 'redux';
import { groups, payments } from '../data/data.json';
import InterestAccruedGenerator from '../generators/InterestAccruedGenerator';
import PaymentsAppliedGenerator from '../generators/PaymentsAppliedGenerator';
import PrincipalRemainingGenerator from '../generators/PrincipalRemainingGenerator';
import Functions from '../models/Functions';

var groupNames = Object.keys(groups);
var paymentsByGroup = {};
for(let group of groupNames) {
  paymentsByGroup[group] = [];
}

var minDate = new Date(payments[0].paymentDate);
var maxDate = minDate;

paymentsByGroup = payments.reduce((aggregate, current) => {
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

// Sort by payment date ascending
for(var group in paymentsByGroup) {
  paymentsByGroup[group].sort((a,b) => a.paymentDate - b.paymentDate);
}

var initialState = {
  // Fixed portion of the state (per data set, function)
  groups: groupNames,
  maxDate: maxDate,
  minDate: minDate,
  paymentsByGroup: paymentsByGroup,
  // Variable portion of the state
  selectedFunction: Functions.TotalApplied,
  seriesData: []
}
initialState = selectFunction(initialState, initialState.selectedFunction);

function baseReducer(state = initialState, action) {
  // TODO: Use const action types
  switch(action.type) {
    case 'selectFunction':
      return selectFunction(state, action.selectedFunction);
    default:
      break;
  }

  return state;
}

function selectFunction(state, selectedFunction) {
  var seriesData = [];

  switch(selectedFunction) { // if action == functionChanged, switch action.selectedFunction
    case Functions.InterestAccrued:
      seriesData = InterestAccruedGenerator.call(null, state);
      break;
    case Functions.PrincipalRemaining:
      seriesData = PrincipalRemainingGenerator.call(null, state);
      break;
    case Functions.TotalApplied:
      seriesData = PaymentsAppliedGenerator.call(null, state);
      break;
    default:
      break;
  }

  return {
    ...state,
    selectedFunction: selectedFunction,
    seriesData: seriesData,
  };
}

const store = createStore(baseReducer, initialState);
export default store;
