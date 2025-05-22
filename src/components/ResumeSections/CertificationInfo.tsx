
interface IPros {
	title: string
	issuer: string
	year: string
	bgColor: string
}
const CertificationInfo = ({ title, issuer, year, bgColor }: IPros) => {
	return (
		<div className=''>
			<h3 className={`text-[15px] font-semibold text-gray-900`}>{title}</h3>

			<div className='flex items-center gap-2 mt-2'>
				{year && (
					<div
						className='text-[11px] font-bold text-gray-800 px-3 py-0.5 inline-block rounded-lg'
						style={{ backgroundColor: bgColor }}
					>
						{year}
					</div>
				)}

				<p className='text-[12px] text-gray-700 font-medium'>{issuer}</p>
			</div>
		</div>
	)
}

export default CertificationInfo
