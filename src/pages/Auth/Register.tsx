import { useContext, useState, type Dispatch, type SetStateAction } from 'react'
import Input from '../../components/Inputs/Input'
import { emailValidation, passwordValidation, userNameValidation } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { uploadImage } from '../../utils/uploadImage'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
import { BiLoaderCircle } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

interface ILogin {
	setCurrentPage: Dispatch<SetStateAction<'login' | 'register'>>
	onClose: () => void
}
const Register = ({ setCurrentPage, onClose }: ILogin) => {
	const [email, setEmail] = useState<string>('')
	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState<string>('')
	const [userNameError, setUserNameError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const navigate = useNavigate()
	// userContext
	const { updateUser, setLoading, loading } = useContext(UserContext)

	// image file states
	const [image, setImage] = useState<File | null>()
	const [preview, setPreview] = useState<string | null>()

	const handleRegister = async (event: React.FormEvent) => {
		event.preventDefault()
		let profileImageUrl = ''
		setUserNameError(userNameValidation(userName))
		setEmailError(emailValidation(email))
		setPasswordError(passwordValidation(password))
		if (!emailError && !passwordError) {
			setLoading(true)
			if (image) {
				const imageUrl = await uploadImage(image)
				profileImageUrl = imageUrl ? imageUrl : ''
			}

			try {
				const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
					email,
					password,
					image: profileImageUrl,
					name: userName,
				})
				updateUser(response.data)
				onClose()
				navigate('/dashboard')
			} catch (error) {
				console.error('Register error', error)
			} finally {
				setLoading(false)
			}
		}
	}
	return (
		<div className='w-[90vw] md:w-[40vw] flex flex-col justify-center'>
			<h3 className='text-lg font-semibold text-black'>Create an Account</h3>
			<p className='text-xs text-slate-700 mt-1.5 mb-6'>
				Join us today by entering your details below
			</p>
			{/* ProfileImageSelector */}
			<ProfilePhotoSelector
				image={image}
				setImage={value => setImage(value as File)}
				preview={preview}
				setPreview={value => setPreview(value)}
			/>
			<form action='POST' onSubmit={handleRegister}>
				<Input
					value={userName}
					onChange={event => setUserName(event.target.value)}
					label={'Full Name'}
					placeholder={'Jone Doe'}
					type={'text'}
				/>
				{userNameError && <p className='text-red-500 text-xs pb-2.5'>{userNameError}</p>}
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

				<button type='submit' className='btn-primary'>
					{loading ? <BiLoaderCircle className='size-5 animate-spin' /> : 'REGISTER'}
				</button>
				<p className='text-sm text-slate-800 mt-3  flex items-center gap-2 '>
					I have already an account.
					<button
						onClick={() => setCurrentPage('login')}
						className='font-medium text-primary undeline hover:underline cursor-pointer'
					>
						Login
					</button>
				</p>
			</form>
		</div>
	)
}

export default Register
