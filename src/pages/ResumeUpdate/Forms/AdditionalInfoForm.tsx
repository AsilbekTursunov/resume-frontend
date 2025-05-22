import { LuPlus, LuTrash2 } from 'react-icons/lu'
import type { IResume } from '../../../types'
import Input from '../../../components/Inputs/Input'
import RatingInput from '../../../components/ResumeSections/RatingInput'

interface IProps {
	languages: {
		name: string
		progress: number
	}[]
	interests: string[]
	updateArrayItem: (
		section: keyof IResume,
		index: number,
		key: string | number | null,
		value: string | number
	) => void
	addArrayItem: (
		section: keyof IResume,
		item:
			| {
					name: string
					progress: number
			  }
			| string
	) => void
	removeArrayItem: (section: keyof IResume, index: number) => void
}

const AdditionalInfoForm = ({
	languages,
	interests,
	updateArrayItem,
	addArrayItem,
	removeArrayItem,
}: IProps) => {
	return (
		<div className='px-5 pt-5'>
			<h2 className='text-lg font-semibold text-gray-900'>Additional Info</h2>

			<div className='mt-6'>
				<h3 className='text-sm font-semibold text-gray-700 mb-2'>Languages</h3>
				<div className='flex flex-col gap-4'>
					{languages?.map((lang, index) => (
						<div key={index} className='border border-gray-200 p-4 rounded-lg relative'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
								<Input
									label='Language'
									type='text'
									placeholder='e.g. English'
									value={lang.name || ''}
									onChange={({ target }) =>
										updateArrayItem('languages', index, 'name', target.value)
									}
								/>

								<div className='flex flex-col h-full'>
									<label className='text-xs font-medium text-slate-600 mb-7 block'>
										Proficiency
									</label>
									<div className=' mb-4 flex-1 flex items-center'>
										<RatingInput
											value={lang.progress || 0}
											onChange={value => updateArrayItem('languages', index, 'progress', value)}
											total={5}
											color='#0ea5e9'
											bgColor='#e0f2fe'
										/>
									</div>
								</div>
							</div>

							{languages.length > 1 && (
								<button
									type='button'
									className='absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer'
									onClick={() => removeArrayItem('languages', index)}
								>
									<LuTrash2 />
								</button>
							)}
						</div>
					))}

					<button
						type='button'
						className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
						onClick={() => addArrayItem('languages', { name: '', progress: 0 })}
					>
						<LuPlus /> Add Language
					</button>
				</div>
			</div>
			{/* Interests Section */}
			<div className='mt-8 mb-4'>
				<h3 className='text-sm font-semibold text-gray-700'>Interests</h3>
				<div className='flex flex-col'>
					{interests?.map((interest, index) => (
						<div key={index} className='relative rounded-lg'>
							<Input
								placeholder='e.g. Reading'
								type='text'
								value={interest || ''}
								onChange={({ target }) => updateArrayItem('interests', index, null, target.value)}
							/>

							{interests.length > 1 && (
								<button
									type='button'
									className='absolute top-6.5 right-3 text-sm text-red-600 hover:underline cursor-pointer'
									onClick={() => removeArrayItem('interests', index)}
								>
									<LuTrash2 />
								</button>
							)}
						</div>
					))}

					<button
						type='button'
						className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
						onClick={() => addArrayItem('interests', '')}
					>
						<LuPlus /> Add Interest
					</button>
				</div>
			</div>
		</div>
	)
}

export default AdditionalInfoForm
