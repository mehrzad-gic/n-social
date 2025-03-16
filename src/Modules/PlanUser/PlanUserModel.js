import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

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
            model: 'plans',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    refresh_at:{
        allowNull:true,
        type : DataTypes.INTEGER
    },
    start: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    end: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'if end date > now : fail'
    }
}, {
    timestamps: true,
    tableName: 'plan_users'
});


export default PlanUser;