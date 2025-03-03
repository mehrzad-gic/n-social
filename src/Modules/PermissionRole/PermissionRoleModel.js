import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import Permission from '../Permission/PermissionModel'; // Adjust the path as necessary
import Role from '../Role/RoleModel'; // Adjust the path as necessary

const PermissionRole = sequelize.define('PermissionRole', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    permission_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Permission,
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
    tableName: 'permission_role'
});

// Setting up the many-to-many relationship
Permission.belongsToMany(Role, { through: PermissionRole, foreignKey: 'permission_id' });
Role.belongsToMany(Permission, { through: PermissionRole, foreignKey: 'role_id' });

export default PermissionRole;