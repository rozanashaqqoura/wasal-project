// src/modules/auth/enums/auth-messages.enum.ts
export enum AuthMessages {
  INVALID_CREDENTIALS = 'Invalid email or password',
  UNAUTHORIZED = 'Unauthorized access',
  ACCESS_TOKEN_EXPIRED = 'Session has expired',
  INVALID_TOKEN = 'Invalid token',
  ACCOUNT_DISABLED = 'Account is disabled',
  FORBIDDEN = 'You do not have permission to access this resource',
}
