import { createStore } from 'redux';
import { groups, payments } from '../data/data.json';
const initialState = {

}

function baseReducer(state = initialState, action) {
  return state;
}

const store = createStore(baseReducer, initialState);

export default store;
