import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary

const Save = sequelize.define('Save', {
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
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    saveable_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    saveable_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

Save.belongsTo(User, { foreignKey: 'user_id' });

export default Save;