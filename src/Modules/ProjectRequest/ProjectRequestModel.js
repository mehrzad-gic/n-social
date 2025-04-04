import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const ProjectRequest = sequelize.define('ProjectRequest', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    budget: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    time: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    des: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reject_message: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resolve_message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    project_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'projects',
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
    answer_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    answer_at: {
        type: DataTypes.INTEGER,
        allowNull: true
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


export default ProjectRequest;