import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Adjust the path as necessary

const Salary = sequelize.define('Salary', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Salary;