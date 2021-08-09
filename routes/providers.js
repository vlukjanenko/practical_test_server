const {Router} = require('express');
const router = Router();
const Provider = require('../models/provider');
const Counter = require('../models/counter');

/*
**	Get providers list
*/

router.get('/providers', async(req, res) => {
	let providers;
	let response = [];

	try {
		providers = await Provider.find();
	} catch (e) {
		res.status(500).json({message: "Server error"});
	}
	for (let i = 0; i < providers.length; i++) {
		response.push({id: providers[i]._id, name: providers[i].name});
	}
	response.sort(function(a, b) {
		return a.name.localeCompare(b.name);
	  });
	return res.status(200).json(response);
})

/*
**	Add new provider
*/

router.post('/providers', async(req, res) => {

	let newProvider = await Provider.findOne({ name: req.body.name });
	if (newProvider) {
		return res.status(400).json({message: 'Provider already exist'});
	}

	let counter = await Counter.findById("counterId");
	if (!counter) {
		try {
			counter = await Counter.create({ _id: "counterId", index: 0});
		} catch(e) {
			console.log(e);
			return res.status(500).json({message: 'Server error'});
		}
	}
	counter.index++;
	try {
		await counter.save();
		await Provider.create({_id: counter.index, name: req.body.name});
	}
	catch (e) {
		res.status(500).json({message: 'Server error'});
	}
	return res.status(201).json({id: counter.index, name: req.body.name});
})

/*
**	Edit provider
*/

router.put('/providers/:id', async(req, res) => {
	let provider;
	let newName;

	try {
		provider = await Provider.findOne({ _id: req.params.id });
		newName = await Provider.findOne({ name: req.body.name });
	} catch (err) {
		return res.status(500).json({message: "Server error"});
	}
	if (!provider) {
		return res.status(400).json({message: "Provider not exist"});
	}
	if (newName && newName._id != provider._id) {
		return res.status(400).json({message: "Provider name: '" + req.body.name + "' already exist"});
	}
	provider.name = req.body.name;
	try {
		await provider.save();
	} catch (e) {
		return res.status(500).json({message: "Server error"});
	}

	return res.status(200).json({
		id: provider._id,
		name: provider.name
	});
})

/*
**	Delete provider
*/

router.delete('/providers/:id', async(req, res) => {
	let provider;

	try {
		provider = await Provider.findOne({ _id: req.params.id });
		await Provider.deleteOne({ _id: req.params.id });
	} catch (err) {
		return res.status(500).json({message: "Server error"});
	}
	if (!provider) {
		return res.status(200).json({message: "Provider not exist"});
	}
	return res.status(200).json({
		id: provider._id,
		name: provider.name
	});
})

module.exports = router;
