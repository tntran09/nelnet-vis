import { createStore } from 'redux';
import Datasets from '../data/Datasets';
import InterestAccruedGenerator from '../generators/InterestAccruedGenerator';
import PaymentsAppliedGenerator from '../generators/PaymentsAppliedGenerator';
import PrincipalRemainingGenerator from '../generators/PrincipalRemainingGenerator';
import Functions from '../models/Functions';

// TODO: Select the first dataset in a reducer
// Select the first dataset to initialize the app
var initialData = Datasets[Object.keys(Datasets)[0]].data;
// Run the an empty state through the first two fixed actions to create the initial state
var initialState = loadDatasetOptions(Datasets);
initialState = loadDatasetReducer(initialState, initialData);
initialState = selectFunctionReducer(initialState, initialState.selectedFunction);
const store = createStore(baseReducer, initialState);
export default store;

function baseReducer(state = initialState, action) {
  // TODO: Use const action types
  switch(action.type) {
    case 'loadDataset':
      return loadDatasetReducer(state, Datasets[action.datasetKey].data)
      break;
    case 'selectFunction':
      return selectFunctionReducer(state, action.selectedFunction);
    default:
      break;
  }

  return state;
}

function loadDatasetOptions(datasets) {
  var keys = Object.keys(datasets);
  var options = {};
  for(let k of keys) {
    options[k] = datasets[k].display;
  }

  return {
    selectOptions: options
  };
}

function loadDatasetReducer(state, data) {
  var {groups, payments} = data;

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

  return {
    ...state,
    groups: groupNames,
    maxDate: maxDate,
    minDate: minDate,
    paymentsByGroup: paymentsByGroup,
    // Variable portion of the state depending on the function selected
    selectedFunction: Functions.TotalApplied,
    seriesData: []
  };
}

function selectFunctionReducer(state, selectedFunction) {
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
