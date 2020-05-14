const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let QuestionSchema = new Schema({
    content: { type: String },
    choices: [{ _id: { type: Schema.Types.ObjectId, contenu: { type: String } } }],
    answer: { type: Schema.Types.ObjectId }
});


// Export the model
module.exports = QuestionSchema;