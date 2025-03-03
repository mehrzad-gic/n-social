import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import Project from '../Project/ProjectModel'; // Adjust the path as necessary
import Skill from '../Skill/SkillModel'; // Adjust the path as necessary

const ProjectSkill = sequelize.define('ProjectSkill', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    skill_id: {
        type: DataTypes.BIGINT,
        references: {
            model: Skill,
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
    }
}, {
    timestamps: true,
    tableName: 'project_skills'
});

// Setting up the many-to-many relationship
Project.belongsToMany(Skill, { through: ProjectSkill, foreignKey: 'project_id' });
Skill.belongsToMany(Project, { through: ProjectSkill, foreignKey: 'skill_id' });

export default ProjectSkill;