import express from 'express';
import authRoutes from '../Modules/Auth/Routes.js';
import auth from '../Middlewares/Auth.js';
import tagRoutes from '../Modules/Tag/Routes.js';
import postRoutes from '../Modules/Post/Routes.js';

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
    app.use(tagRoutes);

    // Post routes with authentication middleware
    app.use('/posts', auth, postRoutes);


    // Test routes
    // app.use('/test', testRoutes);
    
    // Start the server
    const PORT = process.env.APP_PORT || 5500;

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });


}

export default Routes;