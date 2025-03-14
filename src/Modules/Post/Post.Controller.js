import Post from "./PostModel.js";
import User from "../User/UserModel.js";
import Group from "../Group/GroupModel.js";
import LikePost from "../LikePost/LikePostModel.js"; // Import LikePost model
import Save from "../Save/SaveModel.js"; // Import Save model
import createHttpError from "http-errors";
import { uploadImages, deleteImage } from '../../Helpers/Upload.js'; // Adjust the path as necessary
import {makeSlug} from '../../Helpers/Helper.js'; 
import PostTag from "../PostTag/PostTagModel.js";
import UploadQueue from "../../Queues/UpoladQueue.js";
import Comment from "../Comment/CommentModel.js";
import LikeComment from "../CommentLike/CommentLikeModel.js";


// Fetch all posts with related user and group data
// Also include liked/saved status for the current user if available in the session object
// 1. Fetch the current user from the session object (req.session.user) and check if it exists or not
// 2. Fetch posts with related user and group data, and liked/saved status
// 3. Send the posts data in the response
// 4. Handle errors if any and pass them to the error handling middleware
// 5. Add pagination to the posts data
// 6. Get the page number from the query parameters and calculate the offset
// 7. Fetch posts with related user and group data, and liked/saved status with pagination and send the response
// 8. Handle errors if any and pass them to the error handling middleware 
async function index(req, res, next) {

    try {

        // 1. Fetch the current user from the session object
        const currentUser = req.session.user;

        if (!currentUser) {
            return next(createHttpError.Unauthorized('User not authenticated'));
        }

        // 2. Get pagination parameters from the query
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 3; // Number of posts per page
        const offset = (page - 1) * limit;

        // 3. Fetch posts with related user and group data
        const posts = await Post.findAll({
            where: { status: 1 }, // Only fetch active posts
            include: [
                {
                    model: User,
                    attributes: ['slug', 'title', 'name', 'email', 'img']
                },
                {
                    model: Group,
                    attributes: ['name', 'img', 'slug']
                }
            ],
            order: [['createdAt', 'DESC']], // Sort by creation date (newest first)
            limit,
            offset
        });

        // 4. Fetch liked and saved post IDs for the current user
        const likedPosts = await LikePost.findAll({
            where: {
                user_id: currentUser.id,
                status: 1
            },
            attributes: ['post_id']
        });

        const savedPosts = await Save.findAll({
            where: {
                user_id: currentUser.id,
                saveable_type : 'Post',
                status: 1
            },
            attributes: ['saveable_id']
        });

        // 5. Send the response with posts, pagination, and user data
        res.json({
            posts: posts,
            token: req.session.token,
            user: req.session.user,
            likedPosts: likedPosts.map(like => like.post_id),
            savedPosts: savedPosts.map(save => save.saveable_id),
            pagination: {
                page,
                limit,
            },
            success: true,
        });

    } catch (error) {
        // 6. Handle errors and pass them to the error-handling middleware
        next(error);
    }
}

async function show(req, res, next) {
    try {

        const currentUser = req.session.user;

        if (!currentUser) {
            return next(createHttpError.Unauthorized('User not authenticated'));
        }
        const post = await Post.findOne({
            where: {
                slug: req.params.slug
            }
        });

        if(!post){
            return next(createHttpError.NotFound('Post not found'));
        }

        res.json({
            success:true,
            post,
            token:req.session.token,
            user:req.session.user,
            message : 'Post fetched successfully'
        });
    } catch (error) {
        next(error);
    }
}
 
