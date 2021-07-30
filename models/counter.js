const { Schema, model } = require('mongoose');

const counter = new Schema({
	_id: String,
	index: Number
});

module.exports = model('Counter', counter);
