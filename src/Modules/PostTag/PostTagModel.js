import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Post from '../Post/PostModel.js'; // Adjust the path as necessary
import Tag from '../Tag/TagModel.js'; // Adjust the path as necessary

const PostTag = sequelize.define('PostTag', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
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
    tag_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Tag,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true,
    tableName: 'post_tag'
});

// Setting up the many-to-many relationship
Post.belongsToMany(Tag, { through: PostTag, foreignKey: 'post_id' });
Tag.belongsToMany(Post, { through: PostTag, foreignKey: 'tag_id' });

export default PostTag;