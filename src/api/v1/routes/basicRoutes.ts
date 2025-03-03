import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * @openapi
 * /api:
 *   get:
 *     summary: Welcome route
 *     tags: [Basic]
 *     description: This is the welcome route of the API.
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Welcome to the API"
 */
router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

export default router;
