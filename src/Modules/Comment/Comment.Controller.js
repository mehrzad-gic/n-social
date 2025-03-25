import createHttpError from "http-errors";
import Comment from "./CommentModel.js";
import CommentLike from "../CommentLike/CommentLikeModel.js";
import CommentReport from "../CommentReport/CommentReportModel.js";
import User from "../User/UserModel.js";
import pool from "../../Configs/Mysql2.js";
import {createCommentSchema} from "./validation.js";
import {ALLOWED_MODELS} from "./Constants.js";
import Report from "../Report/ReportModel.js";
import deleteChildQueue from "../../Queues/DeleteChildQueue.js";
import Post from "../Post/PostModel.js";
import sequelize from "../../Configs/Sequelize.js";
import logger from "node-color-log";


async function index(req, res, next) {

    const { model, page, limit ,id } = req.query;

    if(!ALLOWED_MODELS.includes(model)) throw new createHttpError.BadRequest('model is not allowed')

    try {

        const pageNumber = parseInt(page) || 1;
        const pageLimit = parseInt(limit) || 20;
        const offset = (pageNumber - 1) * pageLimit;

        // conditions
        const conditions = {
            where: {
                commentable_id: id,
                commentable_type: model.toLowerCase()
            },
            attributes: [
                "id",
                "text",
                "createdAt",
                "likes",
                "status",
                "commentable_id",
                "commentable_type",
                "parent_id",
                "deep"
            ],
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "slug", "email", "img","title"]
                },
            ],
            order: [
                ["createdAt", "DESC"]
            ],
            limit: pageLimit,
            offset: offset
        }



        const comments = await Comment.findAll(conditions)

        const comment_likes = await CommentLike.findAll({
            where: {
                user_id:req.session.user.id
            }
        })

        res.json({
            success: true,
            comment_likes,
            comments,
            message: "Comments fetched successfully"
        })

    } catch (error) {
        next(error)
    }
}


async function show(req, res, next) {

    try {


        const comment = await Comment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "slug", "email", "img"]
                },
                {
                    model: Comment,
                    as: "replies",
                    attributes: ["id", "comment", "created_at"],
                    include: [
                        {
                            model: User,
                            attributes: ["id", "name", "slug", "email", "img"]
                        }
                    ]
                }
            ]
        })

        const comment_model = await pool.query(`SELECT * FROM ?? WHERE ?? = ?`, [comment.commentable_type.toLowerCase(), "id", comment.commentable_id])

        if (!comment) throw new createHttpError.NotFound("Comment not found");

        res.json({
            success: true,
            comment,
            comment_model,
            message: "Comment fetched successfully"
        })

    } catch (error) {

        next(error)
    }
}


async function change_status(req, res, next) {

    try {

        const comment = await Comment.findByPk(req.params.id);

        if (!comment) throw new createHttpError.NotFound("Comment not found");

        comment.status = comment.status == 1 ? 0 : 1;
        await comment.save();

        res.json({
            success: true,
            comment,
            message: "Comment status updated successfully"
        })

    } catch (error) {

    }

}


async function add_reply(req, res, next) {

    try {

        const comment = await Comment.findByPk(req.params.id);

        if (!comment) throw new createHttpError.NotFound("Comment not found");

        const reply = await Comment.create({
            comment: req.body.comment,
            commentable_id: comment.commentable_id,
            commentable_type: comment.commentable_type,
            user_id: req.session.user.id,
            parent_id: comment.id,
            status: 1,
            deep: comment.deep + 1
        })

        res.json({
            success: true,
            reply,
            message: "Reply added successfully"
        })

    } catch (error) {
        next(error)
    }
}


async function delete_comment(req, res, next) {

    try {

        const comment = await Comment.findByPk(req.params.id);

        if (!comment) throw new createHttpError.NotFound("Comment not found");

        await comment.destroy();

        await deleteChildQueue.add({
            model: comment.commentable_type,
            id: comment.commentable_id
        },{delay:1000});

        res.json({
            success: true,
            message: "Comment deleted successfully"
        })

    } catch (error) {
        next(error)
    }

}


