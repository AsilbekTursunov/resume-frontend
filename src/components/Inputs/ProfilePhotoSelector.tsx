import { useRef, type ChangeEvent } from 'react'
import { LuUser, LuTrash, LuUpload } from 'react-icons/lu'

interface IProps {
	image: File | null | undefined | string
	setImage: (value: File | null | string) => void
	preview?: string | null
	setPreview: (value: string | null) => void
}
const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }: IProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (file) {
			setImage(file)
			setPreview(URL.createObjectURL(file) as string)
		}
	}
	const handleRemoveImage = () => {
		setImage(null)

		if (setPreview) {
			setPreview(null)
		}
	}

	const onChooseFile = () => {
		if (inputRef.current) {
			inputRef.current.click()
		}
	}
	return (
		<div className='flex justify-center mb-6'>
			<input
				type='file'
				accept='image/*'
				ref={inputRef}
				onChange={handleImageChange}
				className='hidden'
			/>

			{!image ? (
				<div className='w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer'>
					<LuUser className='text-4xl text-purple-500' />

					<button
						type='button'
						className='w-8 h-8 flex items-center justify-center bg-linear-to-r from-purple-500/85 to-purple-700 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
						onClick={onChooseFile}
					>
						<LuUpload />
					</button>
				</div>
			) : (
				<div className='relative'>
					<img src={preview!} alt='profile photo' className='w-20 h-20 rounded-full object-cover' />
					<button
						type='button'
						className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
						onClick={handleRemoveImage}
					>
						<LuTrash />
					</button>
				</div>
			)}
		</div>
	)
}

export default ProfilePhotoSelector
