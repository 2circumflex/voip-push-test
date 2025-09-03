import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

export interface Config {
  port: number;
  apn: {
    keyId: string;
    teamId: string;
    keyPath: string;
    topic: string;
    production: boolean;
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  apn: {
    keyId: process.env.APN_KEY_ID || 'YOUR_KEY_ID',
    teamId: process.env.APN_TEAM_ID || 'YOUR_TEAM_ID',
    keyPath: process.env.APN_KEY_PATH || './AuthKey_YOUR_KEY_ID.p8',
    topic: process.env.APN_TOPIC || 'com.example.app.voip',
    production: process.env.APN_PRODUCTION === 'true' || false,
  },
};
