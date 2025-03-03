import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary

const TaskComment = sequelize.define('TaskComment', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    des: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    file: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    see: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    }
}, {
    timestamps: true
});

export default TaskComment;