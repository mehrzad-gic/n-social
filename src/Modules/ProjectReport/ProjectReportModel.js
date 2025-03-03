import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary
import Project from '../Project/ProjectModel'; // Adjust the path as necessary
import Reject from '../Reject/RejectModel'; // Adjust the path as necessary

const ProjectReport = sequelize.define('ProjectReport', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
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
    reject_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Reject,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});

ProjectReport.belongsTo(User, { foreignKey: 'user_id' });
ProjectReport.belongsTo(Project, { foreignKey: 'project_id' });
ProjectReport.belongsTo(Reject, { foreignKey: 'reject_id' });

export default ProjectReport;