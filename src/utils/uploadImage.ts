import { API_PATHS } from './apiPaths'
import axiosInstance from './axiosInstance'

export const uploadImage = async (image: File) => {
	const formData = new FormData()
	// Append image file to form data
	formData.append('image', image)

	try {
		const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
			headers: {
				'Content-Type': 'multipart/form-data', // Set header for file upload
			},
		})
		return response.data.imageUrl
	} catch (error) {
		console.error('Error uploading prfolie image', error)
	}
}
