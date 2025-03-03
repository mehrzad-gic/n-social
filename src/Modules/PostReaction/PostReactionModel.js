import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Post from '../Post/PostModel.js'; // Adjust the path as necessary
import Reaction from '../Reaction/ReactionModel.js'; // Adjust the path as necessary

const PostReaction = sequelize.define('PostReaction', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    reaction_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Reaction,
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
    }
}, {
    timestamps: true,
    tableName: 'post_reactions'
});

// Setting up the many-to-many relationship
Post.belongsToMany(Reaction, { through: PostReaction, foreignKey: 'post_id' });
Reaction.belongsToMany(Post, { through: PostReaction, foreignKey: 'reaction_id' });

export default PostReaction;