import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Comment from '../Comment/CommentModel.js'; // Adjust the path as necessary
import User from '../User/UserModel.js'; // Adjust the path as necessary

const CommentLike = sequelize.define('CommentLike', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    comment_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Comment,
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
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true,
    tableName: 'comment_like'
});

// Setting up the many-to-many relationship
Comment.belongsToMany(User, { through: CommentLike, foreignKey: 'comment_id' });
User.belongsToMany(Comment, { through: CommentLike, foreignKey: 'user_id' });

export default CommentLike;