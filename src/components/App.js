import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import GraphSvg from './GraphSvg';
import { groups, payments } from '../data.json';

class App extends React.Component {
  render() {
    return (
      <div className="App">
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
              <GraphSvg groups={groups} payments={payments} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
