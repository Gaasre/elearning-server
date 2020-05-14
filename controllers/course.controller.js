const Course = require('../models/course.model');
const Categorie = require('../models/categorie.model');
const mongoose = require('mongoose');
const multiparty = require('multiparty');
const fs = require('fs');

exports.getAll = function (req, res) {
    Course.find()
        .populate('author')
        .exec(function (err, doc) {
            if (err) {
                res.send(err);
            }
            res.json(doc);
        })
};

exports.getByAuthor = function (req, res) {
    Course.find({ author: req.decoded.id })
        .populate('author')
        .exec(function (err, doc) {
            if (err) {
                res.send(err);
            }
            res.json(doc);
        })
};

exports.getOne = function (req, res) {
    Course.findOne({ _id: req.params.id })
        .populate('author')
        .exec(function (err, doc) {
            if (err) {
                res.send(err);
            }
            res.json(doc);
        })
};

exports.new = function (req, res) {
    console.log(req.body);
    let course = new Course(
        {
            name: req.body.name,
            author: req.decoded.id,
        }
    );
    course.save(function (err, c) {
        Categorie.update(
            { name: req.body.category },
            { $push: { courses: c._id } },
            { upsert: true },
            function (errCat) {
                if (errCat) {
                    res.send(errCat);
                } else {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(c);
                    }
                }
            }
        );

    })
};

exports.update = function (req, res) {
    Course.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            res.json({
                success: true
            });
        }
    });
};

exports.delete = function (req, res) {
    Course.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json({
                success: true
            });
        }
    })
};

exports.removeSection = function (req, res) {
    var section = req.params.section
    Course.update({ author: req.decoded.id, 'content._id': section }, { $pull: { 'content': { '_id': section } } }, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json({
                success: true
            });
        }
    })
};

exports.removeSession = function (req, res) {
    var session = req.params.session;
    Course.update({ author: req.decoded.id, 'content.elements._id': session }, { $pull: { 'content.$.elements': { '_id': session } } }, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.json({
                success: true
            });
        }
    })
};

exports.updateSection = function (req, res) {
    var section = req.params.section
    console.log(req.body);
    Course.update({ author: req.decoded.id, 'content._id': section }, {
        "$set": {
            'content.$.name': req.body.name
        }
    }, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json({
                success: true
            });
        }
    })
};

exports.updateSession = function (req, res) {
    var session = req.params.session;
    var section = req.params.section;
    console.log(session);
    Course.find({ author: req.decoded.id, 'content.elements._id': session }, (err, document) => {
        if (err) {
            res.send(err);
        } else {
            var t = document[0].content.id(section).elements.id(session)
            t.name = req.body.name;
            document[0].save();
            res.json({
                success: true
            });
        }
    })
};

exports.deleteUpload = function (req, res) {
    var session = req.params.session;
    var section = req.params.section;
    Course.find({ 'content.elements._id': session }, (err, document) => {
        var t = document[0].content.id(section).elements.id(session)
        fs.unlink('./public/assets/' + t.video, (error) => {
            t.video = '';
            document[0].save();
            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: 'Succesfully deleted'
                });
            }
        });
    });
}

exports.uploadSession = function (req, res) {
    var session = req.params.session;
    var section = req.params.section;
    //var userid = req.decoded.id;
    var form = new multiparty.Form({
        uploadDir: './public/assets'
    });
    form.parse(req, function (err, fields, files) {
        var extension = files.video[0].path.split('.')[1];
        fs.rename(files.video[0].path, './public/assets/' + fields.name[0] + '.' + extension, function (err) {
            if (err) throw err;
            Course.find({ 'content.elements._id': session }, (err, document) => {
                var t = document[0].content.id(section).elements.id(session)
                t.video = fields.name[0] + '.' + extension;
                document[0].save();
                if (err) {
                    res.send(err);
                } else {
                    res.json({
                        video: fields.name[0] + '.' + extension
                    });
                }
            })
        });

    });
};

exports.deleteDocument = function (req, res) {
    var session = req.params.session;
    var section = req.params.section;
    var doc = req.params.document;
    Course.find({ 'content.elements._id': session }, (err, document) => {
        var t = document[0].content.id(section).elements.id(session).documents;
        var d = t.id(doc);
        console.log(t);
        fs.unlink('./public/assets/' + d.name, (error) => {
            t.remove(doc);
            document[0].save();
            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: 'Succesfully deleted'
                });
            }
        });
    });
}

exports.uploadDocument = function (req, res) {
    var session = req.params.session;
    var section = req.params.section;
    console.log(session);
    console.log(section);
    //var userid = req.decoded.id;
    var form = new multiparty.Form({
        uploadDir: './public/assets'
    });
    form.parse(req, function (err, fields, files) {
        var extension = files.document[0].path.split('.')[1];
        var genName = mongoose.Types.ObjectId();
        var genId = mongoose.Types.ObjectId();
        fs.rename(files.document[0].path, './public/assets/' + genName + '.' + extension, function (err) {
            if (err) throw err;
            Course.find({ 'content.elements._id': session }, (err, document) => {
                console.log(document);
                var t = document[0].content.id(section).elements.id(session).documents;
                t.push({
                    _id: genId,
                    name: genName + '.' + extension
                });
                document[0].save();
                if (err) {
                    res.send(err);
                } else {
                    res.json({
                        name: genName + '.' + extension,
                        _id: genId
                    });
                }
            })
        });

    });
};


exports.newSection = function (req, res) {
    var course = req.params.course
    var section = {
        name: req.body.name,
        _id: mongoose.Types.ObjectId(),
        elements: []
    };
    Course.update({ author: req.decoded.id, _id: course }, { $push: { content: section } }, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json(section);
        }
    })
};

exports.newSession = function (req, res) {
    var course = req.params.course
    var section = req.params.section
    var session = {
        name: req.body.name,
        _id: mongoose.Types.ObjectId(),
        duration: '',
        video: '',
        documents: []
    };
    Course.update({ _id: course, author: req.decoded.id, 'content._id': section }, { $push: { 'content.$.elements': session } }, req.body, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.json(session);
        }
    })
};

exports.addQuestion = function (req, res) {
    var course = req.params.course;
    let question = {
        _id: mongoose.Types.ObjectId(),
        content: req.body.content,
        choices: [],
        answer: null
    }
    Course.findById(course, (err, document) => {
        if (err) {
            res.send(err);
        } else {
            document.questionnaire.push(question);
            document.save();
            res.json(question);
        }
    })
}

exports.updateQuestion = function (req, res) {
    var course = req.params.course;
    var question = req.params.question;
    Course.findById(course, (err, document) => {
        if (err) {
            res.send(err);
        } else {
            document.questionnaire.id(question).content = req.body.content
            document.save();
            res.json({message: 'Succesfully updated'});
        }
    })
}

exports.deleteQuestion = function (req, res) {
    var course = req.params.course;
    var question = req.params.question;
    Course.findById(course, (err, document) => {
        if (err) {
            res.send(err);
        } else {
            document.questionnaire.remove(question);
            document.save();
            res.json({message: 'Succesfully deleted'});
        }
    })
}

exports.addAnswer = function (req, res) {

}

exports.updateAnswer = function (req, res) {

}

exports.deleteAnswer = function (req, res) {

}

exports.addChoice = function (req, res) {

}

exports.updateChoice = function (req, res) {

}

exports.deleteChoice = function (req, res) {

}