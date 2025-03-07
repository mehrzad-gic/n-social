import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const JobOfferRequest = sequelize.define('JobOfferRequest', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    salary: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    des: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resolve: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    job_offer_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'job_offers',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    reject_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'rejects',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});


export default JobOfferRequest;