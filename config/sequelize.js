import Sequelize from 'sequelize';
import fs from 'fs';
import config from './config.js';

import userModel from '../Server/models/users.js';
import SessionModel from '../Server/models/session.js';

const { databaseConfig } = config;

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.user,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    dialect: 'mysql',
  }
);

const db = {
  User: userModel(sequelize),
  session: SessionModel(sequelize),
};

sequelize.sync({ alter: true })
    .then(() => console.log('Database synchronized'))
    .catch(error => console.error('An error occurred:', error));

export { sequelize, Sequelize, db };
