import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Home/Dashboard'
import EditResume from './pages/ResumeUpdate/EditResume'
import UserProvider from './context/userContext'

const App = () => { 
	return (
		<UserProvider>
			<div>
				<Router>
					<Routes>
						<Route path='/' element={<LandingPage />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/resume/:id' element={<EditResume />} />
					</Routes>
				</Router>
			</div>
			<Toaster
				toastOptions={{
					className: '',
					style: { fontSize: '13px' },
				}}
			/>
		</UserProvider>
	)
}

export default App
