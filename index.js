const express = require('express');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const path = require('path');
const clientsRoutes = require('./routes/clients');
const providersRoutes = require('./routes/providers');

dotenv.config();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', clientsRoutes);
app.use('/api', providersRoutes);
app.use((req, res, next) => res.status(404).send(''));

async function start() {
	try {
		await mongoose.connect((function() {
			let base = "mongodb://";
			if (process.env.DB_SRV) {
				base = "mongodb+srv://"
			}
			if (process.env.DB_USER && process.env.DB_PASS) {
				base = `${base}${process.env.DB_USER}:${process.env.DB_PASS}@`;
			} else if (process.env.DB_USER) {
				base = `${base}${process.env.DB_USER}@`;
			}
			if (process.env.DB_HOST) {
				base = `${base}${process.env.DB_HOST}`;
			} else {
				base = `${base}localhost`;
			}
			if (process.env.DB_NAME) {
				base = `${base}/${process.env.DB_NAME}`;
			} else {
				base = `${base}/majosue_db`;
			}
			return base;
		})(),
		{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
		app.listen(process.env.PORT, () => {
			console.log(`Server is running on port ${process.env.PORT}`);
		});
	} catch (e) {
		console.log(e);
	}
}
start();
