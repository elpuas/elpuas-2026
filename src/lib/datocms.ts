import { renderMetaTagsToString } from '@datocms/astro/Seo'

type GraphQLVariables = Record<string, unknown>

type DatoResponsiveImage = {
	src: string
	height: number
	width: number
	alt?: string
}

type DatoArticleBlock = {
	id: string
	_modelApiKey: string
}

type DatoParagraphBlock = DatoArticleBlock & {
	content?: {
		value: unknown
	}
}

type DatoCodeBlock = DatoArticleBlock & {
	code?: {
		value: string
	}
}

type DatoContentWithImageBlock = DatoArticleBlock

type DatoGalleryBlock = DatoArticleBlock & {
	images?: {
		responsiveImage?: DatoResponsiveImage
	}[]
	galleryStyle?: string
}

type DatoImageBlock = DatoArticleBlock & {
	alignment?: string
	image?: {
		responsiveImage?: DatoResponsiveImage
	}
}

type DatoArticleRecord = {
	id?: string
	slug?: string
	title?: string
	articleAuthor?: string
	articleDisplayDate?: string
	featuredImage?: {
		responsiveImage?: DatoResponsiveImage
		title?: string
	}
	categories?: {
		title?: string
		slug?: string
		_modelApiKey?: string
	}[]
	content?: (DatoParagraphBlock | DatoCodeBlock | DatoContentWithImageBlock | DatoGalleryBlock | DatoImageBlock)[]
	_seoMetaTags?: {
		tag?: string
		attributes?: Record<string, string>
		content?: string
	}[]
}

const ARTICLES_QUERY = `
	query AllArticles {
		allArticles {
			categories {
				title
				slug
				_modelApiKey
			}
			featuredImage {
				responsiveImage {
					src
					height
					width
					alt
				}
				title
			}
			content {
				... on BlockCodeRecord {
					id
					_modelApiKey
					code {
						value
					}
				}
				... on BlockParagraphRecord {
					id
					_modelApiKey
					content {
						value
					}
				}
				... on BlockContentWithImageRecord {
					id
				}
				... on BlockGalleryRecord {
					id
					images {
						responsiveImage {
							src
							width
							height
						}
					}
					galleryStyle
					_modelApiKey
				}
				... on BlockImageRecord {
					id
					alignment
					_modelApiKey
					image {
						responsiveImage {
							src
							alt
							width
							height
						}
					}
				}
			}
			articleAuthor
			articleDisplayDate
			_seoMetaTags {
				tag
				attributes
				content
			}
			slug
			title
		}
	}
`

export async function fetchGraphQL<TData = unknown>(query: string, variables: GraphQLVariables = {}): Promise<TData> {
	const token =  import.meta.env.DATOCMS_API_KEY

	if (!token) {
		throw new Error('Missing DATOCMS_API_KEY environment variable')
	}

	const response = await fetch('https://graphql.datocms.com/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	} satisfies RequestInit)

	const result = await response.json()

	if (!response.ok || result.errors) {
		const message = result.errors?.[0]?.message ?? 'Failed to fetch data from DatoCMS'
		throw new Error(message)
	}

	return result.data as TData
}

export async function getAllArticles(): Promise<DatoArticleRecord[]> {
	const data = await fetchGraphQL<{ allArticles?: DatoArticleRecord[] }>(ARTICLES_QUERY)
	return data.allArticles ?? []
}

export const renderMetaTags = renderMetaTagsToString

type SeoMetaTag = {
	tag?: string
	attributes?: Record<string, string>
	content?: string
}

export function getSeoDescription(metaTags: SeoMetaTag[] = []): string {
	const extractContent = (meta?: SeoMetaTag) => {
		if (!meta) return ''
		return meta.content || meta.attributes?.content || ''
	}

	for (const meta of metaTags) {
		const tagName = meta?.tag?.toLowerCase()
		const nameAttr = meta?.attributes?.name?.toLowerCase()
		if (tagName === 'meta' && nameAttr === 'description') {
			const content = extractContent(meta)
			if (content) return content
		}
	}

	for (const meta of metaTags) {
		const tagName = meta?.tag?.toLowerCase()
		const propertyAttr = meta?.attributes?.property?.toLowerCase()
		if (tagName === 'meta' && propertyAttr === 'og:description') {
			const content = extractContent(meta)
			if (content) return content
		}
	}

	for (const meta of metaTags) {
		const tagName = meta?.tag?.toLowerCase()
		const nameAttr = meta?.attributes?.name?.toLowerCase()
		if (tagName === 'meta' && nameAttr === 'twitter:description') {
			const content = extractContent(meta)
			if (content) return content
		}
	}

	return ''
}

export const getExcerpt = getSeoDescription

export type { DatoArticleRecord }
