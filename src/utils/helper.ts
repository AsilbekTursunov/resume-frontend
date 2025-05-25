import moment from 'moment'
import html2canvas from 'html2canvas'

const emaiRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#_]{8,}/
const nameRegex = /^[A-Za-z\d]{6,}/

export const userNameValidation = (name: string) => {
	if (!name) return 'Please enter fullname'
	if (!nameRegex.test(name)) return 'Required 1 capital letter and number'
	return ''
}

export const emailValidation = (email: string) => {
	if (!email) return 'Please enter your email'
	if (!emaiRegex.test(email)) return 'Required 1 capital letter and number'
	return ''
}

export const passwordValidation = (password: string) => {
	if (!password) return 'Please enter your password'
	if (!passwordRegex.test(password)) return 'At least 1 capital letter, 1 digit min 8 chars'
	return ''
}

// get lightest average color
export const getLightColorFromImage = (imageUrl: string) => {
	return new Promise((resolve, reject) => {
		// Check if imageUrl is valid
		if (!imageUrl || typeof imageUrl !== 'string') {
			return reject(new Error('Invalid image URL'))
		}

		const img = new Image()

		// If not a base64 string, set crossOrigin (important for CORS)
		if (!imageUrl.startsWith('data:')) {
			img.crossOrigin = 'anonymous'
		}

		img.src = imageUrl

		img.onload = () => {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			canvas.width = img.width
			canvas.height = img.height
			ctx?.drawImage(img, 0, 0)

			const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data

			let r = 0,
				g = 0,
				b = 0,
				count = 0

			if (imageData) {
				for (let i = 0; i < imageData.length; i += 4) {
					const red = imageData[i]
					const green = imageData[i + 1]
					const blue = imageData[i + 2]
					const brightness = (red + green + blue) / 3

					// Only count light pixels (tweak threshold as needed)
					if (brightness > 180) {
						r += red
						g += green
						b += blue
						count++
					}
				}
			}

			if (count === 0) {
				resolve('#ffffff') // fallback if no bright pixels found
			} else {
				r = Math.round(r / count)
				g = Math.round(g / count)
				b = Math.round(b / count)
				resolve(`rgb(${r}, ${g}, ${b})`)
			}
		}

		img.onerror = e => {
			console.error('❌ Failed to load image:', e)
			reject(new Error('Image could not be loaded or is blocked by CORS.'))
		}
	})
}

// Eg: Mar 2025
export function formatYearMonth(yearMonth: string) {
	return yearMonth ? moment(yearMonth, 'YYYY-MM').format('MMM YYYY') : ''
}

export const fixTailwindColors = (element: HTMLElement) => {
	const elements = element.querySelectorAll('*')

	elements.forEach((el: any) => {
		const style = window.getComputedStyle(el)

		;(['color', 'backgroundColor', 'borderColor'] as Array<keyof CSSStyleDeclaration>).forEach(
			prop => {
				const value = style[prop]
				if (typeof value === 'string' && value.includes('oklch')) {
					el.style[prop] = '#000' // or any safe fallback
				}
			}
		)
	})
}

// convert component to image
export async function captureElementAsImage(element: HTMLDivElement) {
	// ⏳ Rasmlarni yuklanishini kuting
	await waitForImagesToLoad(element)

	const canvas = await html2canvas(element, {
		scale: 1, // Sifatni oshirish uchun (ixtiyoriy)
	})
	return canvas.toDataURL('image/png')
}

// Utility to convert base64 data URL to a File object
export const dataURLtoFile = (dataUrl: string, fileName: string) => {
	const arr = dataUrl.split(',')
	const match = arr[0].match(/:(.*?);/)
	if (!match) throw new Error('Invalid data URL format')
	const mime = match[1]
	const bstr = atob(arr[1])
	let n = bstr.length
	const u8arr = new Uint8Array(n)

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}

	return new File([u8arr], fileName, { type: mime })
}

export const pxToMm = (px: number, element: HTMLDivElement) => {
	return Math.floor(px / element.offsetHeight)
}

export const mmToPx = (mm: number, element: HTMLDivElement) => {
	return element.offsetHeight * mm
}

export const waitForImagesToLoad = (container: HTMLElement) => {
	const images = container.querySelectorAll('img')
	return Promise.all(
		Array.from(images).map(img => {
			if (img.complete) return Promise.resolve()
			return new Promise(resolve => {
				img.onload = img.onerror = resolve
			})
		})
	)
}
