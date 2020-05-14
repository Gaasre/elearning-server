const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question = require('./question.model');

let CourseSchema = new Schema({
    name: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    short_desc: { type: String, required: false, default: '' },
    requirements: { type: Array, required: false },
    voice: { type: String, required: false },
    subtitles: { type: String, required: false },
    original_price: { type: Number, required: false },
    price: { type: String, required: false },
    currency: { type: String, required: false },
    rate: { type: Number, required: false },
    description: { type: String, required: false, default: '' },
    enrolled: { type: Number, required: false, default: 0 },
    notes: { type: Number, required: false },
    rate: { type: Number, required: false },
    content: [{ _id: { type: Schema.Types.ObjectId }, name: { type: String }, elements: [{ name: { type: String }, _id: { type: Schema.Types.ObjectId }, duration: { type: String }, documents: [{ name: { type: String }, _id: { type: Schema.Types.ObjectId } }], video: { type: String } }] }],
    statut: { type: Boolean, required: false, default: false },
    questionnaire: {type: [Question], default: []}
});


// Export the model
module.exports = mongoose.model('Course', CourseSchema);