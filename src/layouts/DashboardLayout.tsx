import { useContext, type ReactNode } from 'react'
import Navbar from './Navbar'
import { UserContext } from '../context/userContext'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	const { userData } = useContext(UserContext)
	return (
		<div>
			<Navbar /> 
			{userData && <div className='container mx-auto pt-4 pb-4'>{children}</div>}
		</div>
	)
}

export default DashboardLayout
