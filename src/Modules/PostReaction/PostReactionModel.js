import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const PostReaction = sequelize.define('PostReaction', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '1 => like, 2 => love, 3 => care, 4 => haha, 5 => wow, 6 => sad, 7 => angry, 8 => dislike' 
    },
    post_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'posts',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true,
    tableName: 'post_reactions'
});


export default PostReaction;