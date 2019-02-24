import * as data from './data.json';
import * as ttranAggregate from './ttran-agg'

var allDatasets = {
  "ttran": {
    data: data,
    display: "Toan"
  },
  "ttranAggregate": {
    data: ttranAggregate,
    display: "Toan (Aggregate)"
  }
}

export default allDatasets
