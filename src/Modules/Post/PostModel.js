import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import User from '../User/UserModel.js'; // Adjust the path as necessary
import Group from '../Group/GroupModel.js'; // Adjust the path as necessary

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    comments_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    comment_status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    img: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imgs: {
        type: DataTypes.TEXT,
        allowNull: true
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
    group_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: Group,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});

Post.belongsTo(User, { foreignKey: 'user_id' });
Post.belongsTo(Group, { foreignKey: 'group_id' });

export default Post;