const Category = require('../models/categorie.model');
const User = require('../models/user.model');
const async = require('async');

exports.getAll = function (req, res) {
    Category.find({})
    .populate('courses')
    .exec(function (err, doc) {
        if (err) {
            res.send(err);
        }
        async.forEach(doc,function(item,callback) {
            item.courses = item.courses.filter(x => x.statut === true);
            User.populate(item.courses,{ "path": "author" },function(err,output) {
                if (err) {
                    res.send(err);
                }
                callback();
            });
        }, function(err) {
            res.json(doc);
        });
    })
};

exports.getOne = function (req, res) {
    Category.findOne({ _id: req.params.id })
    .populate('courses')
    .exec(function (err, doc) {
        if (err) {
            res.send(err);
        }
        res.json(doc);
    })
};

exports.new = function (req, res) {
    console.log(req.body);
    let category = new Category(
        req.body
    );

    category.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Successfully created !');
        }
    })
};

exports.update = function (req, res) {
    Category.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            res.send('Successfully updated.');
        }
    });
};

exports.delete = function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Deleted successfully!');
        }
    })
};