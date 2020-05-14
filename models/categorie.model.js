const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorieSchema = new Schema({
    name: {type: String, required: true},
    courses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
});


// Export the model
module.exports = mongoose.model('Categorie', CategorieSchema);