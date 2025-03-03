import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import Company from '../Company/CompanyModel'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary

const CompanyMember = sequelize.define('CompanyMember', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
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
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    des: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_obj: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_obj: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true
});

CompanyMember.belongsTo(Company, { foreignKey: 'company_id' });
CompanyMember.belongsTo(User, { foreignKey: 'user_id' });

export default CompanyMember;