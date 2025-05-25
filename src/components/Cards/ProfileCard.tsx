import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'

const ProfileCard = () => {
	const { userData, clearUser } = useContext(UserContext)
	const navigate = useNavigate()
	const handleLogout = () => {
		clearUser()
		navigate('/')
	}
	return (
		<div className='text-sm '>
			<div className='flex items-center space-x-4'>
				<img
					src={
						userData?.image
							? userData?.image
							: 'https://i.pinimg.com/736x/38/b4/5a/38b45af8f71d3414b987203c2a9b1415.jpg'
					}
					decoding='async'
					className='size-10 rounded-full object-cover'
				/>
				<div className=''>
					<div className='text-base text-slate-700 font-semibold '>{userData?.name}</div>
					<button
						type='button'
						onClick={handleLogout}
						className=' text-purple-700 font-semibold hover:text-purple-400 cursor-pointer border-purple-400  '
					>
						Log out
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProfileCard
