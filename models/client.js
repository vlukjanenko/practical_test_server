const { Schema, model } = require('mongoose');

const client = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String,
		requried: true
	},
	providers: []
});

module.exports = model('Client', client);
