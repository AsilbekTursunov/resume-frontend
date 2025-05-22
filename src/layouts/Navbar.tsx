import { Link } from 'react-router-dom'
import ProfileCard from '../components/Cards/ProfileCard'
import logo from '../assets/logo.png'
const Navbar = () => {
	return (
		<div className=' bg-white border boredr-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30'>
			<div className='container mx-auto flex items-center justify-between gap-5'>
				<Link to='/dashboard' className='flex items-center gap-2 '>
					<img className='size-14' src={logo} alt='Logo' />
					<h2 className='text-lg md:text-xl font-medium text-black leading-5'>Resume Builder</h2>
				</Link>

				<ProfileCard />
			</div>
		</div>
	)
}

export default Navbar
