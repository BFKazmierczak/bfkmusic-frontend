'use client'

import BasicInput from '@/src/components/Inputs/BasicInput/BasicInput'
import { gql, useMutation } from '@apollo/client'
import { getSession, signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(
      input: { username: $username, email: $email, password: $password }
    ) {
      jwt
      user {
        id
        username
        email
        confirmed
      }
    }
  }
`

interface IFormInput {
  username: string
  email: string
  password: string
  retypePassword: string
}

type AuthFormProps =
  | {
      register: true
      login?: never
    }
  | { login: true; register?: never }

const AuthForm = ({ register, login }: AuthFormProps) => {
  const router = useRouter()
  const session = useSession()

  console.log(session)

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      retypePassword: ''
    }
    // mode: 'onChange'
    // reValidateMode: 'onChange'
  })

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      console.log(data)
    },
    onError: (error) => console.log(error)
  })

  const onSubmit: SubmitHandler<IFormInput> = async (data, event) => {
    console.log('submit called')
    event?.preventDefault()

    if (register) {
      registerUser({
        variables: {
          username: data.username,
          email: data.email,
          password: data.password
        }
      })
    } else if (login) {
      try {
        const result = await signIn('strapi', {
          username: data.username,
          password: data.password,
          callbackUrl: 'http://localhost:3000/',
          redirect: false
        })

        if (!result?.ok && result?.error) {
          console.log('Błąd podczas logowania')
        }

        if (result?.ok && result.url) {
          router.push('/')
          router.refresh()
        }
      } catch (error) {
        console.log('catched an error')
      }
    }
  }

  return (
    <>
      <p className=" mb-5 text-center font-bold text-xl">
        {register && 'Rejestracja'} {login && 'Logowanie'}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex flex-col gap-y-2">
          <Controller
            name="username"
            control={control}
            rules={{ required: 'Uzupełnij nazwę użytkownika' }}
            render={({ field }) => (
              <>
                {formState.errors.username && (
                  <p className=" text-pink-600">
                    {formState.errors.username.message}
                  </p>
                )}
                <BasicInput
                  {...field}
                  placeholder={
                    (register && 'Nazwa użytkownika') ||
                    (login && 'Nazwa użytkownika lub e-mail')
                  }
                  error={formState.errors.username !== undefined}
                />
              </>
            )}
          />

          {register && (
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Uzupełnij adres e-mail' }}
              render={({ field }) => (
                <>
                  {formState.errors.email && (
                    <p className=" text-pink-600">
                      {formState.errors.email.message}
                    </p>
                  )}
                  <BasicInput
                    {...field}
                    placeholder="E-mail"
                    error={formState.errors.email !== undefined}
                  />
                </>
              )}
            />
          )}

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Uzupełnij hasło',
              minLength: register && {
                value: 12,
                message: 'Hasło musi mieć co najmniej 12 znaków.'
              }
            }}
            render={({ field }) => (
              <div className=" ">
                {formState.errors.password && (
                  <p className=" text-pink-600">
                    {formState.errors.password.message}
                  </p>
                )}
                <BasicInput
                  {...field}
                  placeholder="Hasło"
                  error={formState.errors.password !== undefined}
                  type="password"
                />
              </div>
            )}
          />

          {register && (
            <Controller
              name="retypePassword"
              control={control}
              rules={{
                required: 'Powtórz hasło',
                validate: (value, formValues) => {
                  return (
                    value === formValues.password || 'Hasła nie pokrywają się.'
                  )
                }
              }}
              render={({ field }) => (
                <>
                  {formState.errors.retypePassword && (
                    <p className=" text-pink-600">
                      {formState.errors.retypePassword.message}
                    </p>
                  )}
                  <BasicInput
                    {...field}
                    placeholder="Powtórz hasło"
                    error={formState.errors.retypePassword !== undefined}
                    type="password"
                  />
                </>
              )}
            />
          )}

          <button className=" mt-5 basic-button w-full" type="submit">
            {register && 'Załóż konto'}
            {login && 'Zaloguj'}
          </button>
        </div>
      </form>

      {login && (
        <p className=" mt-2 text-center">
          Nie posiadasz jeszcze konta?{' '}
          <Link
            className=" text-pink-600 active:text-pink-700e"
            href="/register">
            Zarejestruj się
          </Link>
        </p>
      )}

      {register && (
        <p className=" mt-2 text-center">
          Masz już konto?{' '}
          <Link className=" text-pink-600 active:text-pink-700e" href="/login">
            Zaloguj się
          </Link>
        </p>
      )}
    </>
  )
}

export default AuthForm
