import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import GraphSvg from './GraphSvg';
import store from '../stores/store';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
  }

  render() {
    return (
      <div className="App" style={{overflow:'hidden'}}>
        <Grid container spacing={16}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit">Nelnet Vis</Typography>
            </Toolbar>
          </AppBar>

          <Grid item xs={3}>
            <Paper>
              <MenuList>
                <MenuItem selected={true}>Payments Applied</MenuItem>
                <MenuItem>Principal Remaining</MenuItem>
                <MenuItem>Applied to Interest</MenuItem>
              </MenuList>
            </Paper>
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
