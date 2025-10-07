export interface LineItem {
	user_id: string;
	size: string;
	min_cpm: string;
	max_cpm: string;
	geo: string;
	ad_type: "banner" | "video";
	frequency: string;
	creative_filename: string;
	creative_path?: string;
}

export interface CreativeFile {
	filename: string;
	mimetype: string;
	size: number;
	toBuffer: () => Promise<Buffer>;
}

export interface FormData {
	size: string;
	min_cpm: string;
	max_cpm: string;
	geo: string;
	ad_type: string;
	frequency: string;
	creative: {
		filename: string;
		originalFilename?: string;
		mimetype: string;
		size: number;
	};
}

export interface UploadSuccess {
	success: true;
	message: string;
	lineItemsCount: number;
	creativeId: string;
	user: {
		id: string;
		email: string;
		userName?: string;
	};
}

export interface UploadError {
	error: string;
	statusCode: number;
}
