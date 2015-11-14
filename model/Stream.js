var mongoose = require('./db.js')();
module.exports = function() {
    var Stream = mongoose.model('Stream', {
        name: String,
        created_at: Date
    });

    
    return Stream;
}