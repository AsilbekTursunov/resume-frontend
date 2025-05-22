import {
	useState,
	useEffect,
	createContext,
	type ReactNode,
	type Dispatch,
	type SetStateAction,
} from 'react'
import { API_PATHS } from '../utils/apiPaths'
import axiosInstance from '../utils/axiosInstance'
import type { IUserData } from '../types'

export const UserContext = createContext<{
	userData: IUserData | null | undefined
	loading: boolean
	updateUser: (data: { status: string; user: IUserData; token: string }) => void
	clearUser: () => void
	setLoading: Dispatch<SetStateAction<boolean>>
}>({
	userData: null,
	loading: true,
	updateUser: () => {},
	clearUser: () => {},
	setLoading: () => {},
})

const UserProvider = ({ children }: { children: ReactNode }) => {
	const [userData, setUserData] = useState<IUserData | null>()
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		if (userData) return

		const token = localStorage.getItem('token')
		if (!token) {
			setLoading(false)
			return
		}

		const fetchUser = async () => {
			setLoading(true)
			try {
				const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
				setUserData(response.data)
			} catch (error) {
				console.error('User not authenticated', error)
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [])

	const updateUser = (data: { status: string; user: IUserData; token: string }) => {
		setUserData(data.user)
		localStorage.setItem('token', data.token)
		setLoading(false)
	}

	const clearUser = () => {
		setUserData(null)
		localStorage.removeItem('token')
	}
	return (
		<UserContext.Provider value={{ userData, loading, updateUser, clearUser, setLoading }}>
			{children}
		</UserContext.Provider>
	)
}

export default UserProvider
