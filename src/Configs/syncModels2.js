import { SequelizeConfig } from './Sequelize.js';
import logger from 'node-color-log';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsPath = path.resolve(__dirname, '../Modules');

const syncModels = async () => {
    const sequelize = await SequelizeConfig();
    try {
        const modules = fs.readdirSync(modelsPath);

        for (const module of modules) {
            const modelPath = path.join(modelsPath, module, `${module}Model.js`);
            if (fs.existsSync(modelPath)) {
                try {
                    const model = (await import(pathToFileURL(modelPath).href)).default;
                    await model.sync({ force: true }); // Use { force: true } to drop and recreate the table
                    logger.color('green').bold().log(`${module} table has been synced.`);
                } catch (importError) {
                    logger.color('red').bold().log(`Error importing ${module} model:`, importError);
                }
            }
        }
    } catch (error) {
        console.error('Error syncing tables:', error);
    } finally {
        await sequelize.close();
    }
};

syncModels();