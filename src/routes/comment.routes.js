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
 *             properties:
 *               text:
 *                 type: string
 *                 description: The comment text
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the comment
 *               companyId:
 *                 type: string
 *                 description: The ID of the company being commented on
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', commentController.createComment);

/**
 * @swagger
 * /api/comments/company/{companyId}:
 *   get:
 *     summary: Get all comments for a specific company
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the company
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   text:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   companyId:
 *                     type: string
 *       404:
 *         description: Company not found
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
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   text:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   companyId:
 *                     type: string
 *       404:
 *         description: User not found
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
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', commentController.deleteComment);

module.exports = router;
