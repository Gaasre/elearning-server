const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.getAll = function (req, res) {
    User.find({})
        .populate('courses.course_id')
        .exec(function (err, doc) {
            if (err) {
                res.send(err);
            }
            res.json(doc);
        })
};

exports.getId = function (req, res) {
    User.findOne({ _id: req.params.id })
        .populate({
            path: 'courses.course',
            model: 'Course'
       })
        .exec(function (err, doc) {
            if (err) {
                res.send(err);
            }
            res.json(doc);
        })
};

exports.getOne = function (req, res) {
    User.findOne({ _id: req.decoded.id })
        .populate({
            path: 'courses.course',
            model: 'Course'
       })
        .exec(function (err, doc) {
            if (err) {
                res.send(err);
            }
            res.json(doc);
        })
};

exports.add_course_progression = function(req, res) {
    User.updateOne({ _id: req.decoded.id, "courses.course": req.params.id }, {$push: { "courses.$.progression" : req.body.progression }}, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'Successfully updated.'});
        }
    })
}

exports.remove_course_progression = function(req, res) {
    User.updateOne({ _id: req.decoded.id, "courses.course": req.params.id }, {$pull: { "courses.$.progression" : req.body.progression }}, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'Successfully updated.'});
        }
    })
}

exports.new_course = function(req, res) {
    User.updateOne({ _id: req.decoded.id }, {$push: {courses : {
        course: req.body.courseid,
        progression: []
    }}}, function(err, doc) {
        if(err) {
            res.send(err);
        } else {
            res.json({message: 'Successfully enrolled.'});
        }
    });
}

exports.new = function (req, res) {
    let user = new User(req.body);
    console.log(user);
    user.save(function (err, doc) {
        if (err) {
            console.log(err);
            if (err.code === 11000) {
                res.json({
                    error: 'E-mail deja utilisé'
                });
            } else {
                res.json({
                    error: err
                });
            }
        } else {
            var token = jwt.sign({
                id: doc._id,
            }, 'C9HtJO5DgS', {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });
            res.json({
                token: token
            })
        }
    });
};

exports.update = function (req, res) {
    User.findByIdAndUpdate(req.decoded.id, { $set: req.body }, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'Successfully updated.'});
        }
    });
};

exports.delete = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Deleted successfully!');
        }
    })
};

exports.Login = function (req, res) {
    User.findOne({ email: req.body.email }, function (err, doc) {
        if (err) {
            res.send(err);
        }
        if (doc) {
            if (doc.password == req.body.password) {
                var token = jwt.sign({
                    id: doc._id,
                }, 'C9HtJO5DgS', {
                        expiresIn: 60 * 60 * 24 // expires in 24 hours
                    });
                res.json({
                    token: token
                })
            } else {
                res.json({
                    error: 'Mot de passe invalid'
                });
            }
        } else {
            res.json({
                error: 'Email invalide'
            });
        }
    })
};