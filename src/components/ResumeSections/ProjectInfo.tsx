import { LuGithub, LuExternalLink } from 'react-icons/lu'
import ActionLink from './ActionLink'

interface IProps {
	title: string
	description: string
	githubLink: string
	liveDemoUrl: string
	bgColor: string
	isPreview?: string | boolean | number
}

const ProjectInfo = ({
	title,
	description,
	githubLink,
	liveDemoUrl,
	bgColor,
	isPreview,
}: IProps) => {
	return (
		<div className='mb-5'>
			<h3 className={`${isPreview ? 'text-xs' : 'text-base'} font-semibold text-gray-900`}>
				{title}
			</h3>
			<p className='text-sm text-gray-700 font-medium mt-1'>{description}</p>

			<div className='flex items-center gap-3 mt-2'>
				{githubLink && <ActionLink Icon={LuGithub} link={githubLink} bgColor={bgColor} />}

				{liveDemoUrl && <ActionLink Icon={LuExternalLink} link={liveDemoUrl} bgColor={bgColor} />}
			</div>
		</div>
	)
}

export default ProjectInfo
