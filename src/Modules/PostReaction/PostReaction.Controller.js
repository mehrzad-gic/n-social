import PostReaction from "./PostReactionModel.js";
import createHttpError from "http-errors";
import Post from "../Post/PostModel.js";
import User from "../User/UserModel.js";
import { schema } from "./validation.js";

async function index(req, res, next) {


    const { id } = req.params;

    try {

        if (!id) return next(new createHttpError.BadRequest("Post id is required."));
        
        const postReactions = await PostReaction.findAll({
            where: {
                post_id: id
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name",'slug','email','img']
                },
                {
                    model: Post,
                    as: "post",
                    attributes: ["id", "name", "slug"]
                }
            ]
        });

        res.json({
            success: true,
            message: "Post reactions fetched successfully",
            postReactions,
            token: req.session.token,
            user: req.session.user,
        });

    } catch (err) {
        next(err);
    }

}



async function store(req, res, next) {

    const { id } = req.params;

    try {

        const {error} = await schema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const post = await Post.findByPk(id);
        if (!post) return next(new createHttpError.NotFound("Post not found."));

        const postReaction = await PostReaction.create({
            user_id: req.session.user.id,
            post_id: post.id,
            type: req.body.reaction,
            status: 1,
        });

        res.json({
            success: true,
            message: "Post reaction created successfully",
            postReaction,
            token: req.session.token,
            user: req.session.user,
        });

    } catch(err){
        next(err);
    }

}


async function unDo(req,res,next){

    try {

        const { id } = req.params;

        const postReaction = await PostReaction.findOne({
            where: {
                id,
                user_id: req.session.user.id,
                type: req.body.type
            }
        });

        if (!postReaction) return next(new createHttpError.NotFound("Post reaction not found."));

        await postReaction.destroy();

        res.json({
            success: true,
            message: "Post reaction undone successfully",
            token: req.session.token,
            user: req.session.user,
        });

    } catch (err){
        next(err);
    }

}


export{ index, store, unDo };