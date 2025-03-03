import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Tag from '../Tag/TagModel.js'; // Adjust the path as necessary

const UserActivity = sequelize.define('UserActivity', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
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
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true
});

UserActivity.belongsTo(Tag, { foreignKey: 'tag_id' });

export default UserActivity;