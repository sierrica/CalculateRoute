var mongoose = require ('mongoose'),
	bcrypt   = require ('bcryptjs');


var SALT_WORK_FACTOR = 10;

/* Schema */
var UserSchema = new mongoose.Schema ({
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		select: false
	}
});


/* Controlar en los insert/updates si se ha modificado la contraseña para encriptar la nueva contraseña */
UserSchema.pre ('save', function(next) {
	var user = this;                                                // only hash the password if it has been modified (or is new)
	if (! user.isModified('password'))
		return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {          // password changed so we need to hash it (generate a salt)
		if (err)
			return next (err);
		bcrypt.hash (user.password, salt, function(err, hash) {      // hash the password using our new salt
			if (err)
				return next (err);
			user.password = hash;                                    // override the cleartext password with the hashed one
			next();
		});
	});
});

/* Comparar contraseñas */
UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		cb (err, isMatch);
	});
};

module.exports = mongoose.model ('User', UserSchema);