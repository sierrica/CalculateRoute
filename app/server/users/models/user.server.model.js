
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: 'testing error message',
        required: 'Please fill in a username',
        trim: true
    }
});

mongoose.model('User', UserSchema);
