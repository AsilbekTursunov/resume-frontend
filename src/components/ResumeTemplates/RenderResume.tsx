import type { IResume } from '../../types'
import TemplateOne from './TemplateOne'
import TemplateThree from './TemplateThree'
import TemplateTwo from './TemplateTwo'

interface IProps {
	templateId: string
	resumeData: IResume | any
	colorPalette: string[]
	containerWidth: number 
}

const RenderResume = ({ templateId,   resumeData, colorPalette, containerWidth }: IProps) => {
	switch (templateId) {
		case '01':
			return (
				<TemplateOne 
					resumeData={resumeData}
					colorPalette={colorPalette}
					containerWidth={containerWidth}
				/>
			)
		case '02':
			return (
				<TemplateTwo 
					resumeData={resumeData}
					colorPalette={colorPalette}
					containerWidth={containerWidth}
				/>
			)
		case '03':
			return (
				<TemplateThree  
					resumeData={resumeData}
					colorPalette={colorPalette}
					containerWidth={containerWidth}
				/>
			)
		default:
			return (
				<TemplateOne
					resumeData={resumeData}
					colorPalette={colorPalette}
					containerWidth={containerWidth}
				/>
			)
	}
}

export default RenderResume
