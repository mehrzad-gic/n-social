import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const Reject = sequelize.define('Reject', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug:{
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '0 => pr , 1 => offer , 2 => group'
    }
}, {
    timestamps: true
});

export default Reject;