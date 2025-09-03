/**
 * VoIP Push API 문서 정의
 */

export const voipPushApiDoc = {
  '/send-voip-push': {
    post: {
      summary: 'VoIP Push 알림 전송',
      description: 'iOS 디바이스로 VoIP Push 알림을 전송합니다.',
      tags: ['VoIP Push'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SendVoipPushRequest'
            },
            example: {
              calleeInfo: {
                deviceToken: "a1b2c3d4e5f6789abcdef123456789abcdef123456789abcdef123456789abcd"
              },
              callerName: "홍길동",
              callerHandle: "+82-10-1234-5678"
            }
          }
        }
      },
      responses: {
        200: {
          description: '성공적으로 VoIP Push 알림이 전송되었습니다.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        },
        400: {
          description: '잘못된 요청',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        500: {
          description: '서버 내부 오류',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  }
};
