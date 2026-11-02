import { data, redirect } from 'react-router'

import type { Route } from './+types/login'

import { createUserSession, getUser } from '@/routes/helpers/auth'
import LoginScreen from '@/screens/LoginScreen'
import { verifyLogin } from '@/server/services/auth'

export async function loader({ request }: Route.LoaderArgs) {
  if (await getUser(request)) throw redirect('/')
  return null
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const email = String(form.get('email') ?? '')
  const password = String(form.get('password') ?? '')

  const user = await verifyLogin(email, password)
  if (!user) {
    return data({ error: 'Неверный email или пароль' }, { status: 400 })
  }
  return createUserSession(user.id, '/')
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  return <LoginScreen error={actionData?.error} />
}
