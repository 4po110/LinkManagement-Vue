export default {
  // Endpoints
  loginEndpoint: '/authentication/token/obtain/',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/authentication/token/refresh/',
  logoutEndpoint: '/jwt/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'JWT',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
}
