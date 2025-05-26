/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         customer_id:
 *           type: string
 *           example: "60d21b4667d0d8992e610c99"
 *         salesperson_id:
 *           type: string
 *           example: "60d21b4667d0d8992e610caa"
 *         contractor_id:
 *           type: string
 *           example: "60d21b4667d0d8992e610cbb"
 *         moneyDetails:
 *           type: object
 *           properties:
 *             timi_Timokatalogou:
 *               type: number
 *             timi_Polisis:
 *               type: number
 *             profit:
 *               type: number
 *             payments:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   method:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *             damages:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   notes:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
