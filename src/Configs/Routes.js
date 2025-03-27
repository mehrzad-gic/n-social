import express from 'express';
import authRoutes from '../Modules/Auth/Routes.js';
import auth from '../Middlewares/Auth.js';
import tagRoutes from '../Modules/Tag/Routes.js';
import postRoutes from '../Modules/Post/Routes.js';
import commentRoutes from '../Modules/Comment/Routes.js';
import categoryRoutes from '../Modules/Category/Routes.js';
import reportRoutes from '../Modules/Report/Routes.js';
import rejectRoutes from '../Modules/Reject/Routes.js';

function Routes(app) {

    // Middleware to parse JSON bodies
    app.use(express.json());

    // Root route with authentication middleware
    app.get('/', auth, (req, res) => {
        return res.send("Hello NodeJS");
    });



    // Authentication routes
    app.use('/auth', authRoutes);

    // Tag routes 
    app.use('/tags',auth,tagRoutes);

    // Post routes with authentication middleware
    app.use('/posts', auth, postRoutes); 

    // comments
    app.use('/comments/', auth, commentRoutes); 

    // Category routes
    app.use('/categories', auth, categoryRoutes);

    app.use('/reports', auth, reportRoutes);

    app.use('/rejects', auth, rejectRoutes);


    // Test routes
    // app.use('/test', testRoutes);
    
    // Start the server
    const PORT = process.env.APP_PORT || 5500;

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });


}

export default Routes;