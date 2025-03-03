import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import User from '../User/UserModel.js'; // Adjust the path as necessary
import Group from '../Group/GroupModel.js'; // Adjust the path as necessary

const GroupAdmin = sequelize.define('GroupAdmin', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '0 => owner, 1 => admin, 2 => manager'
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
    group_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Group,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});

GroupAdmin.belongsTo(User, { foreignKey: 'user_id' });
GroupAdmin.belongsTo(Group, { foreignKey: 'group_id' });

export default GroupAdmin;