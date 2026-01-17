'use client'

// React Imports
import { useState } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty } from 'valibot'
import type { InferInput } from 'valibot'
import classnames from 'classnames'
import { OTPInput } from 'input-otp'
import type { SlotProps } from 'input-otp'

// Type Imports
import type { Mode } from '@core/types'
import type { Locale } from '@/configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import styles from '@/libs/styles/inputOtp.module.css'

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

const Slot = (props: SlotProps) => {
  return (
    <div className={classnames(styles.slot, { [styles.slotActive]: props.isActive })}>
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

const FakeCaret = () => {
  return (
    <div className={styles.fakeCaret}>
      <div className='w-px h-5 bg-textPrimary' />
    </div>
  )
}

const Login = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [otp, setOtp] = useState<string | null>(null)

  // Hooks
  const router = useRouter()
  const { lang: locale } = useParams()
  const { settings } = useSettings()

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-1-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-1-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onLoginSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      // Try to parse JSON, if fails, it might be HTML (404/500)
      let resData;
      try {
        resData = await response.json()
      } catch (e) {
        console.error('Failed to parse response JSON:', e)
        const text = await response.text().catch(() => '')
        alert('Server Error: The server returned an invalid response (likely HTML/404). Please restart the Next.js server.')
        return
      }

      if (response.ok) {
        // Check if token is present (Bypass login)
        if (resData.token) {
          localStorage.setItem('token', resData.token)
          // Store user data if needed, or just redirect
          if (resData.role) {
            localStorage.setItem('userRole', resData.role)
          }
          router.push('/')
        } else {
          // Normal OTP flow
          setStep('otp')
        }
      } else {
        alert(resData.msg || 'Login failed')
        setErrorState({ message: [resData.msg || 'Login failed'] })
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Network Error: Could not connect to login API.')
      setErrorState({ message: ['Something went wrong. Please try again.'] })
    }
  }

  const onOtpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (otp && otp.length === 6) {
      try {
        const email = getValues('email')
        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, otp })
        })

        const resData = await response.json()

        if (response.ok) {
          localStorage.setItem('token', resData.token)
          if (resData.role) {
            localStorage.setItem('userRole', resData.role)
          }
          if (resData.permissions) {
            localStorage.setItem('userPermissions', JSON.stringify(resData.permissions))
          }
          router.push('/')
        } else {
          // Handle OTP error (maybe show an alert or set error state)
          alert(resData.msg || 'Invalid OTP')
        }
      } catch (error) {
        console.error('OTP Verification error:', error)
        alert('Verification failed')
      }
    }
  }

  const handleResendOtp = async (e: any) => {
    e.preventDefault()
    try {
      const email = getValues('email')
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        alert('OTP Resent successfully')
      } else {
        alert('Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='pli-6 max-lg:mbs-40 lg:mbe-24'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[673px] max-is-full bs-auto'
          />
        </div>
        <img src={authBackground} className='absolute bottom-[4%] z-[-1] is-full max-md:hidden' />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>

          {step === 'login' ? (
            <>
              <div>
                <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
                <Typography>Please sign-in to your account and start the adventure</Typography>
              </div>
              <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
                <Typography variant='body2' color='primary.main'>
                  Email: <span className='font-medium'>admin@starkcrane.com</span> / Pass:{' '}
                  <span className='font-medium'>admin123</span>
                </Typography>
              </Alert>

              <form noValidate autoComplete='off' onSubmit={handleSubmit(onLoginSubmit)} className='flex flex-col gap-5'>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      autoFocus
                      type='email'
                      label='Email'
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.email || errorState !== null) && {
                        error: true,
                        helperText: errors?.email?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Password'
                      id='login-password'
                      type={isPasswordShown ? 'text' : 'password'}
                      onChange={e => {
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowPassword}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                      {...(errors.password && { error: true, helperText: errors.password.message })}
                    />
                  )}
                />

                <Button fullWidth variant='contained' type='submit'>
                  Log In
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className='flex flex-col gap-1'>
                <Typography variant='h4'>Two Step Verification 💬</Typography>
                <Typography>
                  We sent a verification code to your mobile. Enter the code from the mobile in the field below.
                </Typography>
              </div>
              <form noValidate autoComplete='off' onSubmit={onOtpSubmit} className='flex flex-col gap-5'>
                <div className='flex flex-col gap-2'>
                  <Typography>Type your 6 digit security code</Typography>
                  <OTPInput
                    onChange={setOtp}
                    value={otp ?? ''}
                    maxLength={6}
                    containerClassName='group flex items-center'
                    render={({ slots }) => (
                      <div className='flex items-center justify-between w-full gap-4'>
                        {slots.slice(0, 6).map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </div>
                    )}
                  />
                </div>
                <Button fullWidth variant='contained' type='submit'>
                  Verify My Account
                </Button>
                <div className='flex justify-center items-center flex-wrap gap-2'>
                  <Typography>Didn&#39;t get the code?</Typography>
                  <Typography color='primary.main' component={Link} href='/' onClick={handleResendOtp}>
                    Resend
                  </Typography>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )


}

export default Login
