import { useEffect, useState } from 'react'
import { getLightColorFromImage } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useNavigate } from 'react-router-dom' 
import Modal from '../Modal'
import { CgDanger } from 'react-icons/cg'
import { LuLoader } from 'react-icons/lu'

interface IResumeSummaryCard {
	imgUrl: string
	title: string
	id: string
	lastUpdated: string
	onSelect: () => void
}

const ResumeSummaryCard = ({ id, imgUrl, title, lastUpdated, onSelect }: IResumeSummaryCard) => {
	const [bgColor, setBgColor] = useState('#ffffff')
	const [loading, setLoading] = useState(false)
	const [deleteModal, setDeleteModal] = useState(false)
	const navigate = useNavigate()
	useEffect(() => {
		if (imgUrl) {
			getLightColorFromImage(imgUrl)
				.then(color => {
					setBgColor(color as string)
				})
				.catch(() => {
					setBgColor('#ffffff')
				})
		}
	}, [imgUrl])

	const deleteResume = async (id: string) => {
		setLoading(true)
		try {
			await axiosInstance.delete(API_PATHS.RESUME.DELETE(id))
      navigate('/dashboard')
      setDeleteModal(false)
		} catch (error) {
			alert('Deleting feiled error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className='h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer'
			style={{ backgroundColor: bgColor }}
		>
			<div className='p-4 h-full w-full' onClick={onSelect}>
				{imgUrl ? <img src={imgUrl} alt='' className='w-[100%] h-[200px] rounded object-contain' /> : <div></div>}
			</div>

			<div className='w-full bg-white px-4  py-3 flex  items-center justify-between'>
				<div>
					<h5 className='text-sm font-medium truncate overflow-hidden whitespace-nowrap'>
						{title}
					</h5>
					<p className='text-xs font-medium text-gray-500 mt-0.5'>Last Updated: {lastUpdated}</p>
				</div>
				<div className='flex items-center justify-center'>
					{/* <button
						type='button'
						onClick={() => setDeleteModal(true)}
						className='rounded-lg cursor-pointer border p-1 border-red-300 hover:bg-red-200'
					>
						<LiaTrashAlt className='text-red-600 size-5' />
					</button> */}
				</div>
			</div>
			<Modal open={deleteModal} onClose={() => setDeleteModal(false)} onActionClick={() => {}}>
				<>
					<div className='relative mx-auto shadow-xl rounded-md bg-white max-w-md p-2'>
						<div className=' pt-0 text-center flex flex-col justify-center'>
							<div className='flex justify-center'>
								<CgDanger className='text-red-600 size-14' />
							</div>
							<h3 className='text-base font-normal text-gray-500 mt-2 mb-6'>
								Are you sure you want to delete this resume?
							</h3>
							{loading ? (
								<div className='flex justify-center'>
									<LuLoader className='size-8 animate-spin' />
								</div>
							) : (
								<div className='flex items-center gap-2 justify-center'>
									<button
										type='button'
										onClick={() => setDeleteModal(false)}
										className='text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-sm cursor-pointer px-3 py-2.5 text-center'
										data-modal-toggle='delete-user-modal'
									>
										No, cancel
									</button>
									<button
										type='button'
										onClick={() => deleteResume(id)}
										className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 cursor-pointer font-medium rounded-lg text-sm inline-flex items-center px-3 py-2.5 text-center mr-2'
									>
										Yes, I'm sure
									</button>
								</div>
							)}
						</div>
					</div>
				</>
			</Modal>
		</div>
	)
}

export default ResumeSummaryCard
