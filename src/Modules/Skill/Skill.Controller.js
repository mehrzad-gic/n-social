import { skillValidation } from './validation.js';
import { Skill } from './SkillModel.js';
import createError from 'http-errors';
import { makeSlug } from '../../Helpers/Helper.js';

const createSkill = async (req, res, next) => {


    try {
        
        const { name, status } = req.body;
        const { error } = skillValidation.validate(req.body);
        if (error) throw new createError.UnprocessableEntity(error);

        const slug = makeSlug(name,'skills');
        const skill = await Skill.create({ name, status, slug });
        
        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: skill
        });

    } catch (error) {
        next(error);
    }

};



const update = async (req, res, next) => {

    try {
        
        const { id } = req.params;
        const { name, status } = req.body;
        const { error } = skillValidation.validate(req.body);
        if (error) throw new createError.UnprocessableEntity(error);

        const skill = await Skill.findByPk(id);
        if (!skill) throw new createError.NotFound('Skill not found');

        const updatedSkill = await skill.update({ name, status });

        res.status(200).json({
            success: true,
            message: 'Skill updated successfully',
            skill: updatedSkill
        });
        
    } catch (error) {
        next(error);
    }

}



const destroy = async (req, res, next) => {

    try {
        
        const { id } = req.params;
        const skill = await Skill.findByPk(id);
        if (!skill) throw new createError.NotFound('Skill not found');

        await skill.destroy();

        res.status(200).json({
            success: true,
            message: 'Skill deleted successfully',
            skill: skill
        });

    } catch (error) {
        next(error);
    }

}


const show = async (req, res, next) => {

    try {
    
        const { id } = req.params;
        const skill = await Skill.findByPk(id);
        if (!skill) throw new createError.NotFound('Skill not found');

        res.status(200).json({
            success: true,
            message: 'Skill fetched successfully',
            skill: skill
        });

    } catch (error) {
        next(error);
    }

}



const changeStatus = async (req, res, next) => {

    try {

        const { id } = req.params;
        const skill = await Skill.findByPk(id);
        if (!skill) throw new createError.NotFound('Skill not found');

        const status = skill.status === 1 ? 0 : 1;

        const updatedSkill = await skill.update({ status });

        res.status(200).json({
            success: true,
            message: 'Skill status updated successfully',
            skill: updatedSkill
        });
        
    } catch (error) {
        next(error);
    }

}


export { createSkill, update, destroy, show, changeStatus };
