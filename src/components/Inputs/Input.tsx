import { useState, type HTMLInputTypeAttribute } from 'react'

interface IInput {
	value: string
	onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
	label?: string
	placeholder?: string
	type?: HTMLInputTypeAttribute
}

const Input = ({ value, onChange, label, placeholder, type }: IInput) => {
	const [showPassword, setShowPassword] = useState(false)
	return (
		<div className=' flex flex-col'>
			{label && <p className='text-base font-normal mb-2'>{label}</p>}
			<div className='input-box relative'>
				<input
					type={type == 'password' ? (showPassword ? 'text' : 'password') : type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className=' outline-none p-2 w-full'
				/>
				{type == 'password' && (
					<p
						onClick={() => setShowPassword(prev => !prev)}
						className=' cursor-pointer p-2 absolute top-1/2 -translate-y-1/2 right-3'
					>
						{showPassword ? 'Hide' : 'Show'}
					</p>
				)}
			</div>
		</div>
	)
}

export default Input
