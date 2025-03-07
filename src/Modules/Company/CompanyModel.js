import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; 

const Company = sequelize.define('Company', {
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
    img_bg: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    founded: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    industry: {
        type: DataTypes.STRING,
        allowNull: false
    },
    revenue: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sector: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    size: {
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
    }
}, {
    timestamps: true
});

Company.belongsTo(User, { foreignKey: 'user_id' });

export default Company;