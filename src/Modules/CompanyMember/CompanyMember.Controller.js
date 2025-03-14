import CompanyMember from "./CompanyMemberModel.js";
import { CompanyMemberSchema } from "./validation.js";
import createHttpError from "http-errors";
import User from "../User/UserModel.js";
import Company from "../Company/CompanyModel.js";

async function index(req,res,next){
 
    const {id} = req.params;

    try {

        const companyMembers = await CompanyMember.findAll({
            where: {
                company_id: id
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'slug', 'img', 'name', 'email']
                },
                {
                    model: Company,
                    as: 'company',
                    attributes: ['id', 'name', 'des','img']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Company member fetched successfully",
            companyMembers
        });
        
        
    } catch (error) {
        
    }
}


async function show(req,res,next){
 
    try {

        const {id} = req.params;

        const companyMember = await CompanyMember.findByPk(id,{
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'slug', 'img', 'name', 'email']
                },
                {
                    model: Company,
                    as: 'company',
                    attributes: ['id', 'name', 'des','img']
                }
            ]
        });

        if(!companyMember) return next(createHttpError.NotFound("Company member not found"));

        res.status(200).json({
            success: true,
            message: "Company member fetched successfully",
            companyMember
        });
        
    } catch (error) {
        next(error);
    }

}


async function create(req,res,next){
   
    try {

        const {error} = CompanyMemberSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const company = await Company.findByPk(req.body.company_id);
        if(!company) return next(createHttpError.NotFound("Company not found"));

        const companyMember = await CompanyMember.create({
            title: req.body.title,
            des: req.body.des,
            status: req.body.status,
            company_id: req.body.company_id,
            user_id: req.session.user.id,
            company_obj: JSON.stringify(company),
            user_obj: JSON.stringify(req.session.user)
        });
        
        res.status(201).json({
            success: true,
            message: "Company member created successfully",
            companyMember
        });
        
    } catch (error) {
        next(error);
    }
}


async function update(req,res,next){
   
    try {
   
        const {id} = req.params;

        const {error} = CompanyMemberSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const companyMember = await CompanyMember.findByPk(id);
        if(!companyMember) return next(createHttpError.NotFound("Company member not found"));

        await companyMember.update({
            title: req.body.title,
            des: req.body.des,
            status: req.body.status,
            company_obj: JSON.stringify(companyMember),
            user_obj: JSON.stringify(req.session.user)
        });

        res.status(200).json({
            success: true,
            message: "Company member updated successfully",
            companyMember
        });
        
    } catch (error) {
        next(error);
    }

}


async function destroy(req,res,next){
    
    try {
    
        const {id} = req.params;

        const companyMember = await CompanyMember.findByPk(id);
        if(!companyMember) return next(createHttpError.NotFound("Company member not found"));

        await companyMember.destroy();
        
        res.status(200).json({
            success: true,
            message: "Company member deleted successfully"
        });
        
    } catch (error) {
        next(error);
    }

}


async function change_status(req,res,next){

    try {

        const {id} = req.params;

        const companyMember = await CompanyMember.findByPk(id);
        if(!companyMember) return next(createHttpError.NotFound("Company member not found"));

        companyMember.status = companyMember.status === 1 ? 0 : 1;
        await companyMember.save();

        res.status(200).json({
            success: true,
            message: "Company member status changed successfully"
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
    change_status
}
