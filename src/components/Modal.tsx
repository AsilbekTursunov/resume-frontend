import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'
interface IModal {
	open: boolean
	onClose: () => void
	title?: string
	hideHeader?: boolean
	children: ReactNode
	showActionBtn?: boolean
	ActionBtnIcon?: IconType
	actionBtnText?: string
	onActionClick: () => void
}
const Modal = ({
	open,
	onClose,
	title,
	hideHeader,
	children,
	showActionBtn,
	ActionBtnIcon,
	actionBtnText,
	onActionClick,
}: IModal) => {
	if (!open) return null
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-700/80'>
			<div className='bg-white rounded-lg p-4 relative'>
				{/* Modal Header */}
				{hideHeader && (
					<div className='flex items-center justify-between p-4 border-b border-gray-200'>
						<h3 className='md:text-lg font-medium text-gray-900'>{title}</h3>

						{showActionBtn && (
							<button className='btn-small-light mr-12' onClick={() => onActionClick()}>
								{ActionBtnIcon && <ActionBtnIcon />}
								{actionBtnText}
							</button>
						)}
					</div>
				)}

				{/* Modal Body (Scrollable) */}
				<div className='flex-1  overflow-y-auto custom-scrollbar'>{children}</div>
				<button
					type='button'
					className='text-gray-400 cursor-pointer bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-2 right-2'
					onClick={onClose}
				>
					<svg
						className='w-3 h-3'
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 14 14'
					>
						<path
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6'
						/>
					</svg>
				</button>
			</div>
		</div>
	)
}

export default Modal
