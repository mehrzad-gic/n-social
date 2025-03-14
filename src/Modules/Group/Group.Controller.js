import Group from './GroupModel.js';

async function index(req,res,next) {
    try {
        const groups = await Group.findAll();

        res.json({
            success:true,
            groups,
            message:"Groups fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        
    }
}


async function create(req,res,next) {
    try {
        
    } catch (error) {
        
    }
}


async function update(req,res,next) {
    try {
        
    } catch (error) {
        
    }
}


async function destroy(req,res,next) {
    try {
        
    } catch (error) {
        next(error)       
    }
}


async function show(req,res,next) {
    try {
        
    } catch (error) {
        next(error)       
    }
}


async function change_status(req,res,next) {
    try {
        
    } catch (error) {
        next(error)       
    }
}


export default {
    index,
    create,
    update,
    destroy,
    show,
    change_status
}