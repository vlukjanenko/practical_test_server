const express = require('express')
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const path = require('path');
const PORT = 3000;
const MONGODB_URI = `mongodb+srv://vlad:fL2FbWdH9zG3P6P@cluster0.2qtsg.mongodb.net/practical`
const clientsRoutes = require('./routes/clients');
const providersRoutes = require('./routes/providers');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', clientsRoutes);
app.use('/api', providersRoutes);
app.use((req, res, next) => res.status(404).send(''));

async function start() {
	try {
		await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (e) {
		console.log(e);
	}
}
start();
