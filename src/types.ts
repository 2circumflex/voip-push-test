// VoIP 푸시 관련 타입 정의

export interface CalleeInfo {
  deviceToken: string;
  name?: string;
  phoneNumber?: string;
  id?: string;
}

export interface SendVoipPushReqBody {
  calleeInfo: CalleeInfo;
  callerName: string;
}

export interface VoIPPayload {
  callerName: string;
  aps: {
    'content-available': number;
  };
  uuid: string;
}

// API 응답 타입들
export interface APNSuccessResponse {
  success: true;
  sentCount: number;
  failedCount: number;
  sentDevices: string[];
  message: string;
}

export interface APNErrorResponse {
  error: string;
  details?: any;
  failedDevices?: Array<{
    device: string;
    status?: string;
    error?: string;
  }>;
}

export interface APNInternalErrorResponse {
  error: string;
  message: string;
}
