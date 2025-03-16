import PostReport from "./PostReport.Model";
import createError from "http-errors";
import { postReportValidation } from "./validation";
import Post from "../Post/Post.Model";
import Report from "../Report/Report.Model";
import { Op } from "sequelize";
import User from "../User/User.Model";


const create = async (req, res, next) => {

    try{

        const {id} = req.params;
        const {report_id} = req.body;

        const post = await Post.findByPk(id);
        if(!post) throw createError.NotFound("Post not found");

        const report = await Report.findByPk(report_id);
        if(!report) throw createError.NotFound("Report not found");

        const postReport = await PostReport.create({
            post_id: id,
            user_id: req.user.id,
            report_id: report_id,
        });

        res.status(201).json({
            message: "Post report created successfully",
            postReport
        });

    } catch (error) {
        next(error);
    }
    
}


const index = async (req, res, next) => {

    try {

        const {page, limit,status} = req.query;
        const offset = (page - 1) * limit;

        const postReports = await PostReport.findAll({
            where: {
                status: status
            },
            include: [
                {
                    model: Post,
                    attributes: ["id", "name",'slug']
                },
                {
                    model: Report,
                    attributes: ["id", "name"]
                },
                {
                    model: User,
                    attributes: ["id", "name",'slug']
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            offset: offset,
            limit: limit
        });


        res.status(200).json({
            message: "Post reports fetched successfully",
            postReports
        });

    } catch (error) {
        next(error);
    }

}


async function show(req, res, next) {

    try {
   
        const {id} = req.params;
        const postReport = await PostReport.findByPk(id);
        if(!postReport) throw createError.NotFound("Post report not found");
   
        postReport.status = 1;
        await postReport.save();

        res.status(200).json({
            message: "Post report has been seen successfully",
            postReport
        });

    } catch (error) {
        next(error);
    }

}


async function destroy(req, res, next) {

    try {
        
        const {id} = req.params;

        const post = await Post.findByPk(id);
        if(!post) throw createError.NotFound("Post not found");

        const postReport = await PostReport.findOne({
            where: {
                post_id: id,
                user_id: req.user.id
            }
        });
        if(!postReport) throw createError.NotFound("Post report not found");

        await postReport.destroy();

        res.status(200).json({
            status: true,
            message: "Post report deleted successfully",
        });

    } catch (error) {
        next(error);
    }

}

export { create, index, show, destroy };
