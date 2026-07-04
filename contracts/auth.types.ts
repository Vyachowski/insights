export interface LoginDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  isAdmin: boolean
  isActive: boolean
}
