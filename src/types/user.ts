export interface User {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  createdAt: string
}

export interface Session {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: User
}
