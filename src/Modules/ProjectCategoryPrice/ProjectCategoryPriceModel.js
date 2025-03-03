import { DataTypes } from 'sequelize';
import sequelize from '../../Configs/Sequelize.js'; // Adjust the path as necessary
import ProjectCategory from '../ProjectCategory/ProjectCategoryModel.js'; // Adjust the path as necessary

const ProjectCategoryPrice = sequelize.define('ProjectCategoryPrice', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    project_category_id: {
        type: DataTypes.BIGINT,
        references: {
            model: ProjectCategory,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});

ProjectCategoryPrice.belongsTo(ProjectCategory, { foreignKey: 'project_category_id' });

export default ProjectCategoryPrice;