import ProjectRequest from './ProjectRequestModel.js';
import Project from '../Project/ProjectModel.js';
import User from '../User/UserModel.js';
import { projectRequestSchema } from './validation.js';
import createHttpError from 'http-errors';
import Reject from '../Reject/RejectModel.js';


async function create(req,res,next){

    try {
    
        const {slug} = req.params;
        const {des,time,budget} = req.body;

        const {error} = projectRequestSchema.validate({des,time,budget});
        if(error) return next(createHttpError.BadRequest(error.message));

        const project = await Project.findOne({where: {slug: slug}});
        if(!project) return next(createHttpError.NotFound('Project not found'));

        const projectRequest = await ProjectRequest.create({
            project_id: project.id,
            user_id: req.session.user.id,
            des,time,budget
        });

        res.status(201).json({
            success: true,
            message: 'Project request created successfully',
            projectRequest
        });
        
    } catch (error) {
        next(error);
    }

}


async function index(req,res,next){

    try {

        let {status,page,limit,newest} = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        offset = (page - 1) * limit;

        const projectRequests = await ProjectRequest.findAll({
            include: [
                {model: Project, attributes: ['name', 'slug']},
                {model: User, attributes: ['name', 'email']}
            ],
            where: {status: status || 0},
            offset,
            limit,
            order: [['createdAt', newest === 'true' ? 'DESC' : 'ASC']]
        });
        
    } catch (error) {
        next(error);
    }

}


async function show(req,res,next){

    try {
     
        const {id} = req.params;
        const projectRequest = await ProjectRequest.findByPk(id);
        if(!projectRequest) return next(createHttpError.NotFound('Project request not found'));

        res.status(200).json({
            success: true,
            message: 'Project request fetched successfully',
            projectRequest
        });
        
    } catch (error) {
        next(error);
    }

}


async function accept(req,res,next){

    try {
     
        const {id} = req.params;
        const {resolve_message} = req.body;
        const projectRequest = await ProjectRequest.findByPk(id);
        if(!projectRequest) return next(createHttpError.NotFound('Project request not found'));

        await projectRequest.update({
            status: 1,
            resolve_message: resolve_message,
            answer_by: req.session.user.id,
            answer_at: Date.now()
        });

        res.status(200).json({
            success: true,
            message: 'Project request accepted successfully',
        });
        
    } catch (error) {
        next(error);
    }

}


async function reject(req,res,next){

    try {
    
        const {id} = req.params;
        const {reject_message,reject_id} = req.body;
        const projectRequest = await ProjectRequest.findByPk(id);
        if(!projectRequest) return next(createHttpError.NotFound('Project request not found'));

        const reject = await Reject.findByPk(reject_id);
        if(!reject) return next(createHttpError.NotFound('Reject not found'));

        await projectRequest.update({
            status: 2,
            reject_message: reject_message,
            answer_by: req.session.user.id,
            answer_at: Date.now()
        });

        res.status(200).json({
            success: true,
            message: 'Project request rejected successfully',
        });
        
    } catch (error) {
        next(error);
    }

}   

export {create,index,show,accept,reject};
