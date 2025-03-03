import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Tag from '../Tag/TagModel.js'; // Adjust the path as necessary
import User from '../User/UserModel.js'; // Adjust the path as necessary

const TagUserActivity = sequelize.define('TagUserActivity', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    repeat: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tag_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Tag,
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
    }
}, {
    timestamps: true,
    tableName: 'tag_user_activity'
});

// Setting up the many-to-many relationship
Tag.belongsToMany(User, { through: TagUserActivity, foreignKey: 'tag_id' });
User.belongsToMany(Tag, { through: TagUserActivity, foreignKey: 'user_id' });

export default TagUserActivity;