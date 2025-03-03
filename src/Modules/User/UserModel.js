import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    birthday: {
        type: DataTypes.STRING,
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    post_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    follower_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    following_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    task_done: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    project_done: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    x: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    github: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    img_bg: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    img: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    admin: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    remember_token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = User;
