import { Router } from "express";
import { index , show, create, update, destroy, changeStatus } from './Faq.Controller.js';
const router = Router();

// Define the routes for FAQ management
router.get('/', index); // Get all FAQs
router.get('/show/:slug', show); // Get a single FAQ by slug
router.post('/create', create); // Create a new FAQ
router.put('/update/:slug', update); // Update an existing FAQ by slug
router.delete('/delete/:slug', destroy); // Delete an FAQ by slug
router.put('/change-status/:slug', changeStatus); // Change the status of an FAQ by slug


export default router;