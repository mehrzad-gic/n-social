import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Adjust the path as necessary

const ProjectCategory = sequelize.define('ProjectCategory', {
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
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    timestamps: true
});

export default ProjectCategory;