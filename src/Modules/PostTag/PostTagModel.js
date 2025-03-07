import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const PostTag = sequelize.define('PostTag', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'posts',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    tag_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'tags',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true,
    tableName: 'post_tag'
});


export default PostTag;