export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  status: string
}
