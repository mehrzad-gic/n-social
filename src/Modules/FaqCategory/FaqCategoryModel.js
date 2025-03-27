import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const FaqCategory = sequelize.define('FaqCategory', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    des: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true,
    tableName:'faq_categories'
});

export default FaqCategory;