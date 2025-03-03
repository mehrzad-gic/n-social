import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import Company from '../Company/CompanyModel'; // Adjust the path as necessary
import Category from '../Category/CategoryModel'; // Adjust the path as necessary
import Salary from '../Salary/SalaryModel'; // Adjust the path as necessary

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
            model: Company,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    category_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Category,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    salary_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Salary,
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

JobOffer.belongsTo(Company, { foreignKey: 'company_id' });
JobOffer.belongsTo(Category, { foreignKey: 'category_id' });
JobOffer.belongsTo(Salary, { foreignKey: 'salary_id' });

export default JobOffer;