
var mongoose = require ('mongoose'),
    User     = require ('../app/server/users/models/user.server.model');


var testUserId = mongoose.Types.ObjectId();

User.find({}).remove(function() {
    User.create({
            _id: testUserId,
            provider: 'local',
            name: 'Test',
            email: 'test@test.com',
            password: 'test'
        }, function() {
            logger.debug ('USUARIO TEST "LOCAL" CREADO');
        }
    );
});