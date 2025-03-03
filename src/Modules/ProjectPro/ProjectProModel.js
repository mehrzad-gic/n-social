import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary

const ProjectPro = sequelize.define('ProjectPro', {
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
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

export default ProjectPro;