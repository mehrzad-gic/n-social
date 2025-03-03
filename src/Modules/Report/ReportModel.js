import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    rate: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Report;