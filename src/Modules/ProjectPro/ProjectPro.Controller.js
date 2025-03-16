import ProjectPro from './ProjectProModel.js';
import { projectProValidation } from './validation.js';
import createHttpError from 'http-errors';


async function create(req,res,next){

    try {
        
        const {name, des, color, price} = req.body;
        const {error} = projectProValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));

        const projectPro = await ProjectPro.create({name, des, color, price});

        res.status(201).json({
            success: true,
            message: 'ProjectPro created successfully',
            projectPro
        });

    } catch (error) {
        next(error);
    }

}


async function index(req,res,next){

    try {
     
        const projectPros = await ProjectPro.findAll();

        res.status(200).json({
            success: true,
            message: 'ProjectPros fetched successfully',
            projectPros
        });
        
    } catch (error) {
        next(error);
    }

}


async function show(req,res,next){

    try {
        
        const {id} = req.params;
        const projectPro = await ProjectPro.findByPk(id);

        if(!projectPro) return next(createHttpError.NotFound('ProjectPro not found'));

        res.status(200).json({
            success: true,
            message: 'ProjectPro fetched successfully',
            projectPro
        });

    } catch (error) {
        next(error);
    }
}


async function update(req,res,next){

    try {
    
        const {id} = req.params;
        const {name, des, color, price} = req.body;
        const {error} = projectProValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));

        const projectPro = await ProjectPro.findByPk(id);
        if(!projectPro) return next(createHttpError.NotFound('ProjectPro not found'));
        
        const updatedProjectPro = await projectPro.update({name, des, color, price});

        res.status(200).json({
            success: true,
            message: 'ProjectPro updated successfully',
            projectPro: updatedProjectPro
        });

    } catch (error) {
        next(error);
    }

}


async function destroy(req,res,next){

    try {
 
        const {id} = req.params;
        const projectPro = await ProjectPro.findByPk(id);

        if(!projectPro) return next(createHttpError.NotFound('ProjectPro not found'));

        await projectPro.destroy();

        res.status(200).json({
            success: true,
            message: 'ProjectPro deleted successfully'
        });

    } catch (error) {
        next(error);
    }

}



async function changeStatus(req,res,next){

    try {
        
        const {id} = req.params;
        const projectPro = await ProjectPro.findByPk(id);
        if(!projectPro) return next(createHttpError.NotFound('ProjectPro not found'));

        const updatedProjectPro = await projectPro.update({status: projectPro.status === 1 ? 0 : 1});

        res.status(200).json({
            success: true,
            message: 'ProjectPro status updated successfully',
            projectPro: updatedProjectPro
        });

    } catch (error) {
        next(error);
    }

}

export {create, index, show, update, destroy, changeStatus};