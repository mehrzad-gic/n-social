import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import User from '../User/UserModel.js'; // Adjust the path as necessary
import Company from '../Company/CompanyModel.js'; // Adjust the path as necessary
import Salary from '../Salary/SalaryModel.js'; // Adjust the path as necessary
import Category from '../Category/CategoryModel.js'; // Adjust the path as necessary

const Project = sequelize.define('Project', {
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
        allowNull: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    requests: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    min: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    max: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true
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
    salary_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Salary,
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
    }
}, {
    timestamps: true
});

Project.belongsTo(User, { foreignKey: 'user_id' });
Project.belongsTo(Company, { foreignKey: 'company_id' });
Project.belongsTo(Salary, { foreignKey: 'salary_id' });
Project.belongsTo(Category, { foreignKey: 'category_id' });

export default Project;