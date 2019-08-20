import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import GraphSvg from './GraphSvg';
import Functions from '../models/Functions';
import store from '../stores/store';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    store.subscribe(() => this.setState(store.getState()));
  }

  _buildDataSelector(options) {
    var selectOptions = [];
    var keys = Object.keys(options);
    for(let key of keys) {
      selectOptions.push(
        <MenuItem key={key} value={key}>{options[key]}</MenuItem>
      )
    }

    return selectOptions;
  }

  _selectDataset(event) {
    store.dispatch({
      type: 'loadDataset',
      selectedDataset: event.target.value
    });
  }

  _selectFunction(functionName) {
    store.dispatch({
      type: 'selectFunction',
      selectedFunction: functionName
    });
  }

  render() {
    var selectOptions = this._buildDataSelector(this.state.selectOptions);
    return (
      <div className="App" style={{overflow:'hidden'}}>
        <Grid container spacing={16}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit">Nelnet Vis</Typography>
            </Toolbar>
          </AppBar>

          <Grid item xs={3}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Paper style={{padding: '16px'}}>
                  <FormControl>
                  <InputLabel htmlFor="dataset-selector-placeholder" shrink>Data set</InputLabel>
                  <Select name="selectedDataset" value={this.state.selectedDataset} onChange={this._selectDataset.bind(this)}>
                    {selectOptions}
                  </Select>
                  </FormControl>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper>
                  <MenuList>
                    <MenuItem onClick={this._selectFunction.bind(this, Functions.TotalApplied)} selected={this.state.selectedFunction === Functions.TotalApplied}>Payments Applied</MenuItem>
                    <MenuItem onClick={this._selectFunction.bind(this, Functions.PrincipalRemaining)} selected={this.state.selectedFunction === Functions.PrincipalRemaining}>Principal Remaining</MenuItem>
                    <MenuItem onClick={this._selectFunction.bind(this, Functions.InterestAccrued)} selected={this.state.selectedFunction === Functions.InterestAccrued}>Interest Accrued</MenuItem>
                  </MenuList>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={8}>
            <Paper>
              <GraphSvg />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
