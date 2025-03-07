import Post from "./PostModel.js";
import User from "../User/UserModel.js";
import Group from "../Group/GroupModel.js";
import LikePost from "../LikePost/LikePostModel.js"; // Import LikePost model
import Save from "../Save/SaveModel.js"; // Import Save model
import { Sequelize } from "sequelize"; // Import Sequelize

async function index(req, res, next) {

    try {
    
        const user = req.user; // Assuming the user is attached to the request object

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 3;
        const offset = (page - 1) * limit;

        // Fetch posts with related user and group data, and liked/saved status
        const posts = await Post.findAll({
            where: { status: 1 },
            include: [
                {
                    model: User,
                    attributes: ['id', 'slug', 'title', 'name', 'email', 'img']
                },
                {
                    model: Group,
                    attributes: ['id', 'name', 'img', 'slug']
                }
            ],
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM like_post AS like
                            WHERE
                                like.post_id = Post.id
                                AND like.user_id = ${user.id}
                        )`),
                        'isLiked'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM save AS save
                            WHERE
                                save.saveable_id = Post.id
                                AND save.user_id = ${user.id}
                        )`),
                        'isSaved'
                    ]
                ]
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            posts,
            success: true
        });

    } catch (error) {
        next(error);
    }
}

// find by slug
async function show(req, res, next) {
    try {
        const post = await Post.findOne({
            where: {
                slug: req.params.slug
            }
        });
        res.json(post);
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const post = await Post.create(req.body);
        res.json(post);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const post = await Post.update(req.body, {
            where: {
                slug: req.params.slug
            }
        });
        res.json(post);
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        const post = await Post.destroy({
            where: {
                slug: req.params.slug
            }
        });
        res.json(post);
    } catch (error) {
        next(error);
    }
}

async function change_status(req, res, next) {
    try {
        const { slug } = req.params;
        const post = await Post.findOne({
            where: {
                slug
            }
        });
        post.status = post.status === 1 ? 0 : 1;
        await post.save();
        res.json(post);
    } catch (error) {
        next(error);
    }
}

export default {
    index,
    show,
    store,
    update,
    destroy,
    change_status
};