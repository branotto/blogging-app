const mongoose = require('mongoose');

//blog post schema
const blogPostSchema = mongoose.Schema(
    {
        title : {type: String, required: true},
        content : {type: String, required: true},
        author : {
            firstName : String,
            lastName : String,
        },
        created : {type: Date, required: true},
    });



//virtual method to return the author name as a string
blogPostSchema.virtual('authorName').get(function()
{
    return `${this.author.firstName} ${this.author.lastName}`.trim()
}); 


//serialize instance method for generating a return object
blogPostSchema.methods.serialize = function()
{
    return {
        id: this._id,
        title: this.title,
        author: this.authorName,
        content: this.content,
        created: this.created
    };
}

const BlogPosts = mongoose.model('BlogPosts', blogPostSchema);

module.exports = {BlogPosts};