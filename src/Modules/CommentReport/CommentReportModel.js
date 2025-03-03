import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Comment from '../Comment/CommentModel.js'; // Adjust the path as necessary
import User from '../User/UserModel.js'; // Adjust the path as necessary
import Report from '../Report/ReportModel.js'; // Adjust the path as necessary

const CommentReport = sequelize.define('CommentReport', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    comment_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Comment,
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
    timestamps: true,
    tableName: 'comment_reports'
});

// Setting up the many-to-many relationship
Comment.belongsToMany(Report, { through: CommentReport, foreignKey: 'comment_id' });
Report.belongsToMany(Comment, { through: CommentReport, foreignKey: 'report_id' });
User.hasMany(CommentReport, { foreignKey: 'user_id' });
CommentReport.belongsTo(User, { foreignKey: 'user_id' });

export default CommentReport;