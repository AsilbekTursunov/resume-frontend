import type { IconType } from 'react-icons'

interface IProps {
	Icon: IconType
	iconBG: string
	value: string
}
const ContactInfo = ({ Icon, iconBG, value }: IProps) => {
	return (
		<div className='flex items-center gap-3'>
			<div
				className='w-[30px] h-[30px] flex items-center justify-center rounded-full'
				style={{ backgroundColor: iconBG }}
			>
				{<Icon />}
			</div>

			<p className='flex-1 text-[12px] font-medium break-all'>{value}</p>
		</div>
	)
}

export default ContactInfo
