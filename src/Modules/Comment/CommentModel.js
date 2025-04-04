import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const Comment = sequelize.define('comment', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    commentable_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    commentable_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deep: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    parent_id: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});


export default Comment;