import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Group from '../Group/GroupModel'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary
import Reject from '../Reject/RejectModel'; // Adjust the path as necessary

const GroupRequest = sequelize.define('GroupRequest', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    reject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    group_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Group,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
    reject_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: Reject,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});

GroupRequest.belongsTo(Group, { foreignKey: 'group_id' });
GroupRequest.belongsTo(User, { foreignKey: 'user_id' });
GroupRequest.belongsTo(Reject, { foreignKey: 'reject_id' });

export default GroupRequest;