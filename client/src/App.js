import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Chip from '@material-ui/core/Chip';
import Tasklist from './components/Tasklist';
import axios from 'axios';

//Alert component
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class App extends React.Component {

  state = {
    openForm: false,
    date: new Date(),
    _id: '',
    taskname: '',
    description: '',
    openAlert: false,
    openAlert1: false,
    isEditing: false,
    showBackdrop: true,
    priority: 1,
    tasks: []

  }

  componentDidMount() {

    this.updateTasks();

  }

  //When the application starts

  updateTasks = () => {
    axios.get('https://apricot-cake-12061.herokuapp.com/get')
      .then(response => {
        this.setState({
          tasks: response.data,
          showBackdrop: false
        })
      })
      .catch(err => console.log(err))
    this.getTasks(this.state.tasks)
  }


  //save tasks 
  submit = () => {

    this.setState({
      openAlert: true,
      showBackdrop: true,
      openForm: false
    })

    const task = {
      taskname: this.state.taskname,
      description: this.state.description,
      date: this.state.date,
      priority: this.state.priority
    }

    console.log(task)

    axios.post('https://apricot-cake-12061.herokuapp.com/save', task)
      .then(response => {
        console.log(response.data)

        this.setState({
          taskname: '',
          description: '',
          date: new Date(),
          priority: 1,
          showBackdrop: false
        })

        this.updateTasks();
      })
      .catch(err => console.log(err))



    console.log(this.state.tasks)

  }
  
  //Editing the task
  submitEdit = () => {

    this.setState({
      openAlert: true,
      showBackdrop: true,
      isEditing: false,
    })

    const task = {
      id: this.state._id,
      taskname: this.state.taskname,
      description: this.state.description,
      date: this.state.date,
      priority: this.state.priority
    }


    axios.post('https://apricot-cake-12061.herokuapp.com/edit/', task)
      .then(response => {
        this.setState({
          showBackdrop: false
        })
        this.updateTasks();
      })
      .catch(err => console.log(err))

    this.setState({
      openForm: false,
      taskname: '',
      description: '',
      date: new Date(),
      priority: 1
    })

  }

  //Deleting task
  deleteTask = (id) => {
    axios.delete('https://apricot-cake-12061.herokuapp.com/delete/' + id)
      .then(response => {
        console.log(response.data)
        this.setState({
          openAlert1: true
        })

      })
      .catch(err => console.log(err));

    this.setState({
      tasks: this.state.tasks.filter(el => el._id !== id)
    })

  }

  //Getting the editable data in the client
  editTask = (id) => {

    this.setState({
      showBackdrop: true,
      isEditing: true
    })
    axios.get('https://apricot-cake-12061.herokuapp.com/update/' + id)
      .then(res => {
        this.setState({
          taskname: res.data.taskname,
          description: res.data.description,
          date: res.data.date,
          priority: res.data.priority,
          _id: res.data._id,
          openForm: true,
          showBackdrop: false
        })
      })

  }

  //closing the form and alert
  handleClose = () => {
    this.setState({
      openForm: false,
      isEditing: false,
      taskname: '',
      description: '',
      date: new Date(),
      priority: 1

    })
  }
  //Date change
  handleChangeDate = (date1) => {
    this.setState({
      date: date1
    })
  }

  //success alert
  handleCloseAlert = () => {
    this.setState({
      openAlert: false
    })
  }

  //deleted alert
  handleCloseAlert1 = () => {
    this.setState({
      openAlert1: false
    })
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  //opening the dialog box
  handleClickOpen = () => {
    this.setState({
      openForm: true
    })
  }

  //Calling tasklist component
  getTasks = (tasks) => {
    if (!tasks.length) return <h3>No tasks yet...Create one</h3>
    else {
      return tasks.map((task, index) => {
        return <Tasklist key={index} currentTask={task} taskname={task.taskname} editTask={this.editTask} deleteTask={this.deleteTask} />
      })
    }
  }

  render() {
    return (
      <div className="App" >

        <Container maxWidth="lg" style={{ alignContent: "center" }}>
          <h1 >Task Management</h1>

          <div>
            <h3> Lists of Tasks</h3>
            <hr />
            {this.getTasks(this.state.tasks)}
          </div>
        </Container>
        <Fab color="primary" aria-label="add" style={{
          position: 'absolute',
          top: '100px', right: '40px'
        }} onClick={this.handleClickOpen} >
          <AddIcon />
        </Fab>
        <Dialog open={this.state.openForm} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Plan your Day with some Task
          </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="taskname"
              label="Task Name"
              variant="outlined"
              value={this.state.taskname}
              onChange={this.handleChange}
              fullWidth
              required
            />

            <TextField
              margin="dense"
              name="description"
              label="Task Description"
              variant="outlined"
              value={this.state.description}
              onChange={this.handleChange}
              fullWidth

              required
            />
            <br />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="outlined"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Due Date"
                value={this.state.date}
                onChange={this.handleChangeDate}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                minDate={new Date()}
                fullWidth

              />
            </MuiPickersUtilsProvider>
            <br />
            <br />
            <InputLabel id="demo-simple-select-outlined-label">Priority</InputLabel>
            <Select
              style={{ width: "100%" }}
              variant="outlined"
              name="priority"
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={this.state.priority}
              onChange={this.handleChange}
              fullWidth
              label="priority"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}><Chip color="primary" label="Important" /></MenuItem>
              <MenuItem value={2}><Chip color="secondary" label="Immediate" /></MenuItem>
              <MenuItem value={3}><Chip label="Not-urgent" /></MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            {!this.state.isEditing && <Button variant="contained" color="primary" onClick={this.submit}>
              Create
        </Button>
            }
            {this.state.isEditing && <Button variant="contained" color="primary" onClick={this.submitEdit}>
              Save
        </Button>}
            <Button variant="contained" color="secondary" onClick={this.handleClose}>
              Cancel
        </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={this.state.openAlert} autoHideDuration={6000} onClose={this.handleCloseAlert}>
          <Alert onClose={this.handleCloseAlert} severity="success">
            Task has been created!
        </Alert>
        </Snackbar>
        <Snackbar open={this.state.openAlert1} autoHideDuration={6000} onClose={this.handleCloseAlert1}>
          <Alert onClose={this.handleCloseAlert1} severity="error">
            Task has been Deleted!
        </Alert>
        </Snackbar>
        <Backdrop open={this.state.showBackdrop} style={{ zIndex: 1, color: '#fff' }} onClick={() => this.setState({ showBackdrop: false })}>
          <CircularProgress color="inherit" />
        </Backdrop>


      </div>
    );
  }
}

export default App;
