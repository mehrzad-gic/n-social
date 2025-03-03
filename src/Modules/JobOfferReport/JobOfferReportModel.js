import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary
import Reject from '../Reject/RejectModel'; // Adjust the path as necessary

const JobOfferReport = sequelize.define('JobOfferReport', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    by_id: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
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

JobOfferReport.belongsTo(User, { foreignKey: 'by_id', as: 'by' });
JobOfferReport.belongsTo(User, { foreignKey: 'user_id' });
JobOfferReport.belongsTo(Reject, { foreignKey: 'reject_id' });

export default JobOfferReport;