import { Sequelize } from 'sequelize';
import logger from 'node-color-log';
import dotenv from 'dotenv';
dotenv.config();

const SequelizeConfig = async () => {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: true, // Set to true for debugging
    });

    try {
        await sequelize.authenticate();
        logger.color('blue').bold().log('Connection to the MySQL database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the MySQL database:', error);
    }

    return sequelize;
};

export default SequelizeConfig;
