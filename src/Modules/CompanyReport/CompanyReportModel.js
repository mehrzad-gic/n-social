import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary
import Project from '../Project/ProjectModel'; // Adjust the path as necessary
import Report from '../Report/ReportModel'; // Adjust the path as necessary

const CompanyReport = sequelize.define('CompanyReport', {
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
    project_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Project,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    report_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Report,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true
});

CompanyReport.belongsTo(User, { foreignKey: 'user_id' });
CompanyReport.belongsTo(Project, { foreignKey: 'project_id' });
CompanyReport.belongsTo(Report, { foreignKey: 'report_id' });

export default CompanyReport;