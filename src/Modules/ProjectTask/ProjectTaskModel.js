import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary


const ProjectTask = sequelize.define('ProjectTask', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    manager_id: {
        type: DataTypes.BIGINT,
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
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    des: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    file: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reject: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resolve: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        comment: '0: pending, 1: done, 2: rejected'
    },
    repeats_object: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'last repeats object to save data '
    },
    repeats: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        comment: 'count of repeats'
    },
    time: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    done_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});


export default ProjectTask;