async function store(req, res, next) {
  
    try {

        // req.body
        const {name,text,tags} = req.body;
    
        // slug
        const slug = await makeSlug(name,'posts');

        // create post
        const post = await Post.create({
            name,
            text,
            slug,
            user_id : req.session.user.id,
            comment_status : 1
        });

        // sync tags to post_tags pivot table
        if (tags && Array.isArray(tags)) {
            const tagPromises = tags.map(tagId => {
                return PostTag.create({
                    post_id: post.id,
                    tag_id: tagId
                });
            });
            await Promise.all(tagPromises);
        }
                
        // Queue the file upload job
        await UploadQueue.add('post-upload', {
            files: req.files,
            postId: post.id // Pass the post ID to associate with the upload
        });

        // response
        res.json({
            success:true,
            message:'Post Created Successfully and file be upload very soon',
            post
        });
        
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Failed to upload files' });
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
        await Post.destroy({
            where: {
                slug: req.params.slug
            }
        });
        res.json({
            success:true,
            message:'Post deleted successfully',
            token:req.session.token,
            user:req.session.user,
        });
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
        res.json({
            success:true,
            message:'Post status changed successfully',
            token:req.session.token,
            user:req.session.user,
            post
        });
    } catch (error) {
        next(error);
    }
}

async function comments(req,res,next) {

    const {slug} = req.params;
    
    try{

        const post = await Post.findOne({
            where:{slug:slug}
        })

        if(!post){
            return next(createHttpError.NotFound('Post not found'));
        }   

        const comments = await Comment.findAll({
            where:{post_id:post.id}
        })


        res.json({
            success:true,
            comments,
            token:req.session.token,
            user:req.session.user,
            message : 'Comments fetched successfully'
        });

    }catch(e){
        next(e);
    }

}






//! PostSave Actions --------------------------------------------
async function save(req,res,next) {
    
    try{

        const post = await Post.findOne({
            where:{slug:slug}
        })

        if(!post){
            return next(createHttpError.NotFound('Post not found'));
        }

        let save = await Save.findOne({
            where:{saveable_id:post.id,user_id:req.session.user.id}
        })

        if(save){
            await save.destroy();
        }else{
            save = await Save.create({
                saveable_id:post.id,
                saveable_type:'posts',
                user_id:req.session.user.id,
                status:1
            })
        }

        res.json({
            success:true,
            save,
            token:req.session.token,
            user:req.session.user,
            message : 'Post saved successfully'
        });

    }catch(e){
        next(e);
    }

}

async function removeSave(req,res,next) {

    const {slug} = req.params;

    try{

        const post = await Post.findOne({
            where:{slug:slug}
        })

        if(!post) return next(createHttpError.NotFound('Post not found'));

        const save = await Save.findOne({
            where:{saveable_type:'posts',saveable_id:post.id,user_id:req.session.user.id}
        })

        if(!save) return next(createHttpError.NotFound('Save not found'));

        await save.destroy();

        res.json({
            success:true,
            message:'Post removed from saved',
            token:req.session.token,
            user:req.session.user,
        })

    }catch(e){
        next(e);
    }

}



//! PostLike Actions --------------------------------------------
async function like(req,res,next) {
    
    const {slug} = req.params;

    try{

        const post = await Post.findOne({
            where:{slug:slug}
        })

        if(!post) return next(createHttpError.NotFound('Post not found'));
        
        const isLiked = await LikePost.findOne({
            where:{post_id:post.id,user_id:req.session.user.id}
        })

        if(isLiked) throw createHttpError.BadRequest('You already liked this post and this request will not be processed ');

        await post.increment('likes');

        const like = await LikePost.create({
            post_id:post.id,
            user_id:req.session.user.id,
            status:1
        })

        res.json({
            success:true,
            like,
            token:req.session.token,
            user:req.session.user,
            message : 'Post liked successfully'
        });

    } catch(e){

        next(e);
    }

}

async function unlike(req,res,next){

    const {slug} = req.params;

    try{

        const post = await Post.findOne({
            where:{slug:slug}
        })

        if(!post) return next(createHttpError.NotFound('Post not found'));

        const like = await LikePost.findOne({
            where:{post_id:post.id,user_id:req.session.user.id}
        })

        if(!like) return next(createHttpError.NotFound('Like not found'));

        await like.destroy();

        await post.decrement('likes');

        res.json({
            success:true,
            message:'Post unliked successfully',
            token:req.session.token,
            user:req.session.user,
        });

    }catch(e){
        next(e);
    }



}



export default {
    index,
    show,
    store,
    update,
    destroy,
    change_status,
    like,
    comments,
    save,
    removeSave,
    unlike
};