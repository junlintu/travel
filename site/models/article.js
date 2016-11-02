var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
	articleId: Number,
    title: String,
    date: Date,
    description: String,
    href: String,
    tags: [String],
    view: Number,
    available: Boolean,
    content:String,
});
var Article = mongoose.model('article', articleSchema);
module.exports = Article;