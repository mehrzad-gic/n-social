import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    des: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    img: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    members: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    posts: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    slug: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: false
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
    pin_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
}, {
    timestamps: true
});


export default Group;