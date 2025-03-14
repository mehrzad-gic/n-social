import Company from "./CompanyModel.js";
import { createCompanySchema, updateCompanySchema } from "./validation.js";
import createHttpError from "http-errors";
import UploadQueue from "../../Queues/UploadQueue.js";
import CompanyReport from "../CompanyReport/CompanyReportModel.js";
import Project from "../Project/ProjectModel.js";



async function index(req, res, next) {

    try {

        const companies = await Company.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            companies
        });

    } catch (error) {
        next(error);
    }

}


async function show(req, res, next) {

    try {

        const company = await Company.findByPk(req.params.id,{
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!company) return next(createHttpError.NotFound("Company not found"));

        res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            company
        });

    } catch (error) {
        next(error);
    }

}


async function create(req, res, next) {

    try {

        const { error } = createCompanySchema.validate(req.body);
        if (error) return next(createHttpError.BadRequest(error.message));

        const company = await Company.create({
            name: req.body.name,
            des: req.body.des,
            revenue: req.body.revenue,
            type: req.body.type,
            sector: req.body.sector,
            size: req.body.size,
            user_id: req.session.user.id
        });

        // Queue the file upload job
        await UploadQueue.add('company-upload', {
            img: req.files.img,
            img_bg: req.files.img_bg,
            company: company // Pass the post ID to associate with the upload
        });

        res.status(201).json({ 
            success: true,
            message: "Company created successfully",
            company
        });
    } catch (error) {

        next(error);
    }
} 


async function update(req, res, next) {

    try {

        const { error } = updateCompanySchema.validate(req.body);
        if (error) return next(createHttpError.BadRequest(error.message));

        const company = await Company.findByPk(req.params.id);
        if (!company) return next(createHttpError.NotFound("Company not found"));

        const updatedCompany = await company.update({
            name: req.body.name,
            des: req.body.des,
            revenue: req.body.revenue,
            type: req.body.type,
            sector: req.body.sector,
            size: req.body.size,
            img: company.img,
            img_bg: company.img_bg
        });

    
        // Queue the file upload job
        await UploadQueue.add('company-upload', {
            img: req.files.img,
            img_bg: req.files.img_bg,
            company: company
        });

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            updatedCompany
        });

    } catch (error) {

        next(error);
    }
}


async function destroy(req, res, next) {

    try {

        const company = await Company.findByPk(req.params.id);
        if (!company) return next(createHttpError.NotFound("Company not found"));

        await company.destroy();

        // Queue the file delete job
        await UploadQueue.add('deleteFile', {
            file: JSON.parse(company.img),
            files: JSON.parse(company.img_bg)
        });

        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}


async function change_status(req, res, next) {

    try {

        const company = await Company.findByPk(req.params.id);
        if (!company) return next(createHttpError.NotFound("Company not found"));

        await company.update({ status: company.status === 1 ? 0 : 1 });

        res.status(200).json({
            success: true,
            message: "Company status updated successfully"
        });

    } catch (error) {

        next(error);
    }
}


async function report(req,res,next){

    try {

        const company = await Company.findByPk(req.params.id);
        if (!company) return next(createHttpError.NotFound("Company not found"));

        const report = await CompanyReport.findByPk(req.body.report_id);
        if(!report) return next(createHttpError.NotFound("Report not found"));

        if(req.body.project_id){
            const project = await Project.findByPk(req.body.project_id);
            if(!project) return next(createHttpError.NotFound("Project not found"));
        }

        await CompanyReport.create({
            company_id: company.id,
            user_id: req.session.user.id,
            project_id: req.body.project_id,
            report_id: req.body.report_id
        });
        
        res.status(200).json({
            success: true,
            message: "Company reported successfully",
        });

    } catch (error) {
        next(error);
    }

}


export {
    index,
    show,
    create,
    update,
    destroy,
    change_status,
    report
}





