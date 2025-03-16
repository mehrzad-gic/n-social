import PostTag from "./PostTagModel.js";
import createError from "http-errors";
import Post from "../Post/PostModel.js";
import Tag from "../Tag/TagModel.js";


async function post_tags(req, res, next) {

    try {
        
        const {id} = req.params;
        const post = await Post.findByPk(id);
        if(!post) throw createError.NotFound("Post not found");

        const postTags = await PostTag.findAll({
            where: {
                post_id: id
            },
            include: [
                {
                    model: Tag,
                    attributes: ["id","name","slug"]
                }
            ]
        });
        
        res.status(200).json({
            message: "Post tags fetched successfully",
            postTags,
            status: true
        });

    } catch (error) {
        next(error);
    }

}



async function tag_posts(req, res, next) {

    try {
        
        const {id} = req.params;
        const tag = await Tag.findByPk(id);
        if(!tag) throw createError.NotFound("Tag not found");

        const tagPosts = await PostTag.findAll({
            where: {
                tag_id: id
            },
            include: [
                {
                    model: Post,
                    attributes: ["id", "name", "slug",'img','imgs','des','likes']
                }
            ]
        });

        res.status(200).json({
            message: "Tag posts fetched successfully",
            tagPosts,
            status: true
        });

    } catch (error) {
        next(error);
    }

}


async function clear(req, res, next) {

    try {
        
        const {id} = req.params;
        const post = await Post.findByPk(id);
        if(!post) throw createError.NotFound("Post not found");

        await PostTag.destroy({
            where: {
                post_id: id
            }
        });

        res.status(200).json({
            message: "Post tags cleared successfully",
            status: true
        });

    } catch (error) {
        next(error);
    }

}

export { post_tags, tag_posts, clear };



