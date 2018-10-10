/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const accomplishment = require("./model/accomplishments.js");
const user = require("./model/users.js");
const seedUsers = require("./data/seedUsers.js");

const app = express();
const router = express.Router();

// This sets the port of the server to be 9002
const port = process.env.API_PORT || 9002;

/*
 * This sets the database the server is connected to, to be ixAccomplishments in MongoDB
 * this will work even if ixAccomplishments does not exists yet in MongoDB
 */
mongoose.connect("mongodb://localhost/ixAccomplishments", (err, db) => {

    if (err) {

        console.log("Unable to connect to the database. Please start the database. Error:", err);

    }

});

app.use(cors());
app.use(bodyParser.urlencoded({"extended": true}));
app.use(bodyParser.json());

app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader("Cache-Control", "no-cache");
    next();

});

// Use the route /api as the parent for the router
app.use("/api", router);

// Check http://localhost:9002/api  to see if the API is live
router.get("/", (req, res) => {

    res.status(200).json({"message": "API Initialized!"});

});

// This route allows accomplishments to be retrived and created
router.route("/accomplishments").get((req, res) => {

    accomplishment.find((err, accomplishments) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        res.status(200).json(accomplishments);

    });

}).
    post((req, res) => {

        const new_accomplishment = new accomplishment();

        new_accomplishment.acknowledger = req.body.acknowledger;
        new_accomplishment.acknowledged = req.body.acknowledged;
        new_accomplishment.acknowledgedImg = req.body.acknowledgedImg;
        new_accomplishment.message = req.body.message;
        new_accomplishment.department = req.body.department;
        new_accomplishment.save((err) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(new_accomplishment);

        });

        user.find({"fullName": req.body.acknowledger}, (err, user) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            user[0].given++;
            user[0].points = user[0].points + 50;
            user[0].updated = Date.now();
            user[0].save((err) => {

                if (err) {

                    res.status(500).json({"error": err});

                }

            });

        });

        user.find({"fullName": req.body.acknowledged}, (err, user) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            user[0].received++;
            user[0].points = user[0].points + 50;
            user[0].updated = Date.now();
            user[0].save((err) => {

                if (err) {

                    res.status(500).json({"error": err});

                }

            });

        });

    });

// This route allows routes to be modified and deleted based on the accomplishment_id passed in
router.route("/accomplishments/:accomplishment_id").put((req, res) => {

    accomplishment.findById(req.params.accomplishment_id, (err, accomplishment) => {

        if (err) {

            res.status(500).json({"error": err});

        }

        if (req.body.acknowledger) {

            if (req.body.acknowledger !== accomplishment.acknowledger) {

                user.find({"fullName": req.body.acknowledger}, (err, user) => {

                    if (err) {

                        res.status(500).json({"error": err});

                    }
                    user[0].given++;
                    user[0].points = user[0].points + 50;
                    user[0].updated = Date.now();
                    user[0].save((err) => {

                        if (err) {

                            res.status(500).json({"error": err});

                        }

                    });

                });

                user.find({"fullName": accomplishment.acknowledger}, (err, user) => {

                    if (err) {

                        res.status(500).json({"error": err});

                    }
                    user[0].given--;
                    user[0].points = user[0].points - 50;
                    user[0].updated = Date.now();
                    user[0].save((err) => {

                        if (err) {

                            res.status(500).json({"error": err});

                        }

                    });

                });

            }

        }

        if (req.body.acknowledged) {

            if (req.body.acknowledged !== accomplishment.acknowledged) {

                user.find({"fullName": req.body.acknowledged}, (err, user) => {

                    if (err) {

                        res.status(500).json({"error": err});

                    }
                    user[0].received++;
                    user[0].points = user[0].points + 50;
                    user[0].updated = Date.now();
                    user[0].save((err) => {

                        if (err) {

                            res.status(500).json({"error": err});

                        }

                    });

                });

                user.find({"fullName": accomplishment.acknowledged}, (err, user) => {

                    if (err) {

                        res.status(500).json({"error": err});

                    }
                    user[0].received--;
                    user[0].points = user[0].points - 50;
                    user[0].updated = Date.now();
                    user[0].save((err) => {

                        if (err) {

                            res.status(500).json({"error": err});

                        }

                    });

                });

            }

        }

        req.body.acknowledger ? accomplishment.acknowledger = req.body.acknowledger : null;
        req.body.acknowledged ? accomplishment.acknowledged = req.body.acknowledged : null;
        req.body.acknowledgedImg ? accomplishment.acknowledgedImg = req.body.acknowledgedImg : null;
        req.body.message ? accomplishment.message = req.body.message : null;
        req.body.department ? accomplishment.department = req.body.department : null;
        accomplishment.updated = Date.now();
        accomplishment.save((err) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(accomplishment);

        });

    });

}).
    delete((req, res) => {

        accomplishment.find({"_id": req.params.accomplishment_id}, (err, accomplishment) => {

            if (err) {

                res.status(500).json({"error": err});

            }

            user.find({"fullName": accomplishment[0].acknowledger}, (err, user) => {

                if (err) {

                    res.status(500).json({"error": err});

                }
                user[0].given--;
                user[0].points = user[0].points - 50;
                user[0].updated = Date.now();
                user[0].save((err) => {

                    if (err) {

                        res.status(500).json({"error": err});

                    }

                });

            });

            user.find({"fullName": accomplishment[0].acknowledged}, (err, user) => {

                if (err) {

                    res.status(500).json({"error": err});

                }
                user[0].received--;
                user[0].points = user[0].points - 50;
                user[0].updated = Date.now();
                user[0].save((err) => {

                    if (err) {

                        res.status(500).json({"error": err});

                    }

                });

            });

        });


        accomplishment.remove({"_id": req.params.accomplishment_id}, (err, accomplishment) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json({"message": "The acknowledgement has been deleted"});

        });

    });

