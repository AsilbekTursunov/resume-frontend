export const BASE_URL = 'https://resume-builder-hfxc.onrender.com/api' //'https://resume-builder-hfxc.onrender.com/api'

// utils/apiPaths.js
export const API_PATHS = {
	AUTH: {
		REGISTER: '/auth/register', // Signup
		LOGIN: '/auth/login', // Authenticate user & return JWT token
		GET_PROFILE: '/auth/refresh', // Get logged-in user details
	},

	RESUME: {
		CREATE: '/resume/create', // POST - Create a new resume
		GET_ALL: '/resume/get-resumes', // GET - Get all resumes of logged-in user
		GET_BY_ID: (id: number | string) => `/resume/one/${id}`, // GET - Get a specific resume
		UPDATE: (id: number | string) => `/resume/update/${id}`, // PUT - Update a resume
		DELETE: (id: number | string) => `/resume/delete/${id}`, // DELETE - Delete a resume
		UPLOAD_IMAGES: (id: number | string) => `/resume/upload-images/${id}`, // PUT - Upload Thumbnail and Resume profile img
	},

	IMAGE: {
		UPLOAD_IMAGE: '/auth/upload-image',
	},
}
