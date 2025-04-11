import swaggerJSDoc from 'swagger-jsdoc';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';

const {serve, setup} = swaggerUi;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Photo Prestiges API',
            version: '1.0.0',
            description: 'API Gateway voor alle microservices',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export {swaggerSpec, serve, setup};
