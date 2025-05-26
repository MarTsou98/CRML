const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kitchen CRM API',
      version: '1.0.0',
      description: 'API documentation for Kitchen CRM',
    },
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '608c9f6e6e1c4a2a4c2f2b7a' },
            customer_id: { type: 'string', example: '605c5b3f4b3e4e3a5c8f4a1e' },
            salesperson_id: { type: 'string', example: '605c5b3f4b3e4e3a5c8f4a1f' },
            contractor_id: { type: 'string', example: '605c5b3f4b3e4e3a5c8f4a20' },
            moneyDetails: {
              type: 'object',
              properties: {
                timi_Timokatalogou: { type: 'number', example: 100 },
                timi_Polisis: { type: 'number', example: 150 },
                profit: { type: 'number', example: 50 },
                payments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      amount: { type: 'number' },
                      method: { type: 'string', enum: ['Cash', 'Bank'] },
                      notes: { type: 'string' },
                      date: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                damages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      amount: { type: 'number' },
                      notes: { type: 'string' },
                      date: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                totalpaid: { type: 'number', example: 100 },
                totaldamages: { type: 'number', example: 5 },
              },
            },
            createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T12:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-01-02T12:00:00Z' },
          },
          required: ['customer_id', 'salesperson_id', 'contractor_id', 'moneyDetails'],
        },
      },
    },
    paths: {
      '/orders': {
        get: {
          summary: 'Get all orders',
          tags: ['Orders'],
          responses: {
            200: {
              description: 'List of all orders',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
        },
      },
      '/orders/salesperson/{salespersonId}': {
        get: {
          summary: 'Get all orders from a specific salesperson by their ID',
          tags: ['Orders'],
          parameters: [
            {
              in: 'path',
              name: 'salespersonId',
              required: true,
              schema: { type: 'string' },
              description: 'Salesperson ID',
            },
          ],
          responses: {
            200: {
              description: 'List of all orders for the salesperson',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
            400: { description: 'Invalid salesperson ID' },
            500: { description: 'Server error' },
          },
        },
      },
      // Add more routes here if you want, same structure
    },
  },
  apis: [], // if you want to use JSDoc comments, add your route files here
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
