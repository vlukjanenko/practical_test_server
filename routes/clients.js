const {Router} = require('express');
const router = Router();
const Client = require('../models/client');
const Provider = require('../models/provider');

/*
**	Get clients list
*/

router.get('/clients', async(req, res) => {
	let clients;
	let response = [];

	try {
		clients = await Client.find();
	} catch (e) {
		return res.status(500).json({message: "Server error"});
	}
	for (let i = 0; i < clients.length; i++) {
		response.push({
			name: clients[i].name,
			email: clients[i].email,
			phone: clients[i].phone,
			providers: clients[i].providers
		})
	}
	response.sort(function(a, b) {
		return a.name.localeCompare(b.name);
	  });
	return res.status(200).json(response);
})

/*
**	Add clietnt
*/

router.post('/clients', async(req, res) => {
	let newClient = await Client.findOne({email: req.body.email});
	if (newClient) {
		return res.status(400).json({message: "Client with email '" + req.body.email + "' already exist" });
	}

	let existProviders = [];
	for (i = 0; i < req.body.providers.length; i++) {
		let p = await Provider.findOne({_id: req.body.providers[i].id});
		if (p) {
			existProviders.push(req.body.providers[i]);
		}
	}

	newClient = new Client ({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		providers: existProviders
	});

	try {
		await newClient.save();
	} catch (e) {
		return res.status(500).json({message: "Server error"});
	}

	return res.status(201).json({ name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		providers: existProviders });
});

/*
**	Edit client
*/

router.put('/clients/:email', async(req, res) => {
	let client;
	let editedClient;

	try {
		client = await Client.findOne({ email: req.params.email });
		editedClient = await Client.findOne({ email: req.body.email });
	} catch (err) {
		return res.status(500).json({message: "Server error"});
	}
	if (!client) {
		return res.status(400).json({message: "Client not exist"});
	}
	if (editedClient && editedClient.email !== client.email) {
		return res.status(400).json({message: "Client with email: '" + req.body.email + "' already exist"});
	}

	let existProviders = [];
	for (i = 0; i < req.body.providers.length; i++) {
		let p = await Provider.findOne({_id: req.body.providers[i].id});
		if (p) {
			existProviders.push(req.body.providers[i]);
		}
	}

	client.name = req.body.name;
	client.email = req.body.email;
	client.phone = req.body.phone;
	client.providers = existProviders;

	try {
		await client.save();
	} catch (e) {
		return res.status(500).json({message: "Server error"});
	}

	return res.status(200).json({
		name: client.name,
		email: client.email,
		phone: client.phone,
		providers: client.providers
	});
})


/*
**	Delete client
*/

router.delete('/clients/:email', async (req, res) => {
	let client;

	try {
		client = await Client.findOne({ email: req.params.email });
		await Client.deleteOne({ email: req.params.email });
	} catch (err) {
		return res.status(500).json({message: "Server error"});
	}
	if (!client) {
		return res.status(400).json({message: "Client with email: '" + req.params.email + "' not exist"});
	}
	return res.status(200).json({
		name: client.name,
		email: client.email,
		phone: client.phone,
		providers: client.providers
	});
})

module.exports = router;
