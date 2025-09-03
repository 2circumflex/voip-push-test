import swaggerJSDoc from 'swagger-jsdoc';
import { voipPushApiDoc } from './docs/api-docs';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'VoIP Push Test API',
    version: '1.0.0',
    description: 'Apple VoIP Push 알림을 테스트하기 위한 API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '개발 서버',
    },
  ],
  paths: voipPushApiDoc,
  components: {
    schemas: {
      CalleeInfo: {
        type: 'object',
        required: ['deviceToken'],
        properties: {
          deviceToken: {
            type: 'string',
            description: 'iOS 기기의 디바이스 토큰',
            example: 'a1b2c3d4e5f6789abcdef123456789abcdef123456789abcdef123456789abcd',
          },
        },
      },
      SendVoipPushRequest: {
        type: 'object',
        required: ['calleeInfo', 'callerName'],
        properties: {
          calleeInfo: { $ref: '#/components/schemas/CalleeInfo' },
          callerName: { type: 'string', example: '홍길동' },
          callerHandle: { type: 'string', example: '+82-10-1234-5678' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          sentCount: { type: 'number', example: 1 },
          failedCount: { type: 'number', example: 0 },
          sentDevices: { type: 'array', items: { type: 'string' } },
          message: { type: 'string', example: 'VoIP push notification sent successfully' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'object' },
          failedDevices: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [], // API 정의를 별도 파일에서 가져오므로 빈 배열
});
