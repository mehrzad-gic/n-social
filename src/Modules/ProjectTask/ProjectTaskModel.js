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
        allowNull: false
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
        allowNull: false
    },
    resolve: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    repeat: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    time: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
}, {
    timestamps: true
});


export default ProjectTask;