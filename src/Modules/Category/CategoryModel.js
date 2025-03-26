import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    slug: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true
});

export default Category;