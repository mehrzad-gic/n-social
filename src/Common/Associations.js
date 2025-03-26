import User from '../Modules/User/UserModel.js'; // Adjust the path as necessary
import Group from '../Modules/Group/GroupModel.js'; // Adjust the path as necessary
import Post from '../Modules/Post/PostModel.js'; // Adjust the path as necessary
import LikePost from '../Modules/LikePost/LikePostModel.js'; // Adjust the path as necessary
import Save from '../Modules/Save/SaveModel.js'; // Adjust the path as necessary
import Comment from '../Modules/Comment/CommentModel.js'; // Adjust the path as necessary
import Category from '../Modules/Category/CategoryModel.js'; // Adjust the path as necessary
import CommentLike from '../Modules/CommentLike/CommentLikeModel.js'; // Adjust the path as necessary
import CommentReport from '../Modules/CommentReport/CommentReportModel.js'; // Adjust the path as necessary
import Company from '../Modules/Company/CompanyModel.js'; // Adjust the path as necessary
import CompanyMember from '../Modules/CompanyMember/CompanyMemberModel.js'; // Adjust the path as necessary
import CompanyReport from '../Modules/CompanyReport/CompanyReportModel.js'; // Adjust the path as necessary
import Email from '../Modules/Email/EmailModel.js'; // Adjust the path as necessary
import FaqCategory from '../Modules/FaqCategory/FaqCategoryModel.js'; // Adjust the path as necessary
import Faq from '../Modules/Faq/FaqModel.js'; // Adjust the path as necessary
import GroupAdmin from '../Modules/GroupAdmin/GroupAdminModel.js'; // Adjust the path as necessary
import GroupMember from '../Modules/GroupMember/GroupMemberModel.js'; // Adjust the path as necessary
import GroupRequest from '../Modules/GroupRequest/GroupRequestModel.js'; // Adjust the path as necessary
import JobOffer from '../Modules/JobOffer/JobOfferModel.js'; // Adjust the path as necessary
import JobOfferReport from '../Modules/JobOfferReport/JobOfferReportModel.js'; // Adjust the path as necessary
import JobOfferRequest from '../Modules/JobOfferRequest/JobOfferRequestModel.js'; // Adjust the path as necessary
import Otp from '../Modules/Otp/OtpModel.js'; // Adjust the path as necessary
import Permission from '../Modules/Permission/PermissionModel.js'; // Adjust the path as necessary
import PermissionRole from '../Modules/PermissionRole/PermissionRoleModel.js'; // Adjust the path as necessary
import Plan from '../Modules/Plan/PlanModel.js'; // Adjust the path as necessary
import PlanUser from '../Modules/PlanUser/PlanUserModel.js'; // Adjust the path as necessary
import PostReaction from '../Modules/PostReaction/PostReactionModel.js'; // Adjust the path as necessary
import PostTag from '../Modules/PostTag/PostTagModel.js'; // Adjust the path as necessary
import Project from '../Modules/Project/ProjectModel.js'; // Adjust the path as necessary
import ProjectPro from '../Modules/ProjectPro/ProjectProModel.js'; // Adjust the path as necessary
import ProjectReport from '../Modules/ProjectReport/ProjectReportModel.js'; // Adjust the path as necessary
import ProjectRequest from '../Modules/ProjectRequest/ProjectRequestModel.js'; // Adjust the path as necessary
import ProjectSkill from '../Modules/ProjectSkill/ProjectSkillModel.js'; // Adjust the path as necessary
import ProjectTask from '../Modules/ProjectTask/ProjectTaskModel.js'; // Adjust the path as necessary
import Reject from '../Modules/Reject/RejectModel.js'; // Adjust the path as necessary
import Report from '../Modules/Report/ReportModel.js'; // Adjust the path as necessary
import ResetPassword from '../Modules/ResetPassword/ResetPasswordModel.js'; // Adjust the path as necessary
import Role from '../Modules/Role/RoleModel.js'; // Adjust the path as necessary
import RoleUser from '../Modules/RoleUser/RoleUserModel.js'; // Adjust the path as necessary
import Salary from '../Modules/Salary/SalaryModel.js'; // Adjust the path as necessary
import Setting from '../Modules/Setting/SettingModel.js'; // Adjust the path as necessary
import Skill from '../Modules/Skill/SkillModel.js'; // Adjust the path as necessary
import Story from '../Modules/Story/StoryModel.js'; // Adjust the path as necessary
import Tag from '../Modules/Tag/TagModel.js'; // Adjust the path as necessary
import TagUserActivity from '../Modules/TagUserActivity/TagUserActivityModel.js'; // Adjust the path as necessary
import UserActivity from '../Modules/UserActivity/UserActivityModel.js'; // Adjust the path as necessary


