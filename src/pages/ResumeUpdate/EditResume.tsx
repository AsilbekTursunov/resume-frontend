import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import {
	captureElementAsImage,
	dataURLtoFile,
	fixTailwindColors,
	waitForImagesToLoad,
} from '../../utils/helper'
import { LuArrowLeft, LuCircleAlert, LuDownload, LuPalette, LuSave, LuTrash2 } from 'react-icons/lu'
import StepProgress from '../../components/StepProgress'
import TitleInput from '../../components/Inputs/TitleInput'
import DashboardLayout from '../../layouts/DashboardLayout'
import type { currentPage, IResume } from '../../types'
import ProfileInfoForm from './Forms/ProfileInfoForm'
import ContactInfoForm from './Forms/ContactInfoForm'
import WorkExperienceForm from './Forms/WorkExperienceForm'
import EducationInfoForm from './Forms/EducationInfoForm'
import SkillsInfoForm from './Forms/SkillsInfoForm'
import ProjectsDetailFrom from './Forms/ProjectsDetailFrom'
import CertificationInfoForm from './Forms/CertificationInfoForm'
import AdditionalInfoForm from './Forms/AdditionalInfoForm'
import RenderResume from '../../components/ResumeTemplates/RenderResume'
import Modal from '../../components/Modal'
import ThemeSelector from './ThemeSelector'
import { uploadImage } from '../../utils/uploadImage'
import jsPDF from 'jspdf'
import { useReactToPrint } from 'react-to-print'
import html2canvas from 'html2canvas'

