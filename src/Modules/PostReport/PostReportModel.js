import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import Post from '../Post/PostModel'; // Adjust the path as necessary
import Report from '../Report/ReportModel'; // Adjust the path as necessary

const PostReport = sequelize.define('PostReport', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Post,
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
    }
}, {
    timestamps: true,
    tableName: 'pots_report'
});

// Setting up the many-to-many relationship
Post.belongsToMany(Report, { through: PostReport, foreignKey: 'post_id' });
Report.belongsToMany(Post, { through: PostReport, foreignKey: 'report_id' });

export default PostReport;