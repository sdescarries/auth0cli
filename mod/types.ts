export interface Session {
  accessToken: string;
  expiresAt: Date;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
}

export interface LoadSession {
  (sessionFilePath?: string): Promise<Session>;
}

export interface SaveSession {
  (
    session: Session,
    sessionFilePath?: string,
  ): Promise<Session>;
}

export interface BasicParams {
  clientId?: string;
  clientSecret?: string;
  domain?: string;
}

export interface MachineParams extends BasicParams {
  audience?: string;
}

export interface LoginParams extends BasicParams {
  audience?: string;
  password?: string;
  realm?: string;
  username?: string;
}

export interface RefreshParams extends BasicParams {
  refreshToken?: string;
}

export interface ApiFetch {
  (
    input: Request | URL | string,
    init?: RequestInit,
  ): Promise<Response>;
}

export interface ClientConfig {
  apiFetch?: ApiFetch;
  getCurrentTime?: () => number;
  oldSession?: Session;
  saveSession?: SaveSession;
}
