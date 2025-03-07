import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary

const CompanyMember = sequelize.define('CompanyMember', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
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


export default CompanyMember;