var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    title: String,
    date: Date,
    description: String,
    href: String,
    tags: [String],
    view: Number,
    available: Boolean,
});
var Article = mongoose.model('article', articleSchema);
module.exports = Article;