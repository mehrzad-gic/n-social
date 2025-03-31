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
import sequelize from "../../Configs/Sequelize.js";

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

    let transaction;
    
    try {

        // Start transaction
        transaction = await sequelize.transaction();

        // Validate required fields
        const { name, text, tags } = req.body;
        if (!name || !text) {
            throw new createHttpError.BadRequest('Name and text are required');
        }

        // Generate slug
        const slug = await makeSlug(name, 'posts');

        // Create post and increment user's post count in parallel
        const [post, userUpdate] = await Promise.all([
            Post.create({
                name,
                text,
                slug,
                user_id: req.session.user.id,
                comment_status: 1,
                status: 1 // Add default status
            }, { transaction }),
            User.increment('post_count', {
                by: 1,
                where: { id: req.session.user.id },
                transaction 
            })
        ]);


        // Handle tags if provided
        if (tags && Array.isArray(tags) && tags.length > 0) {
            const tagRecords = tags.map(tagId => ({
                post_id: post.id,
                tag_id: tagId
            }));
            await PostTag.bulkCreate(tagRecords, { transaction });
        }

        // Queue the file upload job
        if (req.files && req.files.length > 0) {
            await UploadQueue.add('post-upload', {
                files: req.files,
                postId: post.id
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000
                }
            });
        }

        // Commit transaction
        await transaction.commit();

        res.json({
            success: true,
            message: 'Post created successfully',
        });

    } catch (error) {

        // Rollback transaction if it exists
        if (transaction) {
            await transaction.rollback();
        }

        // Log error for debugging
        console.error('Post creation error:', error);

        // Handle specific error types
        if (error instanceof createHttpError.HttpError) {
            next(error);
        } else {
            next(new createHttpError.InternalServerError('Failed to create post'));
        }
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

async function changeStatus(req, res, next) {
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

        const {id} = req.params;

        const post = await Post.findOne({
            where:{id}
        })

        if(!post) return next(createHttpError.NotFound('Post not found'));
        

        let save = await Save.findOne({
            where:{saveable_id:post.id,user_id:req.session.user.id}
        })
    
        let type = null;
        if(save){
            await save.destroy();
            type = 'decrement';
        }else{
            save = await Save.create({
                saveable_id:post.id,
                saveable_type:'posts',
                user_id:req.session.user.id,
                status:1
            })
            type = 'increment';
        }

        res.json({
            success:true,
            type,
            token:req.session.token,
            user:req.session.user,
            message : 'Post saved successfully'
        });

    }catch(e){
        next(e);
    }

}


//! PostLike Actions --------------------------------------------
async function like(req,res,next) {
    
    const {id} = req.params;

    try{

        const post = await Post.findByPk(id);

        if(!post) return next(createHttpError.NotFound('Post not found'));
        
        const isLiked = await LikePost.findOne({
            where:{post_id:post.id,user_id:req.session.user.id}
        })

        let type = null;
        if(!isLiked) {
            type = 'increment';
            await post.increment('likes');
            await LikePost.create({
                post_id:post.id,
                user_id:req.session.user.id,
                status:1
            })
        }else{
            type = 'decrement';
            await post.decrement('likes');
            await isLiked.destroy();
        }

        res.json({
            type,
            success:true,
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



export {
    index,
    show,
    store,
    update,
    destroy,
    changeStatus,
    like,
    comments,
    save,
    unlike
};