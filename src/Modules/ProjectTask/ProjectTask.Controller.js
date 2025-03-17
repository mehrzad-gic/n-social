import ProjectTask from "./ProjectTaskModel.js";
import { projectTaskValidation } from "./validation.js";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import Project from "../Project/ProjectModel.js";
import User from "../User/UserModel.js";



// get all tasks
// limit,page,newest,status,without_parent,with_parent,project_id
// newest: true, false (true: newest first, false: oldest first)
// status: 0, 1, 2 (0: pending, 1: done, 2: rejected)
// without_parent: true, false (true: without parent, false: with parent)
// with_parent: true, false (true: with parent, false: without parent)
// project_id: project_id (number)
async function index(req, res, next) {

    try{

        let {limit,page,newest,status,without_parent,with_parent,project_id} = req.query;

        limit = parseInt(limit);
        page = parseInt(page);
        const offset = (page - 1) * limit;
        const where = {};
        const order = [];

        order.push(['createdAt', newest ? 'DESC' : 'ASC']);
        if(status) where.status = status;
        if(without_parent) where.parent_id = {[Op.eq]: 0};
        if(with_parent) where.parent_id = {[Op.ne]: 0};
        if(project_id) where.project_id = parseInt(project_id);
        

        const tasks = await ProjectTask.findAndCountAll({
            where,
            include: [
                {
                    model: Project,
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email','slug','img']
                }
            ],
            order,
            limit,
            offset
        });

        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks
        });

    } catch (error) {
        next(error);
    }
}


export async function create(req, res, next) {

    try{

        const {slug} = req.params;
        const { name, time, des, parent_id } = req.body;

        // validate request body
        const { error } = projectTaskValidation.validate(req.body);
        if (error) return next(createHttpError(422, error.message));

        // check if project exists
        const project = await Project.findOne({ where: { slug } });
        if (!project) return next(createHttpError(404, "Project not found"));

        // check if parent task exists
        if(parent_id) {
            const parentTask = await ProjectTask.findByPk(parent_id);
            if (!parentTask) return next(createHttpError(404, "Parent task not found"));
            if(parentTask.parent_id !== 0) return next(createHttpError(422, "Parent task cannot be a child task"));
        }

        // create task
        const task = await ProjectTask.create({
            name,
            time,
            des,
            parent_id,
            project_id: project.id,
            manager_id: req.session.user.id
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        next(error);
    }


}


export async function subTask(req, res, next) {

    try{

        const {id} = req.params;
        const { name, time, des, parent_id } = req.body;

        // validate request body
        const { error } = projectTaskValidation.validate(req.body);
        if (error) return next(createHttpError(422, error.message));
        

    } catch (error) {
        next(error);
    }

}

export async function update(req, res, next) {

    try{

        const {id} = req.params;
        const { name, time, des, parent_id } = req.body;

        // validate request body
        const { error } = projectTaskValidation.validate(req.body);
        if (error) return next(createHttpError(422, error.message));

        // check if task exists
        const task = await ProjectTask.findByPk(id);
        if (!task) return next(createHttpError(404, "Task not found"));
        if(task.user_id !== req.session.user.id) return next(createHttpError(403, "You are not allowed to update this task"));
        if(task.repeats > 3) return next(createHttpError(422, "Task can't be repeated more than 3 times"));

        // check if task is done
        if(task.status === 1 || task.status === 2) return next(createHttpError(422, `Task is ${task.status === 1 ? 'done' : 'rejected'}`));

        // check if parent task exists
        if(parent_id) {
            const parentTask = await ProjectTask.findByPk(parent_id);
            if (!parentTask) return next(createHttpError(404, "Parent task not found"));
            if(parentTask.parent_id !== 0) return next(createHttpError(422, "Parent task cannot be a child task"));
        } else {
            throw createHttpError(422, "Parent task is required. You can't update task without parent task which has created by manager");
        }
        
        let repeats_object = null;
        if(task.repeats > 0) {
            repeats_object = JSON.parse(task.repeats_object);
            // push task all data to repeats_object
            repeats_object.push(task);
        } else {
            // create new repeats_object
            repeats_object = [task];
        }

        // update task
        const updatedTask = await task.update({
            name,
            time,
            des,
            user_id: req.session.user.id,
            status: 0,
            repeats: task.repeats + 1,
            repeats_object : JSON.stringify(repeats_object),
            parent_id
        });

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });
        

    } catch (error) {
        next(error);
    }

}


export async function destroy(req, res, next) {

    try{

        const {id} = req.params;

        // check if task exists
        const task = await ProjectTask.findByPk(id);
        if (!task) return next(createHttpError(404, "Task not found"));

        // delete task
        await task.destroy();

        // delete all child tasks
        if(task.parent_id !== 0) {
            await ProjectTask.destroy({ where: { parent_id: task.id } });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        next(error);
    }

}


export async function done(req, res, next) {

    try{

        const {id} = req.params;

        // check if task exists
        const task = await ProjectTask.findByPk(id);
        if (!task) return next(createHttpError(404, "Task not found"));

        // update task status to done
        const updatedTask = await task.update({
            done_at: new Date(),
            status: 1,
            resolve: req.body.resolve || `Your task has been resolved by ${req.session.user.name} ✅ at ${new Date().toLocaleString()}`
        });

        res.status(200).json({
            message: "Task done successfully",
            task: updatedTask
        });

    } catch (error) {
        next(error);
    }

}


export async function reject(req, res, next) {

    try{

        const {id} = req.params;

        // check if task exists
        const task = await ProjectTask.findByPk(id);
        if (!task) return next(createHttpError(404, "Task not found"));

        // update task status to rejected
        const updatedTask = await task.update({
            status: 2,
            resolve: req.body.resolve || `Your task has been rejected by ${req.session.user.name} ❌ at ${new Date().toLocaleString()}`
        });

        res.status(200).json({
            message: "Task rejected successfully",
            task: updatedTask
        });

    } catch (error) {
        next(error);
    }

}


