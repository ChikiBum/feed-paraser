import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import React from "react";
import ReactDOMServer from "react-dom/server";
import CreativeForm from "../page/CreativeForm";
import {
	uploadErrorSchema,
	uploadSuccessSchema,
} from "../schemas/upload.schema";
import type { CreativeFile, FormData, LineItem } from "../types/ssr.type";

const lineItems: LineItem[] = [];

function generateUniqueFilename(originalFilename: string): string {
	const timestamp = Date.now();
	const randomSuffix = randomBytes(4).toString("hex");
	const fileExtension = path.extname(originalFilename);
	const baseName = path.basename(originalFilename, fileExtension);

	return `${baseName}_${timestamp}_${randomSuffix}${fileExtension}`;
}

export async function ssrRoute(fastify: FastifyInstance) {
	fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
		const html = ReactDOMServer.renderToString(
			React.createElement(CreativeForm),
		);

		reply.type("text/html; charset=utf-8").send(`
            <!DOCTYPE html>
            <html lang="ru">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Creative Form SSR</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="bg-gray-100 font-sans">
                    <div id="root">${html}</div>
                    <script>
                        document.addEventListener('DOMContentLoaded', function() {
                            const form = document.querySelector('.creative-form');
                            const messageContainer = document.querySelector('.message-container');
                            
                            if (!form) return;
                            
                            function showMessage(text, type = 'success') {
                                messageContainer.className = type === 'success' 
                                    ? 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4'
                                    : 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4';
                                messageContainer.innerHTML = text;
                                messageContainer.classList.remove('hidden');
                                
                                setTimeout(() => {
                                    messageContainer.classList.add('hidden');
                                }, 5000);
                            }
                            
                            function resetFormToDefaults() {
                                const sizeInput = form.querySelector('[name="size"]');
                                const minCpmInput = form.querySelector('[name="min_cpm"]');
                                const maxCpmInput = form.querySelector('[name="max_cpm"]');
                                const geoInput = form.querySelector('[name="geo"]');
                                const adTypeSelect = form.querySelector('[name="ad_type"]');
                                const frequencyInput = form.querySelector('[name="frequency"]');
                                const creativeInput = form.querySelector('[name="creative"]');
                                
                                if (sizeInput) sizeInput.value = '728x90';
                                if (minCpmInput) minCpmInput.value = '0.50';
                                if (maxCpmInput) maxCpmInput.value = '4.00';
                                if (geoInput) geoInput.value = 'UA';
                                if (adTypeSelect) adTypeSelect.value = 'banner';
                                if (frequencyInput) frequencyInput.value = '3';
                                if (creativeInput) creativeInput.value = '';
                                
                            }
                            
                            form.addEventListener('submit', async function(e) {
                                e.preventDefault();
                                
                                const submitButton = form.querySelector('button[type="submit"]');
                                const originalText = submitButton.textContent;
                                
                                try {
                                    submitButton.textContent = 'Uploading...';
                                    submitButton.disabled = true;
                                    
                                    const formData = new FormData(form);
                                    
                                    for (let [key, value] of formData.entries()) {
                                        if (key !== 'creative') {
                                            console.log(\`  \${key}: \${value}\`);
                                        } else {
                                            console.log(\`  \${key}: \${value.name} (\${value.size} bytes)\`);
                                        }
                                    }
                                    
                                    function getCookie(name) {
                                        const value = \`; \${document.cookie}\`;
                                        const parts = value.split(\`; \${name}=\`);
                                        if (parts.length === 2) return parts.pop().split(';').shift();
                                        return null;
                                    }
                                    
                                    const token = getCookie('token');

																		console.log('🔐 SSR JWT token from cookies:', token);
                                    
                                    const headers = {};
                                    if (token) {
                                        headers['Authorization'] = \`Bearer \${token}\`;
                                        console.log('🔐 Sending with JWT token from cookies');
                                    } else {
                                        console.warn('⚠️ JWT token not found in cookies');
                                        console.warn('📋 Please authenticate first via /auth/login');
                                    }
                                    
                                    const response = await fetch('/ssr/upload', {
                                        method: 'POST',
                                        headers: headers,
                                        body: formData,
																				credentials: "include"
                                    });
                                    
                                    const result = await response.json();
                                    
                                    if (response.ok && result.success) {
                                        showMessage(\`✅ \${result.message} (Total line items: \${result.lineItemsCount})\`, 'success');
                                        
                                        resetFormToDefaults();
                                    } else {
                                        						throw new Error(result.error || 'Upload error');
                                    }
                                    
                                } catch (error) {
                                    console.error('❌ Error:', error);
                                    showMessage(\`❌ Error: \${error.message}\`, 'error');
                                } finally {
                                    submitButton.textContent = originalText;
                                    submitButton.disabled = false;
                                }
                            });
                        });
                    </script>
                </body>
            </html>
        `);
	});

	fastify.post(
		"/upload",
		{
			schema: {
				response: {
					200: uploadSuccessSchema,
					400: uploadErrorSchema,
					401: uploadErrorSchema,
					500: uploadErrorSchema,
				},
			},
			preValidation: [fastify.authenticate],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const user = request.user as {
					id: string;
					email: string;
					userName?: string;
				};

				console.log("👤 Authenticated user:", {
					id: user.id,
					email: user.email,
					userName: user.userName,
				});

				if (!request.isMultipart()) {
					return reply.status(400).send({
						error: "Request is not multipart",
						statusCode: 400,
					});
				}
				const fields: Record<string, string> = {};
				let creativeFile: CreativeFile | null = null;
				let originalFilename: string = "";

				for await (const part of request.parts()) {
					if (part.type === "file") {
						if (part.fieldname === "creative") {
							const fileBuffer = await part.toBuffer();

							originalFilename = part.filename || "creative";

							const uniqueFilename = generateUniqueFilename(originalFilename);

							creativeFile = {
								filename: uniqueFilename,
								mimetype: part.mimetype,
								size: fileBuffer.length,
								toBuffer: async () => fileBuffer,
							};

							const userCreativesDir = path.join(
								process.cwd(),
								"public",
								"creatives",
								user.id,
							);
							await fs.mkdir(userCreativesDir, { recursive: true });

							const creativePath = path.join(userCreativesDir, uniqueFilename);
							await fs.writeFile(creativePath, fileBuffer);

							console.log("✅ File saved to user folder:", creativePath);
							console.log("👤 User ID:", user.id);
							console.log("📝 Original filename:", originalFilename);
							console.log("🆔 Unique filename:", uniqueFilename);
						}
					} else {
						fields[part.fieldname] = part.value as string;
					}
				}

				if (!creativeFile) {
					return reply.status(400).send({
						error: "No creative file uploaded",
						statusCode: 400,
					});
				}

				const formData: FormData = {
					size: fields.size,
					min_cpm: fields.min_cpm,
					max_cpm: fields.max_cpm,
					geo: fields.geo,
					ad_type: fields.ad_type,
					frequency: fields.frequency,
					creative: {
						filename: creativeFile.filename,
						originalFilename: originalFilename,
						mimetype: creativeFile.mimetype,
						size: creativeFile.size,
					},
				};

				console.log("🚀 Received POST request to /ssr/upload:");
				console.log("👤 User:", {
					id: user.id,
					email: user.email,
					userName: user.userName,
				});
				console.log("📊 Form data:", JSON.stringify(formData, null, 2));
				console.log("📁 Creative file:", {
					originalName: originalFilename,
					uniqueName: creativeFile.filename,
					mimetype: creativeFile.mimetype,
					size: creativeFile.size,
				});

				lineItems.push({
					user_id: user.id,
					size: formData.size,
					min_cpm: formData.min_cpm,
					max_cpm: formData.max_cpm,
					geo: formData.geo,
					ad_type: formData.ad_type as LineItem["ad_type"],
					frequency: formData.frequency,
					creative_filename: creativeFile.filename,
					creative_path: `creatives/${user.id}/${creativeFile.filename}`,
				});

				if (lineItems.length > 5) lineItems.shift();

				reply.status(200).send({
					success: true,
					message: "Creative successfully created!",
					lineItemsCount: lineItems.length,
					user: {
						id: user.id,
						email: user.email,
						userName: user.userName,
					},
				});
			} catch (error) {
				console.error("❌ Upload error:", error);
				reply.status(500).send({
					error: "Upload failed",
					statusCode: 500,
				});
			}
		},
	);
}
