import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import './Tasklist.css'
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
const month = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(3, 2),
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
}));

export default function MiddleDividers(props) {
  const classes = useStyles();
  var number = props.currentTask.date.substring(5, 7);
  var date = props.currentTask.date.substring(8, 10);
  date = parseInt(date)
  number = parseInt(number)
  number = month[number]
  var priority = props.currentTask.priority

  return (
    <Paper className={classes.root} elevation={6} style={{ display: 'inline-block', margin: 20 }} >
      <div className={classes.section1} >
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography gutterBottom variant="h5">
              {props.currentTask.taskname}
            </Typography>
          </Grid>
          <Grid item xs style={{ position: 'relative', left: '10px' }}>
            <h5 style={{ display: 'inline-block' }}>{number}</h5>
            <Badge style={{ display: 'inline-block' }} badgeContent={date} color="primary">
              <EventAvailableIcon />
            </Badge>
          </Grid>
        </Grid>
        <Typography color="textSecondary" variant="body2">
          {props.currentTask.description}
        </Typography>
      </div>
      <Divider variant="middle" />
      <div className={classes.section2}>
        <div>
          {priority === 1 && <Chip color="primary" label="Important" />}
          {priority === 2 && <Chip color="secondary" label="Immediate" />}
          {priority === 3 && <Chip label="Not-urgent" />}
        </div>
      </div>
      <div className={classes.section3}>
        <Fab style={{ margin: '20px' }} fontSize="small" color="secondary" aria-label="edit">
          <EditIcon onClick={() => { props.editTask(props.currentTask._id) }} />
        </Fab>
        <Fab color="default" aria-label="Delete">
          <DeleteIcon onClick={() => { props.deleteTask(props.currentTask._id) }} />
        </Fab>
      </div>
    </Paper>
  );
}
