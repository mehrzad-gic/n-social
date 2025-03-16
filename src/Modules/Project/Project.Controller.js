import { projectValidation } from './validation.js';
import createHttpError from 'http-errors';
import Project from './ProjectModel.js';
import { Op } from 'sequelize';
import Company from '../Company/CompanyModel.js';
import Category from '../Category/CategoryModel.js';
import Salary from '../Salary/SalaryModel.js';
import { makeSlug } from '../../Helpers/Helper.js';
import User from '../User/UserModel.js';
import Skill from '../Skill/SkillModel.js';
import ProjectSkill from '../ProjectSkill/ProjectSkillModel.js';


async function create(req,res,next){

    try {
    
        const {name,skills,des, text, category_id, company_id, min, max, type, salary_id} = req.body;
        const {error} = projectValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));


        const [category, company, salary] = await Promise.all([
            Category.findByPk(category_id),
            Company.findByPk(company_id), 
            Salary.findByPk(salary_id)
        ]);


        // attach skills to pivot table
        for(const value of skills){
            const skill = await Skill.findByPk(value);
            if(!skill) return next(createHttpError.BadRequest('Skill not found'));
            ProjectSkill.create({
                skill_id: skill.id,
                project_id: project.id
            })
        }

        if(!category) return next(createHttpError.BadRequest('Category not found'));
        if(!company) return next(createHttpError.BadRequest('Company not found'));
        if(!salary) return next(createHttpError.BadRequest('Salary not found'));

        const project = await Project.create({
            name, 
            des, 
            slug: makeSlug(name,'projects'),
            text, 
            category_id, 
            company_id, 
            min, 
            max, 
            type, 
            salary_id,
            user_id: req.session.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project
        });

    } catch (error) {
        next(error);
    }

}


async function index(req,res,next){

    try {

        const {page, limit, search, status, category_id, min, max, type,created_at ='DESC',order} = req.query;
        const offset = (page - 1) * limit;

        const where = {};

        if(search) where.name = { [Op.like]: `%${search}%` };
        if(status) where.status = status;
        if(category_id) where.category_id = category_id;
        if(min) where.min = { [Op.gte]: min };
        if(max) where.max = { [Op.lte]: max };
        if(type) where.type = type;

        const orderBy = [['createdAt', created_at]];
        if(order) orderBy.push([order, 'DESC']);

        const projects = await Project.findAndCountAll({
            where,
            offset,
            limit,
            include: [
                {model: Category, attributes: ['name','slug']},
                {model: Company, attributes: ['name','slug','img']},
                {model: Salary, attributes: ['salary']},
                {model: User, attributes: ['name', 'email','slug','img']}
            ],
            order: orderBy
        });

        res.status(200).json({
            success: true,
            message: 'Projects fetched successfully',
            projects
        });

    } catch (error) {
        next(error);
    }

}



async function show(req,res,next){

    try {
 
        const {slug} = req.params;

        const project = await Project.findOne({
            where: {slug},
            include: [
                {model: Category, attributes: ['name','slug']},
                {model: Company, attributes: ['name','slug','img']},
                {model: Salary, attributes: ['salary']},
                {model: User, attributes: ['name', 'email','slug','img']},
                {model: ProjectSkill, attributes: ['skill_id'], include: [{model: Skill, attributes: ['name','slug']}]}
            ]
        });

        if(!project) return next(createHttpError.NotFound('Project not found'));

        res.status(200).json({
            success: true,
            message: 'Project fetched successfully',
            project
        });

    } catch (error) {
        next(error);
    }

}


async function update(req,res,next){

    try {
        
        const {slug} = req.params;
        const {name,skills,des, text, category_id, min, max, type, salary_id} = req.body;
        const {error} = projectValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));

        const project = await Project.findOne({
            where: {slug}
        });

        if(!project) return next(createHttpError.NotFound('Project not found'));

        await project.update({
            name,
            des,
            text,
            category_id,
            min,
            max,
            type,
            salary_id
        });

        // delete all skills from pivot table
        await ProjectSkill.destroy({where: {project_id: project.id}});

        // attach skills to pivot table
        for(const value of skills){
            const skill = await Skill.findByPk(value);
            if(!skill) return next(createHttpError.BadRequest('Skill not found'));
            ProjectSkill.create({
                skill_id: skill.id,
                project_id: project.id
            })
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully'
        });

    } catch (error) {
        next(error);
    }

}


async function destroy(req,res,next){

    try {
 
        const {slug} = req.params;

        const project = await Project.findOne({
            where: {slug}
        });

        if(!project) return next(createHttpError.NotFound('Project not found'));

        await project.destroy();

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
        
    } catch (error) {
        next(error);
    }

}



async function changeStatus(req,res,next){

    try {
        
        const {slug} = req.params;

        const project = await Project.findOne({
            where: {slug}
        });

        if(!project) return next(createHttpError.NotFound('Project not found'));

        const updatedProject = await project.update({status:project.status === 1 ? 0 : 1});

        res.status(200).json({
            success: true,
            message: 'Project status updated successfully',
            project: updatedProject
        });

    } catch (error) {
        next(error);
    }

}


export {create, index, show, update, destroy, changeStatus};