// This route allows users to be retrieved and created
router.route("/users").get((req, res) => {

    user.find(
        {}, // Filter
        {"_id": 0}, // Columns to return
        {"sort": {"firstName": 1}},
        (err, user) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(user);

        }
    );

}).
    post((req, res) => {

        const new_user = new user();

        new_user.firstName = req.body.firstName;
        new_user.lastName = req.body.lastName;
        new_user.fullName = `${req.body.firstName} ${req.body.lastName}`;
        new_user.department = req.body.department;
        new_user.email = req.body.email;
        new_user.save((err) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(new_user);

        });

    });

// This route allows users to be modified and deleted based on the full_name passed in
router.route("/users/:full_name").put((req, res) => {

    user.find({"fullName": req.params.full_name}, (err, user) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        req.body.firstName ? user.firstName = req.body.firstName : null;
        req.body.lastName ? user.lastName = req.body.lastName : null;
        req.body.fullName ? user.fullName = `${req.body.firstName} ${req.body.lastName}` : null;
        req.body.department ? user.department = req.body.department : null;
        req.body.email ? user.email = req.body.email : null;
        user.updated = Date.now();
        user.save((err) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(users);

        });

    });

}).
    delete((req, res) => {

        user.remove({"_id": req.params._id}, (err, user) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json({"message": "The user has been deleted"});

        });

    });

// This route gets the user information
router.route("/getuser/:full_name").get((req, res) => {

    user.find({"fullName": req.params.full_name}, (err, user) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        res.status(200).json(user);

    });

});

// This route gets the user information
router.route("/getuserbyemail/:email").get((req, res) => {

    user.find({"email": req.params.email}, (err, user) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        res.status(200).json(user);

    });

});

// This route uses the seedUsers.js file to populate the users table in MongoDB
router.route("/loadseeddata").get((req, res) => {

    const count = 0;

    for (i = 0; i < seedUsers.length; i++) {

        user.findOneAndUpdate(
            {"fullName": seedUsers[i].fullName},
            seedUsers[i], {
                "upsert": true,
                "new": true
            },
            (err, user) => {

                if (err) {

                    res.status(500).json({"error": err});

                }

            }
        );

    }
    user.count({}, (err, count) => {

        res.status(200).json({"message": `The database now has ${count} user records`});

    });

});

// This route retrives all the full names of the users stored in MongoDB
router.route("/fullnames").get((req, res) => {

    user.find({}, {
        "_id": 0,
        "fullName": 1
    }, {"sort": {"firstName": 1}}, (err, user) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        res.status(200).json(user);

    });

});

/*
 * This route retrives all the departments of the users stored in MongoDB and returns them as an
 * array of strings
 */
router.route("/departments").get((req, res) => {

    user.distinct("department", (err, department) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        res.status(200).json(department);

    });

});

/*
 * This route returns a list of all accomplishments where the user is the one being
 * acknowledged. This list is sorted by the update timestamp.
 *
 * For use in profile
 */
router.route("/recentrecognized/:acknowledged").get((req, res) => {

    accomplishment.find(
        {"acknowledged": req.params.acknowledged}, {}, {"sort": {"updated": -1}},
        (err, acknowledgments) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(acknowledgments);

        }
    );

});

// This route returns the top 5 users who have received acknowledgement based on the numbers received
router.route("/previewmostrecognized").get((req, res) => {

    user.find(
        {"received": {"$gt": 0}}, // Filter
        {}, // Columns to return
        {
            "limit": 5, // Other filters
            "sort": {
                "received": -1,
                "updated": -1
            }
        },
        (err, user) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(user);

        }
    );

});

