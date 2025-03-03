import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Plan from '../Plan/PlanModel'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary

const PlanUser = sequelize.define('PlanUser', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    request: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    freeze: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '1 => active'
    },
    plan_type: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '0 => month, 1 => year'
    },
    plan_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Plan,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    date_start: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_end: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'if end date > now : fail'
    }
}, {
    timestamps: true,
    tableName: 'plan_users'
});

// Setting up the many-to-many relationship
Plan.belongsToMany(User, { through: PlanUser, foreignKey: 'plan_id' });
User.belongsToMany(Plan, { through: PlanUser, foreignKey: 'user_id' });

export default PlanUser;