async function likeComment(req, res, next) {

    const { comment_id } = req.params;

    try {

        const comment = await Comment.findOne({
            where: { id: comment_id }
        })

        if (!comment) return next(createHttpError.NotFound('Comment not found'));

        const isLiked = await CommentLike.findOne({
            where: { comment_id: comment.id, user_id: req.session.user.id }
        })

        if (isLiked) throw createHttpError.BadRequest('You already liked this comment and this request will not be processed ');

        await comment.increment('likes');

        const like = await CommentLike.create({
            comment_id: comment.id,
            user_id: req.session.user.id,
            status: 1
        })

        res.json({
            success: true,
            like,
            token: req.session.token,
            user: req.session.user,
            message: 'Comment liked successfully'
        });

    } catch (e) {
        next(e);
    }

}


async function unlikeComment(req, res, next) {

    const { comment_id } = req.params;

    try {

        const comment = await Comment.findOne({
            where: { id: comment_id }
        })

        if (!comment) return next(createHttpError.NotFound('Comment not found'));

        const like = await CommentLike.findOne({
            where: { comment_id: comment.id, user_id: req.session.user.id }
        })

        if (!like) return next(createHttpError.NotFound('Like not found'));

        await like.destroy();

        await comment.decrement('likes');

        res.json({
            success: true,
            message: 'Comment unliked successfully',
            token: req.session.token,
            user: req.session.user,
        })

    } catch (e) {
        next(e);
    }
}


async function create(req, res, next) {

    const { id, model } = req.query;

    // Validate model early
    if (!ALLOWED_MODELS.includes(model)) return next(createHttpError.BadRequest('Invalid model'));

    // Validate text early
    const { error } = createCommentSchema.validate(req.body);
    if (error) return next(createHttpError.BadRequest(error.message));

    // Validate session user exists
    if (!req.session?.user?.id) return next(createHttpError.Unauthorized('User not authenticated'));

    let transaction;
    try {

        // Start a transaction
        transaction = await sequelize.transaction();

        let commentAbel = null;
        switch (model.toLowerCase()) { 

            case 'posts':
                commentAbel = await Post.findByPk(id, { transaction });
                if (!commentAbel) throw new createHttpError.NotFound('Post not found');
                await commentAbel.increment('comments_count', { transaction });
            break;

            // other models logic will be implemented soon

            default:
                throw new createHttpError.BadRequest('Model can not be computed');
        }

        const comment = await Comment.create({
            user_id: req.session.user.id,
            text: req.body.text,
            status: 0,
            commentable_id: commentAbel.id,
            commentable_type: model.toLowerCase(),
            deep: 0,
            parent_id: 0
        }, { transaction });


        // new comment
        const newComment = await Comment.findOne({
            attributes: ["id", "text", "createdAt", "likes", "status", "commentable_id", "commentable_type", "parent_id", "deep"],
            where: {id:comment.id},
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "slug", "email", "img"]
                }
            ]
        },{transaction})

        // Commit the transaction
        await transaction.commit();

        // Don't send entire session in response
        res.json({
            success: true,
            comment:newComment,
            message: 'Comment added successfully'
        });

    } catch (e) {

        // Rollback transaction if it exists
        if (transaction) await transaction.rollback();
        
        // Log the error for debugging (consider using a proper logger)
        console.error('Comment creation error:', e);
        
        // Don't expose internal errors to client
        const httpError = e instanceof createHttpError.HttpError 
            ? e 
            : createHttpError.InternalServerError('Failed to create comment');
        next(httpError);

    }

}


async function reportComment(req,res,next){

    try {
        
        const {comment_id} = req.params;

        // check comment
        const comment = await Comment.findByPk(comment_id);
        if(!comment) return next(createHttpError.NotFound('Comment not found'));

        // check if user has already reported this comment
        const isReported = await CommentReport.findOne({where:{comment_id:comment.id,user_id:req.session.user.id}})
        if(isReported) return next(createHttpError.BadRequest('You have already reported this comment'));
        
        // check report
        const checkReport = await Report.findByPk(req.body.report_id);
        if(!checkReport) return next(createHttpError.NotFound('Report not found'));

        const commentReport = await CommentReport.create({
            comment_id:comment.id,
            user_id:req.session.user.id,
            reason:req.body.reason,
            status:0
        })

        res.json({
            success:true,
            commentReport,
            message:'Comment reported successfully'
        })
        
    } catch (error) {
        next(error);
    }
    
}



export { 
    index, show, change_status, add_reply,create,delete_comment,likeComment,unlikeComment,reportComment 
}