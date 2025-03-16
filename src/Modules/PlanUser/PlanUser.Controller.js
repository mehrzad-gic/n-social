import PlanUser from './PlanUserModel.js';
import createHttpError from 'http-errors';
import Plan from '../Plan/PlanModel.js';
import User from '../User/UserModel.js';
import sequelize  from '../../Configs/Sequelize.js'; // Assuming you're using Sequelize

async function attach(req, res, next) {

    const t = await sequelize.transaction(); // Start a transaction

    try {

        const { id } = req.params;
        const { type } = req.body;

        // Validate type
        const allowedTypes = ['year', 'mount'];
        if (!allowedTypes.includes(type)) throw new createHttpError.BadRequest('Type should be "year" or "mount"');


        // Check if plan exists
        const plan = await Plan.findByPk(id, { transaction: t });
        if (!plan) throw new createHttpError.NotFound('Plan not found');

        // Validate user
        if (!req.session?.user?.id) throw new createHttpError.Unauthorized('User not logged in');
        const user = await User.findByPk(req.session.user.id, { transaction: t });
        if (!user) throw new createHttpError.NotFound('User does not exist');

        // Find existing plan for the user
        const plan_user = await PlanUser.findOne({
            where: {
                user_id: user.id,
                plan_id: plan.id,
            },
            transaction: t,
        });

        // Calculate end date
        const addMilliseconds = (date, milliseconds) => new Date(date.getTime() + milliseconds);
        let end = plan_user ? new Date(plan_user.end) : new Date();

        if (type === 'year') {
            const millisecondsIn1Year = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
            end = addMilliseconds(end, millisecondsIn1Year);
        } else {
            const millisecondsIn30Days = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
            end = addMilliseconds(end, millisecondsIn30Days);
        }

        // Update or create plan_user
        let action = null;
        if (plan_user && plan_user.plan_id == plan.id) {
            action = 'refreshed';
            await PlanUser.update(
                {
                    end,
                    refresh_at: Date.now(),
                    status: 1,
                    plan_type: type,
                    request: plan_user.request + plan.request,
                },
                {
                    where: { id: plan_user.id },
                    transaction: t,
                }
            );
        } else {
            action = 'attached';
            await PlanUser.create(
                {
                    end,
                    start: Date.now(),
                    request: plan.request,
                    plan_type: type,
                    status: 1,
                    user_id: user.id,
                    plan_id: plan.id,
                },
                { transaction: t }
            );
        }

        await t.commit(); // Commit the transaction

        return res.json({
            success: true,
            message: `A plan has been ${action} for the user successfully`,
        });

    } catch (e) {
        await t.rollback(); // Rollback the transaction in case of error
        console.error('Error in attach function:', e);
        next(e);
    }

}




export default attach;