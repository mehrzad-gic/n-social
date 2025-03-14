import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const TaskRequest = sequelize.define('TaskRequest', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
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
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    des: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resolve: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});


export default TaskRequest;