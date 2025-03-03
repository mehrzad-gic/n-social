import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary

const TaskRequest = sequelize.define('TaskRequest', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
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

TaskRequest.belongsTo(User, { foreignKey: 'user_id' });

export default TaskRequest;