// Tipos para instâncias do Evolution API
export interface Instance {
  instance: {
    instanceName: string;
    owner: string;
    profileName: string;
    profilePictureUrl: string | null;
    profileStatus: string | null;
  };
  status: 'open' | 'close' | 'connecting';
  state: string;
  serverUrl: string;
}

// Tipos para mensagens
export interface TextMessage {
  phoneNumber: string;
  message: string;
}

// Tipos para QR Code
export interface QrCodeResponse {
  base64: string;
  pairingCode?: string;
} 