import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary

const Reaction = sequelize.define('Reaction', {
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
    }
}, {
    timestamps: true
});

export default Reaction;