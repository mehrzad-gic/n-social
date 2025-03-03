import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary

const Email = sequelize.define('Email', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true
});

export default Email;