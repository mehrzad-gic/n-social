import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary

const Comment = sequelize.define('Comment', {
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
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});

Comment.belongsTo(User, { foreignKey: 'user_id' });

export default Comment;