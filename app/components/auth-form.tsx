import {SubmissionResult, useForm} from '@conform-to/react'
import {parseWithZod} from '@conform-to/zod'
import {Form} from 'react-router'
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '~/schemas/auth'
import {Button} from '~/components/ui/button'
import {ConformInput} from './ui/conform'
import {FormLabel, FormError} from './ui/form'

interface AuthFormProps {
  mode: 'signup' | 'login'
  lastResult?: SubmissionResult
}

export function AuthForm({mode, lastResult}: AuthFormProps) {
  const [form, fields] = useForm<LoginFormData | SignupFormData>({
    id: mode,
    shouldValidate: 'onSubmit',
    lastResult,
    onValidate: ({formData}: {formData: FormData}) =>
      parseWithZod(formData, {
        schema: mode === 'signup' ? signupSchema : loginSchema,
      }),
  })

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Form
        method="post"
        className="space-y-6 bg-white p-8 border-4 border-black"
        style={{
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
        }}
        id={form.id}
        onSubmit={form.onSubmit}
      >
        <h1 className="text-3xl font-bold tracking-tight text-black uppercase">
          {mode === 'signup' ? 'Sign Up' : 'Log In'}
        </h1>

        <FormError>{form.errors}</FormError>

        <div className="space-y-4">
          <div>
            <FormLabel htmlFor={fields.email.id}>Email</FormLabel>
            <ConformInput meta={fields.email} className="mt-1 block w-full" />
          </div>

          <div>
            <FormLabel htmlFor={fields.password.id}>Password</FormLabel>
            <ConformInput
              meta={fields.password}
              type="password"
              className="mt-1 block w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white px-4 py-3 uppercase font-bold hover:bg-gray-800 transition-colors"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </Button>
        </div>

        <div className="text-center">
          <a
            href={mode === 'signup' ? '/login' : '/signup'}
            className="text-sm underline hover:text-gray-600"
          >
            {mode === 'signup'
              ? 'Already have an account? Log in'
              : 'Need an account? Sign up'}
          </a>
        </div>
      </Form>
    </div>
  )
}
