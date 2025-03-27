import ReportModel from "./ReportModel.js";
import {schema} from "./validation.js";
import {makeSlug} from "../../Helpers/Helper.js"; // Adjust the path as necessary

async function index(req,res,next){

    try{

        const reports = await ReportModel.findAll();

        return res.status(200).json({success: true, reports});

    } catch (error) {
        next(error);
    }

}

async function show(req,res,next){

    try{

        const {slug} = req.params;

        const report = await ReportModel.findOne({where: {slug}});

        if(!report) return res.status(404).json({message: "Report not found",success: false});

        return res.status(200).json({success: true, report});

    } catch (error) {
        next(error);
    }

}

async function create(req,res,next){

    try{

        const {error} = schema.validate(req.body);

        if(error) return res.status(400).json({message: error.message});

        const report = await ReportModel.create({
            name: req.body.name,
            status: req.body.status,
            rate: req.body.rate,
            slug: await makeSlug(req.body.name,'reports')
        });

        return res.status(200).json({message: "Report created successfully",success: true,report});

    } catch (error) {
        next(error);
    }

}

async function update(req,res,next){

    try{

        const {slug} = req.params;

        const report = await ReportModel.findOne({where: {slug}});

        if(!report) return res.status(404).json({message: "Report not found"});

        const {error} = schema.validate(req.body);

        if(error) return res.status(400).json({message: error.message});

        const updatedReport = await report.update({
            name: req.body.name,
            status: req.body.status,
            rate: req.body.rate
        });

        return res.status(200).json({message: "Report updated successfully",success: true,updatedReport});

    } catch (error) {
        next(error);
    }

}

async function destroy(req,res,next){

    try{

        const {slug} = req.params;

        const report = await ReportModel.findOne({where: {slug}});

        if(!report) return res.status(404).json({message: "Report not found",success: false});

        await report.destroy();

        return res.status(200).json({message: "Report deleted successfully",success: true});

    } catch (error) {
        next(error);
    }

}

async function change_status(req,res,next){

    try{

        const {slug} = req.params;

        const report = await ReportModel.findOne({where: {slug}});

        if(!report) return res.status(404).json({message: "Report not found",success: false});

        report.status = report.status == 0 ? 1 : 0;

        await report.save();

        return res.status(200).json({message: "Report status updated successfully",success: true,report});

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