// This route returns the recent users that received acknowledgements by timestamp based on the department given
router.route("/mostrecognized/:department").get((req, res) => {

    if (req.params.department === "All") {

        user.find(
            {"received": {"$gt": 0}}, // Filter
            {}, // Columns to return
            { // Other filters
                "sort": {
                    "received": -1,
                    "updated": -1
                }
            },
            (err, user) => {

                if (err) {

                    res.status(500).json({"error": err});

                }
                res.status(200).json(user);

            }
        );

    } else {

        user.find(
            {
                "received": {"$gt": 0},
                "department": req.params.department
            }, // Filter
            {}, // Columns to return
            { // Other filters
                "sort": {
                    "received": -1,
                    "updated": -1
                }
            },
            (err, user) => {

                if (err) {

                    res.status(500).json({"error": err});

                }
                res.status(200).json(user);

            }
        );

    }

});

/*
 * This route returns a list of all accomplishments where the user is acknowledging others.
 * This list is sorted by the update timestamp.
 *
 * For use in profile
 */
router.route("/recentrecognitions/:acknowledger").get((req, res) => {

    accomplishment.find(
        {"acknowledger": req.params.acknowledger}, {}, {"sort": {"updated": -1}},
        (err, acknowledgments) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(acknowledgments);

        }
    );

});

// This route returns the top 5 users who have given acknowledgement based on the numbers given
router.route("/previewmostrecognitions").get((req, res) => {

    user.find(
        {"given": {"$gt": 0}}, // Filter
        {}, // Columns to return
        {
            "limit": 5, // Other filters
            "sort": {
                "given": -1,
                "updated": -1
            }
        },
        (err, user) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(user);

        }
    );

});

// This route returns the recent users that had given acknowledgements by timestamp based on the department given
router.route("/mostrecognitions/:department").get((req, res) => {

    if (req.params.department === "All") {

        user.find(
            {"given": {"$gt": 0}}, // Filter
            {}, // Columns to return
            { // Other filters
                "sort": {
                    "given": -1,
                    "updated": -1
                }
            },
            (err, user) => {

                if (err) {

                    res.status(500).json({"error": err});

                }
                res.status(200).json(user);

            }
        );

    } else {

        user.find(
            {
                "given": {"$gt": 0},
                "department": req.params.department
            }, // Filter
            {}, // Columns to return
            { // Other filters
                "sort": {
                    "given": -1,
                    "updated": -1
                }
            },
            (err, user) => {

                if (err) {

                    res.status(500).json({"error": err});

                }
                res.status(200).json(user);

            }
        );

    }

});

// This route returns the top 10 most recent acknowledgments that were given
router.route("/previewrecentaccomplishments").get((req, res) => {

    accomplishment.find(
        {}, // Filter
        {}, // Columns to return
        {
            "limit": 10, // Other filters
            "sort": {"updated": -1}
        },
        (err, accomplishments) => {

            if (err) {

                res.status(500).json({"error": err});

            }
            res.status(200).json(accomplishments);

        }
    );

});

// This route returns the recent acknowledgments that were given based on the department given
router.route("/recentaccomplishments/:department").get((req, res) => {

    if (req.params.department === "All") {

        accomplishment.find(
            {}, // Filter
            {}, // Columns to return
            { // Other filters
                "sort": {"updated": -1}
            },
            (err, accomplishments) => {

                if (err) {

                    res.status(500).json({"error": err});

                }
                res.status(200).json(accomplishments);

            }
        );

    } else {

        accomplishment.find(
            {"department": req.params.department}, // Filter
            {}, // Columns to return
            { // Other filters
                "sort": {"updated": -1}
            },
            (err, accomplishments) => {

                if (err) {

                    res.status(500).json({"error": err});

                }
                res.status(200).json(accomplishments);

            }
        );

    }

});

// This route returns all the full names of users belonging to a specific department
router.route("/usersfromdepartment/:department").get((req, res) => {

    user.find({"department": req.params.department}, {
        "_id": 0,
        "fullName": 1
    }, {"sort": {"fullName": 1}}, (err, users) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        res.status(200).json(users);

    });

});

// This route returns the department of user the specifed user belongs to
router.route("/departmentfromuser/:user").get((req, res) => {

    user.find({"fullName": req.params.user}, {
        "_id": 0,
        "department": 1
    }, {}, (err, department) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        res.status(200).json(department);

    });

});

// This route returns the image of the specified user
router.route("/imagefromuser/:user").get((req, res) => {

    user.find({"fullName": req.params.user}, {
        "_id": 0,
        "image": 1
    }, {}, (err, image) => {

        if (err) {

            res.status(500).json({"error": err});

        }
        res.status(200).json(image);

    });

});

// This route will REMOVE EVERYTHING

router.route("/factoryreset").delete((req, res) => {

    user.remove({}, (err, user) => {

        if (err) {

            res.status(500).json({"error": err});

        }

    });

    accomplishment.remove({}, (err, user) => {

        if (err) {

            res.status(500).json({"error": err});

        }

    });

    res.status(200).json({"message": "All users and accomplishments have been deleted."});


});

app.listen(port, () => {
    // Console.log('api running on port ' + port);
});