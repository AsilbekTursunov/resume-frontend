import { LuPlus, LuTrash2 } from 'react-icons/lu'
import Input from '../../../components/Inputs/Input'
import RatingInput from '../../../components/ResumeSections/RatingInput'

interface IProps {
	skillsInfo: {
		name: string
		progress: number
	}[]
	updateArrayItem: (index: number, key: number | string | null, value: string) => void
	addArrayItem: (item: { name: string; progress: number }) => void
	removeArrayItem: (index: number) => void
}

const SkillsInfoForm = ({ skillsInfo, addArrayItem, updateArrayItem, removeArrayItem }: IProps) => {
	return (
		<div className='px-5 pt-3'>
			<h2 className='text-lg font-semibold text-gray-900'>Skills</h2>

			<div className='mt-4 flex flex-col gap-4 mb-3'>
				{skillsInfo.map((skill, index) => (
					<div key={index} className='border border-gray-200/80 p-4 rounded-lg relative'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<Input
								label='Skill Name'
								placeholder='JavaScript'
								type='text'
								value={skill.name || ''}
								onChange={({ target }) => updateArrayItem(index, 'name', target.value)}
							/>

							<div className='flex flex-col'>
								<label className='text-[13px] text-slate-800 mb-1'>
									Proficiency ({skill.progress / 20 || 0}/5)
								</label>
								<div className='mt-5  mb-4 flex-1 flex items-center'>
									<RatingInput
										value={skill.progress || 0}
										total={5}
										onChange={newValue => updateArrayItem(index, 'progress', String(newValue))}
									/>
								</div>
							</div>
						</div>

						{skillsInfo.length > 1 && (
							<button
								type='button'
								className='absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer'
								onClick={() => removeArrayItem(index)}
							>
								<LuTrash2 />
							</button>
						)}
					</div>
				))}

				<button
					className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
					onClick={() =>
						addArrayItem({
							name: '',
							progress: 0,
						})
					}
				>
					<LuPlus /> Add Skill
				</button>
			</div>
		</div>
	)
}

export default SkillsInfoForm