// Setting up the associations
export default function Associations() { 

    // User associations
    User.hasMany(Post, { foreignKey: 'user_id' });
    User.hasMany(Group, { foreignKey: 'user_id' });
    User.hasMany(Comment, { foreignKey: 'user_id' });
    User.hasMany(LikePost, { foreignKey: 'user_id' });
    User.hasMany(Save, { foreignKey: 'user_id' });
    User.hasMany(CommentLike, { foreignKey: 'user_id' });
    User.hasMany(CommentReport, { foreignKey: 'user_id' });
    User.hasMany(Company, { foreignKey: 'user_id' });
    User.hasMany(CompanyMember, { foreignKey: 'user_id' });
    User.hasMany(CompanyReport, { foreignKey: 'user_id' });
    User.hasMany(GroupAdmin, { foreignKey: 'user_id' });
    User.hasMany(GroupMember, { foreignKey: 'user_id' });
    User.hasMany(GroupRequest, { foreignKey: 'user_id' });
    User.hasMany(JobOfferReport, { foreignKey: 'user_id' });
    User.hasMany(JobOfferRequest, { foreignKey: 'user_id' });
    User.hasMany(Otp, { foreignKey: 'user_id' });
    User.hasMany(PermissionRole, { foreignKey: 'user_id' });
    User.hasMany(PlanUser, { foreignKey: 'user_id' });
    User.hasMany(PostReaction, { foreignKey: 'user_id' });
    User.hasMany(PostTag, { foreignKey: 'user_id' });
    User.hasMany(Project, { foreignKey: 'user_id' });
    User.hasMany(ProjectReport, { foreignKey: 'user_id' });
    User.hasMany(ProjectRequest, { foreignKey: 'user_id' });
    User.hasMany(ProjectSkill, { foreignKey: 'user_id' });
    User.hasMany(ProjectTask, { foreignKey: 'user_id' });
    User.hasMany(ResetPassword, { foreignKey: 'user_id' });
    User.hasMany(RoleUser, { foreignKey: 'user_id' });
    User.hasMany(Salary, { foreignKey: 'user_id' });
    User.hasMany(Setting, { foreignKey: 'user_id' });
    User.hasMany(Skill, { foreignKey: 'user_id' });
    User.hasMany(Story, { foreignKey: 'user_id' });
    User.hasMany(TagUserActivity, { foreignKey: 'user_id' });
    User.hasMany(UserActivity, { foreignKey: 'user_id' });

    // Group associations
    Group.belongsTo(User, { foreignKey: 'user_id' });
    Group.hasMany(Post, { foreignKey: 'group_id' });
    Group.hasMany(GroupAdmin, { foreignKey: 'group_id' });
    Group.hasMany(GroupMember, { foreignKey: 'group_id' });
    Group.hasMany(GroupRequest, { foreignKey: 'group_id' });

    // Post associations
    Post.belongsTo(User, { foreignKey: 'user_id' });
    Post.belongsTo(Group, { foreignKey: 'group_id' });
    Post.hasMany(Comment, { foreignKey: 'post_id' });
    Post.hasMany(LikePost, { foreignKey: 'post_id' });
    Post.hasMany(Save, { foreignKey: 'saveable_id' });
    Post.hasMany(PostReaction, { foreignKey: 'post_id' });
    Post.hasMany(PostTag, { foreignKey: 'post_id' });

    // Comment associations
    Comment.belongsTo(User, { foreignKey: 'user_id' });
    Comment.belongsTo(Post, { foreignKey: 'post_id' });
    Comment.hasMany(CommentLike, { foreignKey: 'comment_id' });
    Comment.hasMany(CommentReport, { foreignKey: 'comment_id' });
    Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });

    // Company associations
    Company.belongsTo(User, { foreignKey: 'user_id' });
    Company.hasMany(CompanyMember, { foreignKey: 'company_id' });
    Company.hasMany(CompanyReport, { foreignKey: 'company_id' });

    // JobOffer associations
    JobOffer.belongsTo(Company, { foreignKey: 'company_id' });
    JobOffer.belongsTo(Category, { foreignKey: 'category_id' });
    JobOffer.hasMany(JobOfferReport, { foreignKey: 'job_offer_id' });
    JobOffer.hasMany(JobOfferRequest, { foreignKey: 'job_offer_id' });

    // Project associations
    Project.belongsTo(User, { foreignKey: 'user_id' });
    Project.belongsTo(Company, { foreignKey: 'company_id' });
    Project.belongsTo(Salary, { foreignKey: 'salary_id' });
    Project.belongsTo(Category, { foreignKey: 'category_id' });
    Project.hasMany(ProjectReport, { foreignKey: 'project_id' });
    Project.hasMany(ProjectRequest, { foreignKey: 'project_id' });
    Project.hasMany(ProjectSkill, { foreignKey: 'project_id' });
    Project.hasMany(ProjectTask, { foreignKey: 'project_id' });

    // Other associations
    PermissionRole.belongsTo(Permission, { foreignKey: 'permission_id' });
    PermissionRole.belongsTo(Role, { foreignKey: 'role_id' });

    PlanUser.belongsTo(Plan, { foreignKey: 'plan_id' });
    PlanUser.belongsTo(User, { foreignKey: 'user_id' });

    PostReaction.belongsTo(Post, { foreignKey: 'post_id' });

    PostTag.belongsTo(Post, { foreignKey: 'post_id' });
    PostTag.belongsTo(Tag, { foreignKey: 'tag_id' });


    ProjectReport.belongsTo(Project, { foreignKey: 'project_id' });
    ProjectReport.belongsTo(User, { foreignKey: 'user_id' });

    ProjectRequest.belongsTo(Project, { foreignKey: 'project_id' });
    ProjectRequest.belongsTo(User, { foreignKey: 'user_id' });

    ProjectSkill.belongsTo(Project, { foreignKey: 'project_id' });
    ProjectSkill.belongsTo(Skill, { foreignKey: 'skill_id' });

    ProjectTask.belongsTo(Project, { foreignKey: 'project_id' });
    ProjectTask.belongsTo(User, { foreignKey: 'user_id' });

    RoleUser.belongsTo(Role, { foreignKey: 'role_id' });
    RoleUser.belongsTo(User, { foreignKey: 'user_id' });

    Save.belongsTo(User, { foreignKey: 'user_id' });
    Story.belongsTo(User, { foreignKey: 'user_id' });

    TagUserActivity.belongsTo(Tag, { foreignKey: 'tag_id' });
    TagUserActivity.belongsTo(User, { foreignKey: 'user_id' });
    
    UserActivity.belongsTo(Tag, { foreignKey: 'tag_id' });

}
 