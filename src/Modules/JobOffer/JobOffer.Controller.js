import JobOffer from './JobOfferModel.js';
import jobOfferValidation from './validation.js';
import createHttpError from 'http-errors';
import Company from '../Company/CompanyModel.js';
import Category from '../Category/CategoryModel.js';
import Salary from '../Salary/SalaryModel.js';
import Report from '../Report/ReportModel.js';
import JobOfferReport from '../JobOfferReport/JobOfferReportModel.js';
import makeSlug from '../../Helpers/Helper.js';


async function index(req,res,next){

    try {

        const jobOffers = await JobOffer.findAll(
            {
                include:[
                    {
                        model:Company,
                        attributes:['name','slug','img']
                    },
                    {
                        model:Category,
                        attributes:['name','slug']
                    },
                    {
                        model:Salary,
                        attributes:['salary']
                    }       
                ]
            }
        );

        res.status(200).json({
            success:true,
            message:'Job offers fetched successfully',
            jobOffers
        });

    } catch (error) {
        next(error);
    }

}


async function create(req,res,next){

    try {
        
        const {error} = jobOfferValidation.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const {name,des,company_id,category_id,salary_id,type,number,level} = req.body;

        // Fetch company, category, and salary in a single query
        const [company, category, salary] = await Promise.all([
            Company.findOne({ where: { id: company_id } }),
            Category.findOne({ where: { id: category_id } }),
            Salary.findOne({ where: { id: salary_id } }),
        ]);

        if(!company) return next(createHttpError.NotFound('Company not found'));
        if(!category) return next(createHttpError.NotFound('Category not found'));
        if(!salary) return next(createHttpError.NotFound('Salary not found'));
        
        const slug = await makeSlug(name,'job_offers');

        const jobOffer = await JobOffer.create({
            name,
            des,
            slug,
            company_id,
            category_id,
            salary_id,
            type,
            number,
            level,
        });

        res.status(201).json({
            success:true,
            message:'Job offer created successfully',
            jobOffer
        });

    } catch (error) {
        next(error);
    }

}


async function update(req,res,next){

    try {
        
        const {name,des,category_id,salary_id,type,number,level} = req.body;
        const {error} = jobOfferValidation.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const {id} = req.params;

        const jobOffer = await JobOffer.findOne({
            where:{
                id,
                salary_id:salary_id,
                category_id:category_id,
            }
        });

        if(!jobOffer) return next(createHttpError.NotFound('Job offer not found'));

        await jobOffer.update({
            name,
            des,
            category_id,
            salary_id,
            type,
            number,
            level,
        });

        res.status(200).json({
            success:true,
            message:'Job offer updated successfully',
        });

    } catch (error) {
        next(error);
    }   

}


async function destroy(req,res,next){

    try {

        const {id} = req.params;

        const jobOffer = await JobOffer.findOne({
            where:{
                id
            }
        });

        if(!jobOffer) return next(createHttpError.NotFound('Job offer not found'));

        await jobOffer.destroy();

        res.status(200).json({
            success:true,
            message:'Job offer deleted successfully',
        });
    } catch (error) {
        next(error);
    }

}


async function change_status(req,res,next){

    try {
     
        const {id} = req.params;

        const jobOffer = await JobOffer.findByPk(id);
        if(!jobOffer) return next(createHttpError.NotFound('Job offer not found'));

        await jobOffer.update({status:jobOffer.status === 0 ? 1 : 0});

        res.status(200).json({
            success:true,
            message:'Job offer status updated successfully',
        });
        
    } catch (error) {
        next(error);
    }

}


async function show(req,res,next){

    try {
        
        const {id} = req.params;

        const jobOffer = await JobOffer.findOne({
            where:{
                id
            },
            include:[
                {
                    model:Company,
                    attributes:['name','slug','img']
                },
                {
                    model:Category,
                    attributes:['name','slug']
                },
                {
                    model:Salary,
                    attributes:['salary']
                }
            ]
        });

        if(!jobOffer) return next(createHttpError.NotFound('Job offer not found'));
        
        res.status(200).json({
            success:true,
            message:'Job offer fetched successfully',
            jobOffer
        });

    } catch (error) {
        next(error);
    }

}


async function report(req,res,next){

    try {
        
        const {id} = req.params;
        const jobOffer = await JobOffer.findByPk(id);
        if(!jobOffer) return next(createHttpError.NotFound('Job offer not found'));

        const {report_id} = req.body;
        const report = await Report.findByPk(report_id);
        if(!report) return next(createHttpError.NotFound('Report not found'));

        const jobOfferReport = await JobOfferReport.create({
            job_offer_id:id,
            report_id:report_id,
            user_id:req.session.user.id
        });

        res.status(200).json({
            success:true,
            message:'Job offer reported successfully',
            jobOfferReport
        });

    } catch (error) {
        next(error);
    }

}


export {index,create,update,destroy,change_status,show,report};

