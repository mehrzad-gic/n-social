import Salary from './SalaryModel.js';
import salaryValidation from './validation.js';
import createHttpError from 'http-errors';

async function index(req,res,next){

    try {
    
        const salaries = await Salary.findAll();

        res.status(200).json({
            success:true,
            message:'Salaries fetched successfully',
            data:salaries
        })

    } catch (error) {
        next(error);
    }

}


async function create(req,res,next){

    try {
        
        const {error} = salaryValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));

        const {salary : salaryAmount,status,type} = req.body;
        
        const salary = await Salary.create({salaryAmount,status,type});

        res.status(201).json({
            success:true,
            message:'Salary created successfully',
            data:salary
        })

    } catch (error) {
        next(error);
    }

}


async function update(req,res,next){

    try {
    
        const {id} = req.params;

        const {salary : salaryAmount,status,type} = req.body;

        const {error} = salaryValidation.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));
        
        const salary = await Salary.findByPk(id);
        if(!salary) return next(createHttpError.NotFound('Salary not found'));

        await salary.update({salaryAmount,status,type});
        
        res.status(200).json({
            success:true,
            message:'Salary updated successfully',
        })        
        
    } catch (error) {
        next(error);
    }

}


async function destroy(req,res,next){

    try {

        const {id} = req.params;

        const salary = await Salary.findByPk(id);
        if(!salary) return next(createHttpError.NotFound('Salary not found'));

        await salary.destroy();

        res.status(200).json({
            success:true,
            message:'Salary deleted successfully',
        })
        
    } catch (error) {
        next(error);
    }

}


async function show(req,res,next){

    try {
        
        const {id} = req.params;

        const salary = await Salary.findByPk(id);
        if(!salary) return next(createHttpError.NotFound('Salary not found'));

        res.status(200).json({
            success:true,
            message:'Salary fetched successfully',  
            salary:salary
        })

    } catch (error) {
        next(error);
    }

}


async function changeStatus(req,res,next){

    try {

        const {id} = req.params;

        const salary = await Salary.findByPk(id);
        if(!salary) return next(createHttpError.NotFound('Salary not found'));

        const updatedSalary = await salary.update({status : salary.status == 0 ? 1 : 0});

        res.status(200).json({
            success:true,
            message:'Salary status changed successfully',
            salary:updatedSalary
        })
        
    } catch (error) {
        next(error);
    }

}

export {index,create,update,destroy,show,changeStatus};


