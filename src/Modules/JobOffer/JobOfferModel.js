import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const JobOffer = sequelize.define('JobOffer', {
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
    company_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'companies',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    category_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'categories',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    salary_id: {
        type: DataTypes.BIGINT, 
        references: {
            model: 'salaries',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    number: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    level: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: '0 => internship, 1 => junior, 2 => midLevel, 3 => senior'
    }
}, {
    timestamps: true
});

export default JobOffer;