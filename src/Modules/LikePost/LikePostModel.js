import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import User from '../User/UserModel.js'; // Adjust the path as necessary
import Post from '../Post/PostModel.js'; // Adjust the path as necessary

const LikePost = sequelize.define('LikePost', {
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
    post_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Post,
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
    tableName: 'like_post'
});

// Setting up the many-to-many relationship
User.belongsToMany(Post, { through: LikePost, foreignKey: 'user_id' });
Post.belongsToMany(User, { through: LikePost, foreignKey: 'post_id' });

export default LikePost;