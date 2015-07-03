var mongoose = require ('mongoose'),
	bcrypt   = require ('bcryptjs');


var SALT_WORK_FACTOR = 10;

var authTypes = ['github', 'twitter', 'facebook', 'google'];

var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};


/* Schema */
var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		validate: [validateLocalStrategyProperty, 'Please fill in your name']
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		lowercase: true,
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	password: {
		type: String,
		required: true
	},
	salt: {
		type: String
	},
	avatar: {
		type: String,
		default: 'https://raw.githubusercontent.com/martinmicunda/employee-scheduling-ui/master/src/images/anonymous.jpg?123456'
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	}
});


/* Validadores */
UserSchema
	.path('email')
	.validate(function(email) {
		if (authTypes.indexOf(this.provider) !== -1) return true;
		return email.length;
	}, 'Email cannot be blank');

UserSchema
	.path('password')
	.validate(function(password) {
		if (authTypes.indexOf(this.provider) !== -1) return true;
		return password.length;
	}, 'Password cannot be blank');

UserSchema
	.path('email')
	.validate(function(value, respond) {
		var self = this;
		this.constructor.findOne({email: value}, function(err, user) {
			if(err) throw err;
			if(user) {
				if(self.id === user.id) return respond(true);
				return respond(false);
			}
			respond(true);
		});
	}, 'The specified email address is already in use.');


/* Controlar en los insert/updates si se ha modificado la contraseña para encriptar la nueva contraseña */
UserSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) { return next(); }

	// password changed so we need to hash it (generate a salt)
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) { return next(err); }

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) { return next(err); }

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

/* Comparar contraseñas */
UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		cb(err, isMatch);
	});
};

module.exports = mongoose.model ('User', UserSchema);