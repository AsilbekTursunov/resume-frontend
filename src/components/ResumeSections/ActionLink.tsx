import type { IconType } from 'react-icons'

interface IActionLink {
	Icon: IconType
	link: string
	bgColor: string
}

const ActionLink = ({ Icon, link, bgColor }: IActionLink) => {
	return (
		<div className='flex items-center gap-3'>
			<div
				className='w-[25px] h-[25px] flex items-center justify-center rounded-full'
				style={{ backgroundColor: bgColor }}
			>
				{<Icon />}
			</div>

			<p className='text-[13px] font-medium underline cursor-pointer break-all'>{link}</p>
		</div>
	)
}

export default ActionLink
