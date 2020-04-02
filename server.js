const express = require('express');

const app = express();
const path = require('path');
const router = express.Router();
const PORT = process.env.PORT || 8080;
var cors = require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});





//Model for MongoDB
const mongoose = require('mongoose')

const Task = mongoose.Schema;

const myTask = new Task({
    taskname: String,
    description: String,
    date: Date,
    priority: Number

},
    {
        timestamps: true,
    });

const DataSave = mongoose.model('Todo', myTask);

// end of the model 


var dotenv = require('dotenv');

dotenv.config();

//Mongodb connection establishment
mongoose.connect(process.env.MONGODB_URI || 'your mongodb Uri', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

//for production build
if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));


}



//handling endpoints for client request
app.get('/get', (req, res) => {

    DataSave.find({})
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

app.post('/save', (req, res) => {
    const data = req.body;
    console.log(data)
    const newData = new DataSave(data);

    newData.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        return res.json({
            msg: 'Your data has been saved!!!!!!'
        });
    });
})

app.delete('/delete/:id', (req, res) => {
    DataSave.findByIdAndDelete(req.params.id)
        .then(() => res.json('task deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/update/:id', (req, res) => {
    DataSave.findById(req.params.id)
        .then((data) => { res.json(data) })
        .catch(err => console.log(err))
})

app.post('/edit', (req, res) => {
    const id = req.body.id;
    DataSave.find({ "_id": id })
        .then(data => {
            data[0].taskname = req.body.taskname;
            data[0].description = req.body.description;
            data[0].date = req.body.date;
            data[0].priority = req.body.priority;

            data[0].save()
                .then(() => res.json('code updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});



