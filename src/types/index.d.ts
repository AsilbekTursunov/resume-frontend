export interface IUserData {
	id: string
	name: string
	email: string
	image: string
	createdAt: string
}

export interface IResume {
	userId?: string
	title: string
	thumbnailLink: string
	template: {
		theme: string
		colorPalette: string[]
	}
	profileInfo: {
		profilePreviewUrl: string
		fullName: string
		designation: string
		summary: string
		profileImg: string | null | File
	}
	contactInfo: {
		email: string
		phone: string
		location: string
		linkedin: string
		github: string
		website: string
	}
	workExperience: IWorkExperience[]
	education: {
		degree: string
		institution: string
		startDate: string
		endDate: string
		_id?: string
	}[]
	skills: {
		name: string
		progress: number
		_id?: string
	}[]
	projects: {
		title: string
		description: string
		github: string
		liveDemo: string
		_id?: string
	}[]
	certifications: {
		title: string
		issuer: string
		year: string
		_id?: string
	}[]
	languages: {
		name: string
		progress: number
		_id?: string
	}[]
	interests: string[]
	_id?: string
	createdAt?: string
	updatedAt?: string
	__v?: number
}
export interface IWorkExperience {
	company: string
	role: string
	startDate: string // e.g. "2022-01"
	endDate: string // e.g. "2023-12"
	description: string
	_id?: string
}

export type currentPage =
	| 'profile-info'
	| 'contact-info'
	| 'work-experience'
	| 'education-info'
	| 'skills'
	| 'projects'
	| 'certifications'
	| 'additionalInfo'
