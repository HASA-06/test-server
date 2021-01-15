import fs from 'fs';
import Sequelize from 'sequelize';

import environment from '../utils/envoriment.js';

environment();

const sequelize = new Sequelize(
	process.env.DATABASE__SCHEMA,
	process.env.DATABASE__USER_NAME,
	process.env.DATABASE__USER_PASSWORD,
	{
		host: process.env.DATABASE__HOST,
		dialect: process.env.DATABASE__DIALECT,
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
const __dirname = process.env.GLOBAL__DIR_NAME.concat('\\models');

fs.readdirSync(__dirname)
	.filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
	.forEach((file, index) => {
		const subModel = import(`./${file}`);

		subModel.then((subModel) => {
			const subModelInit = subModel.default(sequelize, Sequelize.DataTypes);
			
			models[subModelInit.name] = subModelInit;

			if(index === 0) console.log('::: Sub model associate set :::');

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