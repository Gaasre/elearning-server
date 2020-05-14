const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let nestedCourseSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', unique: true },
    progression: { type: Array }
});

let UserSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    about: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    function: { type: String, default: '' },
    website: { type: String, default: '' },
    courses: {type: [nestedCourseSchema], default: [], unique: false}
});


// Export the model
module.exports = mongoose.model('User', UserSchema);