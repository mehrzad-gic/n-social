import { DataTypes } from 'sequelize';
import sequelize from '../../config/database'; // Adjust the path as necessary
import JobOffer from '../JobOffer/JobOfferModel'; // Adjust the path as necessary
import User from '../User/UserModel'; // Adjust the path as necessary
import Reject from '../Reject/RejectModel'; // Adjust the path as necessary

const JobOfferRequest = sequelize.define('JobOfferRequest', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    salary: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    des: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resolve: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    job_offer_id: {
        type: DataTypes.BIGINT,
        references: {
            model: JobOffer,
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
        allowNull: true,
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

JobOfferRequest.belongsTo(JobOffer, { foreignKey: 'job_offer_id' });
JobOfferRequest.belongsTo(User, { foreignKey: 'user_id' });
JobOfferRequest.belongsTo(Reject, { foreignKey: 'reject_id' });

export default JobOfferRequest;