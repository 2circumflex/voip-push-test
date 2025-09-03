import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import * as apn from '@parse/node-apn';
import { v4 as uuidv4 } from 'uuid';
import {
  SendVoipPushReqBody,
  VoIPPayload,
} from './types';
import { config } from './config';
import { swaggerSpec } from './swagger';

const app: Application = express();
const port: number = config.port;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VoIP Push Test API',
}));

// Request 타입을 확장하여 body에 타입 추가
interface SendVoipPushReq extends Request {
  body: SendVoipPushReqBody;
}

// VoIP Push 알림 전송 API
app.post('/send-voip-push', (req: SendVoipPushReq, res: Response): void => {
  try {
    const { calleeInfo, callerName }: SendVoipPushReqBody = req.body;

    if (!calleeInfo?.deviceToken) {
      res.status(400).json({ error: 'Device token is required' });
      return;
    }

    if (!callerName) {
      res.status(400).json({ error: 'Caller name is required' });
      return;
    }

    const deviceToken = calleeInfo.deviceToken;

    const options: apn.ProviderOptions = {
      token: {
        key: config.apn.keyPath,
        keyId: config.apn.keyId,
        teamId: config.apn.teamId,
      },
      production: config.apn.production,
    };

    const apnProvider = new apn.Provider(options);
    const note = new apn.Notification();

    // 알림 설정
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // 1시간 후 만료
    note.badge = 1;
    note.sound = 'ping.aiff';
    note.alert = 'NOVA VoIP Push Test';
    
    // VoIP 페이로드 구성
    const payload: VoIPPayload = {
      callerName,
      aps: {
        'content-available': 1,
      },
      uuid: uuidv4(),
    };

    note.rawPayload = payload;
    note.pushType = 'voip';
    note.topic = config.apn.topic; // VoIP의 경우 .voip suffix가 필요할 수 있음

    console.log('config', config);
    console.log('deviceToken', deviceToken);
    console.log('payload', payload);
    console.log('apnProvider', apnProvider);
    console.log('note', note);

    // 푸시 전송
    apnProvider
      .send(note, deviceToken)
      .then((result: apn.Responses<apn.LoggerResponse, apn.LoggerResponseFailure>) => {
        if (result.failed && result.failed.length > 0) {
          console.error('APN Send Failed:', result.failed[0].response);
          res.status(400).json({
            error: 'Failed to send push notification',
            details: result.failed[0].response,
            failedDevices: result.failed.map(f => ({
              device: f.device,
              status: f.status,
              error: f.error?.message
            }))
          });
        } else {
          console.log('APN Send Success:', result);
          res.status(200).json({
            success: true,
            sentCount: result.sent.length,
            failedCount: result.failed.length,
            sentDevices: result.sent.map(s => s.device),
            message: 'VoIP push notification sent successfully'
          });
        }
      })
      .catch((error: Error) => {
        console.error('APN Provider Error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: error.message
        });
      })
      .finally(() => {
        // Provider 정리 (선택사항 - 연결 풀링을 위해 제거할 수 있음)
        apnProvider.shutdown();
      });

  } catch (error) {
    console.error('Request processing error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 서버 시작
app.listen(port, (): void => {
  console.log(`🚀 Server running at http://localhost:${port}/`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api-docs`);
});

export default app;
