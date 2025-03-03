import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import User from '../User/UserModel.js'; // Adjust the path as necessary

const Story = sequelize.define('Story', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
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

Story.belongsTo(User, { foreignKey: 'user_id' });

export default Story;