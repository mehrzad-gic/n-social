import ProjectReport from './ProjectReportModel.js';
import createHttpError from 'http-errors';
import Project from '../Project/ProjectModel.js';
import Report from '../Report/ReportModel.js';
import User from '../User/UserModel.js';



async function create(req,res,next){

    try {
        
        const {slug} = req.params;
        const {report_slug} = req.body;

        const [project, report] = await Promise.all([
            Project.findOne({where: {slug: slug}}),
            Report.findOne({where: {slug: report_slug}})
        ]);
        
        if(!project) return next(createHttpError.NotFound('Project not found'));
        if(!report) return next(createHttpError.NotFound('Report not found'));

        const projectReport = await ProjectReport.create({
            project_id: project.id,
            report_id: report.id,
            user_id: req.session.user.id
        });

        res.status(201).json({
            success: true,
            message: 'ProjectReport created successfully',
            projectReport
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

        const projectReports = await ProjectReport.findAll({
            include: [
                {model: Project, attributes: ['name', 'slug']},
                {model: Report, attributes: ['name', 'slug']},
                {model: User, attributes: ['name', 'email']}
            ],
            where: {status: status},
            offset,
            limit,
            order: [['createdAt', newest === 'true' ? 'DESC' : 'ASC']]
        });

        res.status(200).json({
            success: true,
            message: 'ProjectReports fetched successfully',
            projectReports
        });

    } catch (error) {
        
    }

}


async function show(req,res,next){

    try {

        const {id} = req.params;
        const projectReport = await ProjectReport.findByPk(id);

        if(!projectReport) return next(createHttpError.NotFound('ProjectReport not found'));

        await projectReport.update({status: 1});

        res.status(200).json({
            success: true,
            message: 'ProjectReport fetched and has been read successfully',
            projectReport
        });

    } catch (error) {
        next(error);
    }

}





async function destroy(req,res,next){

    try {

        const {id} = req.params;
        const projectReport = await ProjectReport.findByPk(id);

        if(!projectReport) return next(createHttpError.NotFound('ProjectReport not found'));

        await projectReport.destroy();
        
        res.status(200).json({
            success: true,
            message: 'ProjectReport deleted successfully'
        });
        
    } catch (error) {
        next(error);
    }

}


async function changeStatus(req,res,next){

    try {
        
        const {id} = req.params;
        const {status} = req.body;

        const projectReport = await ProjectReport.findByPk(id);

        if(!projectReport) return next(createHttpError.NotFound('ProjectReport not found'));

        const updatedProjectReport = await projectReport.update({status: projectReport.status === 1 ? 0 : 1});

        res.status(200).json({
            success: true,
            message: 'ProjectReport status updated successfully',
            projectReport: updatedProjectReport
        });

    } catch (error) {
        next(error);
    }

}



export {create, index, show, update, destroy, changeStatus};