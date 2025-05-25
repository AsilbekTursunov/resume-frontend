import { useContext, useState, type Dispatch, type SetStateAction } from 'react'
import Input from '../../components/Inputs/Input'
import { emailValidation, passwordValidation } from '../../utils/helper'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { BiLoaderCircle } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

interface ILogin {
	setCurrentPage: Dispatch<SetStateAction<'login' | 'register'>>
	onClose: () => void
}
const Login = ({ setCurrentPage, onClose }: ILogin) => {
	const navigate = useNavigate()
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [loginError, setloginError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const { updateUser, setLoading, loading } = useContext(UserContext)

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault()
		setEmailError(emailValidation(email))
		setPasswordError(passwordValidation(password))
		if (!emailError && !passwordError) {
			setLoading(true)
			try {
				const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password })
				updateUser(response.data)
				navigate('/dashboard')
			} catch (error: any) {
				if (error.response && error.response.status == 404 && error.response.data?.message) {
					setloginError(error.response.data.message)
				}
				setTimeout(() => {
					setloginError('')
				}, 2000)
			} finally {
				setLoading(false)
			}
		}
	}
	return (
		<div className='w-[90vw] md:w-[40vw] flex flex-col justify-center'>
			<h3 className='text-lg font-semibold text-black'>Welcome Back</h3>
			<p className='text-xs text-slate-700 mt-1.5 mb-6'>Please enter your details</p>

			<form onSubmit={handleLogin}>
				<Input
					value={email}
					onChange={event => setEmail(event.target.value)}
					label={'Email Address'}
					placeholder={'johndoe@gmail.com'}
					type={'email'}
				/>
				{emailError && <p className='text-red-500 text-xs pb-2.5'>{emailError}</p>}
				<Input
					value={password}
					onChange={event => setPassword(event.target.value)}
					label={'Password'}
					placeholder={'Min 8 characters  '}
					type={'password'}
				/>
				{passwordError && <p className='text-red-500 text-xs pb-2.5'>{passwordError}</p>}
				{loginError && (
					<p className='text-red-500 text-xs py-2 my-2 w-full rounded-md flex items-center justify-center bg-red-200'>
						{loginError}
					</p>
				)}
				<button type='submit' className='btn-primary flex items-center justify-center'>
					{loading ? <BiLoaderCircle className='size-5 animate-spin' /> : 'LOGIN'}
				</button>
				<p className='text-sm text-slate-800 mt-3  flex items-center gap-2 '>
					Don't you have an account?
					<button
						onClick={() => setCurrentPage('register')}
						className='font-medium text-primary undeline hover:underline cursor-pointer'
					>
						Register
					</button>
				</p>
			</form>
		</div>
	)
}

export default Login
