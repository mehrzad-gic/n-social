import { BIGINT , STRING } from "sequelize";
import SequelizeConfig from "../../Configs/Sequelize.js";

const OTP = SequelizeConfig.define('otp',{
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    code: {
        type : STRING,
        allowNull : false
    },
    expires_in : {
        type : BIGINT,
        allowNull : false
    },
    email:{
        type : STRING,
        allowNull : false
    },
    user_id:{
        type : BIGINT,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
},
{
    tableName: 'otp',
    timestamps: false,
});

export default OTP;