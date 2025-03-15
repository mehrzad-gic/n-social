import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const GroupRequest = sequelize.define('GroupRequest', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reject_reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    group_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'groups',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    rejected_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'users',
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

export default GroupRequest;