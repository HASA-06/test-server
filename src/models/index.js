import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import databaseConfig from '../../config/database.js';

console.log('::: Schema set :::\nSub models will be injected to base model');

const sequelize = new Sequelize(
	databaseConfig.schema,
	databaseConfig.username,
	databaseConfig.password,
	{
		host: databaseConfig.host,
		dialect: databaseConfig.dialect,
		logging: false,
		pool: {
			max: 5,
			min: 0,
			idle: 10000,
		},
		timezone: '+09:00',
	},
);

const models = {};
const __dirname = path.resolve().concat('\\src\\models');

fs.readdirSync(__dirname)
	.filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
	.forEach(file => {
		const subModel = import(`./${file}`);

		subModel.then((subModel) => {
			const subModelInit = subModel.default(sequelize, Sequelize.DataTypes);
			
			models[subModelInit.name] = subModelInit;

			if('associate' in models[subModelInit.name]) {
				models[subModelInit.name].associate(models);
			}
		});
	});

sequelize
	.sync()
	.then(() => {
		console.log('Schema has synchronized');
	})
	.catch(err => {
		console.log(`Schema synchronizing has failed\nError :: ${err}`);
	});

models.sequelize = sequelize;
models.Sequelize = sequelize;

export default models;