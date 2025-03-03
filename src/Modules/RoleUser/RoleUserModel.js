import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary
import Role from '../Role/RoleModel'; // Adjust the path as necessary

const RoleUser = sequelize.define('RoleUser', {
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
    role_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Role,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true,
    tableName: 'role_user'
});

// Setting up the many-to-many relationship
User.belongsToMany(Role, { through: RoleUser, foreignKey: 'user_id' });
Role.belongsToMany(User, { through: RoleUser, foreignKey: 'role_id' });

export default RoleUser;