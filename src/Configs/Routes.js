import express from 'express';
import authRoutes from '../Modules/Auth/Routes.js';
import auth from '../Middlewares/Auth.js';

function Routes(app) {
    
    app.use(express.json());

    app.get('/', auth ,(req, res) => {
        return res.send("Hello NodeJS");
    });

    // Authentication routes
    app.use('/auth',auth, authRoutes);

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

}

export default Routes;