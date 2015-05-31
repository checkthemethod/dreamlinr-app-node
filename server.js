// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/'); // connect to our database



var Goal     = require('./app/models/goal');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});




// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /goals
// ----------------------------------------------------
router.route('/goals')


    // create a goal (accessed at POST http://localhost:8080/api/goals)
    .post(function(req, res) {
        
        var goal = new Goal();      // create a new instance of the Goal model
        goal.name = req.body.name;  // set the goals name (comes from the request)

        // save the goal and check for errors
        goal.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Goal created!' });
        });
        
    })

      // get all the goals (accessed at GET http://localhost:8080/api/goals)
    .get(function(req, res) {
        Goal.find(function(err, goals) {
            if (err)
                res.send(err);

            res.json(goals);
        });
    })


// on routes that end in /goals/:goal_id
// ----------------------------------------------------
router.route('/goals/:goal_id')

    // get the goal with that id (accessed at GET http://localhost:8080/api/goals/:goal_id)
    .get(function(req, res) {
        Goal.findById(req.params.goal_id, function(err, goal) {
            if (err)
                res.send(err);
            res.json(goal);
        });
    })

   // update the goal with this id (accessed at PUT http://localhost:8080/api/goals/:goal_id)
    .put(function(req, res) {

        // use our goal model to find the goal we want
        Goal.findById(req.params.goal_id, function(err, goal) {

            if (err)
                res.send(err);

            goal.name = req.body.name;  // update the goals info

            // save the goal
            goal.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Goal updated!' });
            });

        });
    })

    // delete the goal with this id (accessed at DELETE http://localhost:8080/api/goals/:goal_id)
    .delete(function(req, res) {
        Goal.remove({
            _id: req.params.goal_id
        }, function(err, goal) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);