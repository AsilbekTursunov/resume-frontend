import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import DashboardLayout from '../../layouts/DashboardLayout'
import { LuCirclePlus } from 'react-icons/lu'
import Modal from '../../components/Modal'
import CreateResumeForm from './CreateResumeForm'
import ResumeSummaryCard from '../../components/Cards/ResumeSummaryCard'
import type { IResume } from '../../types'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
	const [loading, setLoading] = useState(false)
	const [openCreateModal, setOpenCreateModal] = useState(false)
	const [resumes, setResumes] = useState([])
	const navigate = useNavigate()
	const getAllResumes = async () => {
		setLoading(true)
		try {
			const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
			setResumes(response.data)
		} catch (error) {
			console.error('Error getting all resumes')
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		getAllResumes()
	}, []) 
	
	return (
		<DashboardLayout>
			<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0'>
				<div
					className='h-[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:bg-purple-50/5 cursor-pointer'
					onClick={() => setOpenCreateModal(true)}
				>
					<div className='w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-2xl'>
						<LuCirclePlus className='text-xl text-purple-500' />
					</div>

					<h3 className='font-medium text-gray-800'>Add New Resume</h3>
				</div>

				{resumes?.map((resume: IResume) => (
					<ResumeSummaryCard
						key={resume?._id}
						id={resume?._id!}
						imgUrl={resume?.thumbnailLink}
						title={resume.title}
						lastUpdated={resume?.updatedAt ? moment(resume.updatedAt).format('Do MMM YYYY') : ''}
						onSelect={() => navigate(`/resume/${resume?._id}`)}
					/>
				))}
			</div>

			<Modal
				open={openCreateModal}
				onClose={() => {
					setOpenCreateModal(false)
				}}
				hideHeader
				onActionClick={() => {}}
			>
				<div>
					{' '}
					<CreateResumeForm />
				</div>
			</Modal>
		</DashboardLayout>
	)
}

export default Dashboard
