const {Schema, model} = require('mongoose');

const provider = new Schema({
	_id: Number,
	name: {
		type: String,
		required: true,
		unique: true
	}
});

module.exports = model('Provider', provider);
