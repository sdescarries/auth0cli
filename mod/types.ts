export interface Session {
  accessToken: string;
  expiresAt: Date;
  refreshToken: string;
  tokenType: string;
}

export interface LoadSession {
  (): Promise<Session>;
}

export interface SaveSession {
  (session: Session): Promise<Session>;
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

export interface Logger {
  // deno-lint-ignore no-explicit-any
  debug(...data: any[]): void;
  // deno-lint-ignore no-explicit-any
  error(...data: any[]): void;
  // deno-lint-ignore no-explicit-any
  info(...data: any[]): void;
  // deno-lint-ignore no-explicit-any
  log(...data: any[]): void;
  // deno-lint-ignore no-explicit-any
  warn(...data: any[]): void;
}

export interface ClientConfig {

  // A Fetch API compliant implementation
  apiFetch?: ApiFetch;

  // Base64 decoding implementation
  base64Decode: (str: string) => string;

  // Date.now() implementation
  getCurrentTime?: () => number;

  // Optional logger context equivalent to console
  logger?: Logger;

  // Auth session persistance
  loadSession?: LoadSession;
  saveSession?: SaveSession;
}
