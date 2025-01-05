/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

const express = require('express');
const commentController = require('../controllers/comment.controller');
const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *               - businessId
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *               userId:
 *                 type: string
 *                 description: ID of the user making the comment
 *               businessId:
 *                 type: string
 *                 description: ID of the business being commented on
 *               rankingId:
 *                 type: string
 *                 description: ID of the ranking associated with the comment (optional)
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request data
 */
router.post('/', commentController.createComment);

/**
 * @swagger
 * /api/comments/company/{businessId}:
 *   get:
 *     summary: Get all comments for a specific business
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: businessId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the business
 *     responses:
 *       200:
 *         description: A list of comments for the specified business
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Business not found or no comments available
 *       500:
 *         description: Internal server error
 */
router.get('/company/:businessId', commentController.getCommentsByBusiness);

/**
 * @swagger
 * /api/comments/user/{userId}:
 *   get:
 *     summary: Get all comments by a specific user
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: A list of comments by the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: User not found or no comments available
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', commentController.getCommentsByUser);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', commentController.deleteComment);

router.post('/like/:id', commentController.addLike);
router.post('/dislike/:id', commentController.addDislike);
router.post('/:id/removeLike',commentController.removeLike);
router.post('/:id/removeDislike', commentController.removeDislike);


/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         content:
 *           type: string
 *         userId:
 *           type: string
 *         businessId:
 *           type: string
 *         rankingId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             stars:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
