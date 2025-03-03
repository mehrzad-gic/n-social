import { SequelizeConfig } from './Sequelize.js';
import logger from 'node-color-log';
import User from '../Modules/User/UserModel.js';
import Otp from '../Modules/Otp/OtpModel.js';
import Salary from '../Modules/Salary/SalaryModel.js';
import Reject from '../Modules/Reject/RejectModel.js';
import ProjectCategory from '../Modules/ProjectCategory/ProjectCategoryModel.js';
import ProjectCategoryPrice from '../Modules/ProjectCategoryPrice/ProjectCategoryPriceModel.js';
import Reaction from '../Modules/Reaction/ReactionModel.js';
import Category from '../Modules/Category/CategoryModel.js';
import Tag from '../Modules/Tag/TagModel.js';
import Group from '../Modules/Group/GroupModel.js';
import Report from '../Modules/Report/ReportModel.js';
import Post from '../Modules/Post/PostModel.js';
import PostTag from '../Modules/PostTag/PostTagModel.js';
import Comment from '../Modules/Comment/CommentModel.js';
import CommentLike from '../Modules/CommentLike/CommentLikeModel.js';
import CommentReport from '../Modules/CommentReport/CommentReportModel.js';
import PostReaction from '../Modules/PostReaction/PostReactionModel.js';
import Save from '../Modules/Save/SaveModel.js';
import PostReport from '../Modules/PostReport/PostReportModel.js';
import Permission from '../Modules/Permission/PermissionModel.js';
import Role from '../Modules/Role/RoleModel.js';
import PermissionRole from '../Modules/PermissionRole/PermissionRoleModel.js';
import RoleUser from '../Modules/RoleUser/RoleUserModel.js';
import UserActivity from '../Modules/UserActivity/UserActivityModel.js';
import TagUserActivity from '../Modules/TagUserActivity/TagUserActivityModel.js';
import Skill from '../Modules/Skill/SkillModel.js';
import Company from '../Modules/Company/CompanyModel.js';
import Project from '../Modules/Project/ProjectModel.js';
import ProjectRequest from '../Modules/ProjectRequest/ProjectRequestModel.js';
import ProjectTask from '../Modules/ProjectTask/ProjectTaskModel.js';
import ProjectReport from '../Modules/ProjectReport/ProjectReportModel.js';
import CompanyReport from '../Modules/CompanyReport/CompanyReportModel.js';
import CompanyMember from '../Modules/CompanyMember/CompanyMemberModel.js';
import TaskRequest from '../Modules/TaskRequest/TaskRequestModel.js';
import Page from '../Modules/Page/PageModel.js';
import Setting from '../Modules/Setting/SettingModel.js';
import FaqCategory from '../Modules/FaqCategory/FaqCategoryModel.js';
import Faq from '../Modules/Faq/FaqModel.js';
import Story from '../Modules/Story/StoryModel.js';
import ProjectPro from '../Modules/ProjectPro/ProjectProModel.js';
import JobOffer from '../Modules/JobOffer/JobOfferModel.js';
import JobOfferReport from '../Modules/JobOfferReport/JobOfferReportModel.js';
import GroupMember from '../Modules/GroupMember/GroupMemberModel.js';
import GroupAdmin from '../Modules/GroupAdmin/GroupAdminModel.js';
// import UserReport from '../Modules/UserReport/UserReportModel.js';
import Email from '../Modules/Email/EmailModel.js';
import ProjectSkill from '../Modules/ProjectSkill/ProjectSkillModel.js';
import TaskComment from '../Modules/TaskComment/TaskCommentModel.js';
import GroupRequest from '../Modules/GroupRequest/GroupRequestModel.js';
import JobOfferRequest from '../Modules/JobOfferRequest/JobOfferRequestModel.js';
import Plan from '../Modules/Plan/PlanModel.js';
import PlanUser from '../Modules/PlanUser/PlanUserModel.js';
import LikePost from '../Modules/LikePost/LikePostModel.js';
import ResetPassword from '../Modules/ResetPassword/ResetPasswordModel.js';

const syncModels = async () => {
    const sequelize = await SequelizeConfig();
    try {
        const models = [
            User, Otp, Salary, Reject, ProjectCategory, ProjectCategoryPrice,
            Reaction, Category, Tag, Group, Report, Post, PostTag, Comment, CommentLike, CommentReport, PostReaction, Save,
            PostReport, Permission, Role, PermissionRole, RoleUser, UserActivity, TagUserActivity, Skill, Company, Project,
            ProjectRequest, ProjectTask, ProjectReport, CompanyReport, CompanyMember, TaskRequest, Page, Setting, FaqCategory,
            Faq, Story, ProjectPro, JobOffer, JobOfferReport, GroupMember, GroupAdmin, Email, ProjectSkill,
            TaskComment, GroupRequest, JobOfferRequest, Plan, PlanUser, LikePost,
            ResetPassword,
        ];

        for (const model of models) {
            await model.sync({ alter: true }); // Use { force: true } to drop and recreate the table
            logger.color('green').bold().log(`${model.name} table has been synced.`);
        }
    } catch (error) {
        console.error('Error syncing tables:', error);
    } finally {
        await sequelize.close();
    }
};

syncModels();