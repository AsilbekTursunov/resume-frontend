import Progress from '../Progress'

interface ILanguageInfo {
	language: string
	progress: number
	accentColor: string
	bgColor: string
}

const LanguageInfo = ({ language, progress, accentColor, bgColor }: ILanguageInfo) => {
	return (
		<div className='flex items-center justify-between'>
			<p className={`text-[12px] font-semibold text-gray-900`}>{language}</p>
			{progress > 0 && (
				<Progress progress={(progress / 100) * 5} color={accentColor} bgColor={bgColor} />
			)}
		</div>
	)
}

interface ILanguageSection {
	languages: {
		name: string
		progress: number
	}[] 
	accentColor: string
	bgColor: string
}

const LanguageSection = ({ languages, accentColor, bgColor }: ILanguageSection) => {
	return (
		<div className='flex flex-col gap-2'>
			{languages?.map((language, index) => (
				<LanguageInfo
					key={`slanguage_${index}`}
					language={language.name}
					progress={language.progress}
					accentColor={accentColor}
					bgColor={bgColor}
				/>
			))}
		</div>
	)
}

export default LanguageSection
