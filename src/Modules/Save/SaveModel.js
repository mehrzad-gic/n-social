import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const Save = sequelize.define('Save', {
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


export default Save;