const EditResume = () => {
	const { id: resumeId } = useParams()
	const navigate = useNavigate()

	const resumeRef = useRef<HTMLDivElement>(null)
	const resumeDownloadRef = useRef<HTMLDivElement>(null)
	const [baseWidth, setBaseWidth] = useState(800)

	const [openThemeSelector, setOpenThemeSelector] = useState(false)

	const [openPreviewModal, setOpenPreviewModal] = useState(false)

	const [currentPage, setCurrentPage] = useState<currentPage>('profile-info')
	const [progress, setProgress] = useState(0)
	const [resumeData, setResumeData] = useState<IResume>({
		title: 'Senior Java Developer',
		thumbnailLink: '',
		profileInfo: {
			profileImg: null,
			profilePreviewUrl: '',
			fullName: '',
			designation: '',
			summary: '',
		},
		template: {
			theme: '',
			colorPalette: [],
		},
		contactInfo: {
			email: '',
			phone: '',
			location: '',
			linkedin: '',
			github: '',
			website: '',
		},
		workExperience: [
			{
				company: '',
				role: '',
				startDate: '', // e.g. "2022-01"
				endDate: '', // e.g. "2023-12"
				description: '',
			},
		],
		education: [
			{
				degree: '',
				institution: '',
				startDate: '',
				endDate: '',
			},
		],
		skills: [
			{
				name: '',
				progress: 0, // percentage value (0-100)
			},
		],
		projects: [
			{
				title: '',
				description: '',
				github: '',
				liveDemo: '',
			},
		],
		certifications: [
			{
				title: '',
				issuer: '',
				year: '',
			},
		],
		languages: [
			{
				name: '',
				progress: 0, // percentage value (0-100)
			},
		],
		interests: [''],
	})
	const [errorMsg, setErrorMsg] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	// Validate Inputs
	const validateAndNext = () => {
		const errors = []

		switch (currentPage) {
			case 'profile-info':
				const { fullName, designation, summary } = resumeData.profileInfo
				if (!fullName.trim()) errors.push('Full Name is required')
				if (!designation.trim()) errors.push('Designation is required')
				if (!summary.trim()) errors.push('Summary is required')
				break

			case 'contact-info':
				const { email, phone } = resumeData.contactInfo
				if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required.')
				if (!phone.trim()) errors.push('Valid 10-digit phone number is required')
				break

			case 'work-experience':
				resumeData.workExperience.forEach(({ company, role, startDate, endDate }, index) => {
					if (!company.trim()) errors.push(`Company is required in experience ${index + 1}`)
					if (!role.trim()) errors.push(`Role is required in experience ${index + 1}`)
					if (!startDate || !endDate)
						errors.push(`Start and End dates are required in experience ${index + 1}`)
				})
				break

			case 'education-info':
				resumeData.education.forEach(({ degree, institution, startDate, endDate }, index) => {
					if (!degree.trim()) errors.push(`Degree is required in education ${index + 1}`)
					if (!institution.trim()) errors.push(`Institution is required in education ${index + 1}`)
					if (!startDate || !endDate)
						errors.push(`Start and End dates are required in education ${index + 1}`)
				})
				break

			case 'skills':
				resumeData.skills.forEach(({ name, progress }, index) => {
					if (!name.trim()) errors.push(`Skill name is required in skill ${index + 1}`)
					if (progress < 1 || progress > 100)
						errors.push(`Skill progress must be between 1 and 100 in skill ${index + 1}`)
				})
				break

			case 'projects':
				resumeData.projects.forEach(({ title, description }, index) => {
					if (!title.trim()) errors.push(`Project title is required in project ${index + 1}`)
					if (!description.trim())
						errors.push(`Project description is required in project ${index + 1}`)
				})
				break

			case 'certifications':
				resumeData.certifications.forEach(({ title, issuer }, index) => {
					if (!title.trim())
						errors.push(`Certification title is required in certification ${index + 1}`)
					if (!issuer.trim()) errors.push(`Issuer is required in certification ${index + 1}`)
				})
				break

			case 'additionalInfo':
				if (resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
					errors.push('At least one language is required')
				}

				if (resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
					errors.push('At least one interest is required')
				}
				break

			default:
				break
		}

		if (errors.length > 0) {
			setErrorMsg(errors.join(', '))
			return
		}

		// Move to next step
		setErrorMsg('')
		goToNextStep()
	}

	// Function to navigate to the next page
	const goToNextStep = () => {
		const pages = [
			'profile-info',
			'contact-info',
			'work-experience',
			'education-info',
			'skills',
			'projects',
			'certifications',
			'additionalInfo',
		]

		if (currentPage === 'additionalInfo') setOpenPreviewModal(true)

		const currentIndex = pages.indexOf(currentPage)
		if (currentIndex !== -1 && currentIndex < pages.length - 1) {
			const nextIndex = currentIndex + 1
			setCurrentPage(pages[nextIndex] as currentPage)

			// Set progress as percentage
			const percent = Math.round((nextIndex / (pages.length - 1)) * 100)
			setProgress(percent)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	// Function to navigate to the previous page
	const goBack = () => {
		const pages = [
			'profile-info',
			'contact-info',
			'work-experience',
			'education-info',
			'skills',
			'projects',
			'certifications',
			'additionalInfo',
		]

		if (currentPage === 'profile-info') navigate('/dashboard')

		const currentIndex = pages.indexOf(currentPage)
		if (currentIndex > 0) {
			const prevIndex = currentIndex - 1
			setCurrentPage(pages[prevIndex] as currentPage)

			// Update progress
			const percent = Math.round((prevIndex / (pages.length - 1)) * 100)
			setProgress(percent)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	const renderForm = () => {
		switch (currentPage) {
			case 'profile-info':
				return (
					<>
						<ProfileInfoForm
							profileData={resumeData.profileInfo}
							updateSection={(key, value) => updateSection('profileInfo', key, value)}
							onNext={validateAndNext}
						/>
					</>
				)
			case 'contact-info':
				return (
					<>
						<ContactInfoForm
							contactInfo={resumeData.contactInfo}
							updateSection={(key, value) => updateSection('contactInfo', key, value)}
						/>
					</>
				)
			case 'work-experience':
				return (
					<>
						<WorkExperienceForm
							workExperience={resumeData?.workExperience}
							updateArrayItem={(index, key, value) => {
								updateArrayItem('workExperience', index, key, value)
							}}
							addArrayItem={newItem => addArrayItem('workExperience', newItem)}
							removeArrayItem={index => removeArrayItem('workExperience', index)}
						/>
					</>
				)
			case 'education-info':
				return (
					<>
						<EducationInfoForm
							educationInfo={resumeData?.education}
							updateArrayItem={(index, key, value) => {
								updateArrayItem('education', index, key, value)
							}}
							addArrayItem={newItem => addArrayItem('education', newItem)}
							removeArrayItem={index => removeArrayItem('education', index)}
						/>
					</>
				)
			case 'skills':
				return (
					<>
						<SkillsInfoForm
							skillsInfo={resumeData?.skills}
							updateArrayItem={(index, key, value) => {
								updateArrayItem('skills', index, key, value)
							}}
							addArrayItem={newItem => addArrayItem('skills', newItem)}
							removeArrayItem={index => removeArrayItem('skills', index)}
						/>
					</>
				)
			case 'projects':
				return (
					<>
						<ProjectsDetailFrom
							projectInfo={resumeData?.projects}
							updateArrayItem={(index, key, value) => {
								updateArrayItem('projects', index, key, value)
							}}
							addArrayItem={newItem => addArrayItem('projects', newItem)}
							removeArrayItem={index => removeArrayItem('projects', index)}
						/>
					</>
				)
			case 'certifications':
				return (
					<>
						<CertificationInfoForm
							certifications={resumeData?.certifications}
							updateArrayItem={(index, key, value) => {
								updateArrayItem('certifications', index, key, value)
							}}
							addArrayItem={newItem => addArrayItem('certifications', newItem)}
							removeArrayItem={index => removeArrayItem('certifications', index)}
						/>
					</>
				)
			case 'additionalInfo':
				return (
					<AdditionalInfoForm
						languages={resumeData.languages}
						interests={resumeData.interests}
						updateArrayItem={(section, index, key, value) =>
							updateArrayItem(section, index, key, value)
						}
						addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
						removeArrayItem={(section, index) => removeArrayItem(section, index)}
					/>
				)
		}
	}

	// Update simple nested object (like profileInfo, contactInfo, etc.)
	const updateSection = (section: keyof typeof resumeData, key: string, value: any) => {
		setResumeData(prev => ({
			...prev,
			[section]: {
				...(prev[section] as any[]),
				[key]: value,
			},
		}))
	}

	// Update array item (like workExperience[0], skills[1], etc.)
	const updateArrayItem = (
		section: keyof typeof resumeData,
		index: string | number,
		key: string | null | number,
		value: any
	) => {
		setResumeData(prev => {
			const updatedArray = [...(prev[section] as any[])]

			if (key === null) {
				updatedArray[Number(index)] = value // for simple strings like in `interests`
			} else {
				updatedArray[Number(index)] = {
					...updatedArray[Number(index)],
					[key]: value,
				}
			}

			return {
				...prev,
				[section]: updatedArray,
			}
		})
	}

	// Add item to array
	const addArrayItem = (section: keyof typeof resumeData, newItem: any) => {
		setResumeData(prev => ({
			...prev,
			[section]: [...(prev[section] as any[]), newItem],
		}))
	}

	// Remove item from array
	const removeArrayItem = (section: keyof typeof resumeData, index: number) => {
		setResumeData(prev => {
			const updatedArray = [...(prev[section] as any[])]
			updatedArray.splice(index, 1)
			return {
				...prev,
				[section]: updatedArray,
			}
		})
	}

	// Fetch resume info by ID
	const fetchResumeDetailsById = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId!))
			console.log('Resume Details:', response.data)

			if (response.data && response.data.profileInfo) {
				const resumeInfo = response.data

				setResumeData(prevState => ({
					...prevState,
					title: resumeInfo?.title || 'Untitled',
					template: resumeInfo?.template || prevState?.template,
					profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
					contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
					workExperience: resumeInfo?.workExperience || prevState?.workExperience,
					education: resumeInfo?.education || prevState?.education,
					skills: resumeInfo?.skills || prevState?.skills,
					projects: resumeInfo?.projects || prevState?.projects,
					certifications: resumeInfo?.certifications || prevState?.certifications,
					languages: resumeInfo?.languages || prevState?.languages,
					interests: resumeInfo?.interests || prevState?.interests,
				}))
			}
		} catch (error) {
			console.error('Error fetching resumes:', error)
		}
	}

	// upload thumbnail and resume profile img
	const uploadResumeImages = async () => {
		try {
			setIsLoading(true)

			fixTailwindColors(resumeRef?.current!)
			const imageDataUrl = await captureElementAsImage(resumeRef.current!)

			// Convert base64 to File
			const thumbnailFile = dataURLtoFile(imageDataUrl, `resume-${Date.now()}.png`)
			await uploadImage(thumbnailFile)
			const profileImageFile = resumeData?.profileInfo?.profileImg || null

			const formData = new FormData()
			if (resumeData?.profileInfo?.profileImg && resumeData?.profileInfo?.profileImg !== null) {
				if (profileImageFile) formData.append('profileImage', profileImageFile)
				if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
				const uploadResponse = await axiosInstance.put(
					API_PATHS.RESUME.UPLOAD_IMAGES(resumeId!),
					formData,
					{ headers: { 'Content-Type': 'multipart/form-data' } }
				)
				const { thumbnailLink, profilePreviewUrl } = uploadResponse.data
				console.log('thumbnailLink profilePreviewUrl:', uploadResponse.data)

				await updateResumeDetails(thumbnailLink, profilePreviewUrl)
			} else {
				formData.append('thumbnail', thumbnailFile)
				const imageUrl = await uploadImage(thumbnailFile)
				console.log('thumbnailLink Response:', imageUrl)
				await updateResumeDetails(imageUrl, '')
			}

			// Call the second API to update other resume data

			toast.success('Resume Updated Successfully!')
			navigate('/dashboard')
		} catch (error) {
			console.error('Error uploading images:', error)
			toast.error('Failed to upload images')
		} finally {
			setIsLoading(false)
		}
	}

	const updateResumeDetails = async (thumbnailLink: string, profilePreviewUrl: string) => {
		try {
			setIsLoading(true)

			await axiosInstance.post(API_PATHS.RESUME.UPDATE(resumeId!), {
				...resumeData,
				thumbnailLink: thumbnailLink || '',
				profileInfo: {
					...resumeData.profileInfo,
					profilePreviewUrl: profilePreviewUrl || resumeData.profileInfo?.profilePreviewUrl,
					profileImg: profilePreviewUrl || resumeData.profileInfo?.profilePreviewUrl,
				},
			})
			toast.success('Resume Updated Successfully!')
			navigate('/dashboard')
		} catch (err) {
			console.error('Error capturing image:', err)
		} finally {
			setIsLoading(false)
		}
	}

	// Delete Resume
	const handleDeleteResume = async () => {
		try {
			setIsLoading(true)
			await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId!))
			toast.success('Resume Deleted Successfully')
			navigate('/dashboard')
		} catch (err) {
			console.error('Error capturing image:', err)
		} finally {
			setIsLoading(false)
		}
	}

	// download resume
	const reactToPrintFn = async () => {
		const element = document.getElementById('resume')
		if (!element) return

		fixTailwindColors(element)
		await waitForImagesToLoad(element)
		const canva = await html2canvas(element, {
			scale: 3,
			useCORS: true,
		})
		const imgData = canva.toDataURL('image/png')
		const image = new Image()
		image.src = imgData
		image.crossOrigin = 'Anonymous' // Handle CORS issues
		await new Promise(resolve => {
			image.onload = resolve
		})

		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'px',
			format: [element.offsetWidth, element.offsetHeight],
			compression: 'DEFLATE',
		})
		const width = pdf.internal.pageSize.getWidth()
		const height = canva.height * (width / canva.width)
		pdf.addImage(image, 'PNG', 0, 0, width, height)
		pdf.save(`${Date.now()}.pdf`)
		setOpenPreviewModal(false)
		toast.success('Resume downloaded successfully!')
	}

	// Function to update baseWidth based on the resume container size
	const updateBaseWidth = () => {
		if (resumeRef.current) {
			setBaseWidth(resumeRef.current.offsetWidth)
		}
	}

	useEffect(() => {
		updateBaseWidth()
		window.addEventListener('resize', updateBaseWidth)

		if (resumeId) {
			fetchResumeDetailsById()
		}

		return () => {
			window.removeEventListener('resize', updateBaseWidth)
		}
	}, [])
	console.log(resumeData)

	return (
		<DashboardLayout>
			<div>
				<div className='container mx-auto'>
					<div className='flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4'>
						<TitleInput
							title={resumeData.title}
							setTitle={value =>
								setResumeData(prevState => ({
									...prevState,
									title: value.target.value,
								}))
							}
						/>

						<div className='flex items-center gap-4'>
							<button className='btn-small-light' onClick={() => setOpenThemeSelector(true)}>
								<LuPalette className='text-[16px]' />
								<span className='hidden md:block'>Change Theme</span>
							</button>

							<button className='btn-small-light' onClick={handleDeleteResume}>
								<LuTrash2 className='text-[16px]' />
								<span className='hidden md:block'>Delete</span>
							</button>

							<button
								className='btn-small-light'
								onClick={() => {
									setOpenPreviewModal(true)
								}}
							>
								<LuDownload className='text-[16px]' />
								<span className='hidden md:block'>Preview & Download</span>
							</button>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-5 '>
						<div className='bg-white rounded-lg border h-fit border-purple-100 overflow-hidden'>
							<StepProgress progress={progress} />

							{renderForm()}

							<div className='mx-5'>
								{errorMsg && (
									<div className='flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded'>
										<LuCircleAlert className='text-md' /> {errorMsg}
									</div>
								)}

								<div className='flex items-end justify-end gap-3 mt-3 mb-5'>
									<button className='btn-small-light' onClick={goBack} disabled={isLoading}>
										<LuArrowLeft className='text-[16px]' />
										Back
									</button>
									<button
										className='btn-small-light'
										onClick={uploadResumeImages}
										disabled={isLoading}
									>
										<LuSave className='text-[16px]' />
										{isLoading ? 'Updating...' : 'Save & Exit'}
									</button>
									<button className='btn-small' onClick={validateAndNext} disabled={isLoading}>
										{currentPage === 'additionalInfo' && <LuDownload className='text-[16px]' />}

										{currentPage === 'additionalInfo' ? 'Preview & Download' : 'Next'}
										{currentPage !== 'additionalInfo' && (
											<LuArrowLeft className='text-[16px] rotate-180' />
										)}
									</button>
								</div>
							</div>
						</div>

						<div ref={resumeRef} className='h-[100vh]'>
							{/* Resume Template */}
							<RenderResume
								templateId={resumeData?.template?.theme || ''}
								resumeData={resumeData}
								colorPalette={resumeData?.template?.colorPalette || []}
								containerWidth={baseWidth}
							/>
						</div>
					</div>
				</div>
			</div>
			<Modal
				open={openThemeSelector}
				onClose={() => setOpenThemeSelector(false)}
				title='Select Theme'
				onActionClick={() => {}}
			>
				<div className='w-[90vw] h-[80vh]'>
					<ThemeSelector
						selectedTheme={resumeData?.template}
						setSelectedTheme={value =>
							setResumeData(prevState => ({
								...prevState,
								template: value || prevState?.template,
							}))
						}
						resumeData={null}
						onClose={() => setOpenThemeSelector(false)}
					/>
				</div>
			</Modal>
			<Modal
				open={openPreviewModal}
				onClose={() => setOpenPreviewModal(false)}
				title={resumeData.title}
				showActionBtn={true}
				hideHeader={true}
				actionBtnText='Download'
				ActionBtnIcon={LuDownload}
				onActionClick={() => reactToPrintFn()}
			>
				<div ref={resumeDownloadRef} id='my-resume' className='w-[90vw] h-[85vh] flex flex-col'>
					<RenderResume
						templateId={resumeData?.template?.theme || ''}
						resumeData={resumeData}
						containerWidth={baseWidth * 2.1}
						colorPalette={resumeData?.template?.colorPalette || []}
					/>
				</div>
			</Modal>
		</DashboardLayout>
	)
}

export default EditResume
