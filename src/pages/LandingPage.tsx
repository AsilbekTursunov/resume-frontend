import { Link, useNavigate } from 'react-router-dom'
import HERO_IMG from '../assets/hero-img.png'
import { useContext, useState } from 'react'
import Modal from '../components/Modal'
import Login from './Auth/Login'
import Register from './Auth/Register'
import { UserContext } from '../context/userContext'
import ProfileCard from '../components/Cards/ProfileCard'
import logo from '../assets/logo.png'
const LandingPage = () => {
	const [openAuthModal, setOpenAuthModal] = useState(false)
	const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login')
	const { userData } = useContext(UserContext)
	const router = useNavigate()
	const handleCTA = () => {
		if (userData) {
			router('/dashboard')
		} else {
			setOpenAuthModal(true)
		}
	}

	return (
		<div className='min-h-full bg-white'>
			<div className='container mx-auto px-4 py-6'>
				{/* Header section */}
				<header className='flex justify-between items-center mb-16'>
					<Link to='/dashboard' className='flex items-center gap-2 '>
						<img className='size-14' src={logo} alt='Logo' />
						<h2 className='text-xl md:text-xl font-medium text-black leading-5'>Resume Builder</h2>
					</Link>
					{userData ? (
						<ProfileCard />
					) : (
						<button
							className='bg-purple-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer'
							onClick={() => setOpenAuthModal(true)}
						>
							Login / Sign Up
						</button>
					)}
				</header>
				{/* Hero section */}
				<div className='flex flex-col md:flex-row items-center'>
					<div className='w-full md:w-1/2 pr-4 mb-8 md:mb-0'>
						<h1 className='text-5xl font-bold mb-6 leading-tight'>
							Build Your{' '}
							<span className='text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine'>
								Resume Effortlessly
							</span>
						</h1>
						<p className='text-lg text-gray-700 mb-8'>
							Craft a standout resume in minutes with our smart and intuitive resume builder.
						</p>
						<button
							className='bg-black text-sm font-semibold text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer'
							onClick={handleCTA}
						>
							Get Started
						</button>
					</div>
					<div className='w-full md:w-1/2'>
						<img src={HERO_IMG} alt='Hero Image' className='w-full rounded-lg' />
					</div>
				</div>
				{/* Features section */}
				<section className='mt-5'>
					<h2 className='text-2xl font-bold text-center mb-12'>Features That Make You Shine</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
							<h3 className='text-lg font-semibold mb-3'>Easy Editing</h3>
							<p className='text-gray-600'>
								Update your resume sections with live preview and instant formatting.
							</p>
						</div>

						<div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
							<h3 className='text-lg font-semibold mb-3'>Beautiful Templates</h3>
							<p className='text-gray-600'>
								Choose from modern, professional templates that are easy to customize.
							</p>
						</div>

						<div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
							<h3 className='text-lg font-semibold mb-3'>One-Click Export</h3>
							<p className='text-gray-600'>
								Download your resume instantly as a high-quality PDF with one click.
							</p>
						</div>
					</div>
				</section>
			</div>
			<div className='text-sm bg-gray-50 text-secondary text-center p-5 mt-5'>
				Made with ❤️... Happy Coding
			</div>
			{/* AuthModal */}
			<Modal open={openAuthModal} onClose={() => setOpenAuthModal(false)} onActionClick={() => {}}>
				<>
					{currentPage == 'login' ? (
						<Login onClose={() => setOpenAuthModal(false)} setCurrentPage={setCurrentPage} />
					) : (
						<Register onClose={() => setOpenAuthModal(false)} setCurrentPage={setCurrentPage} />
					)}
				</>
			</Modal>
		</div>
	)
}

export default LandingPage
