
import type React from "react";

const CreativeForm: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Створення креативу
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Заповніть форму для створення нового line item
					</p>
				</div>
				<div className="hidden message-container"></div>

				<form
					className="creative-form mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md"
					method="POST"
					action="/ssr/upload"
					encType="multipart/form-data"
					data-form="creative-upload"
				>
					<div className="space-y-4">
						<div>
							<div className="block text-sm font-medium text-gray-700 mb-1">
								Розмір *
							</div>
							<input
								name="size"
								type="text"
								required
								defaultValue="728x90"
								pattern="^\d+x\d+$"
								title="Введіть розмір у форматі ШиринаxВисота (наприклад: 728x90)"
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Наприклад: 728x90"
							/>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<div className="block text-sm font-medium text-gray-700 mb-1">
									Мінімальний CPM *
								</div>
								<input
									name="min_cpm"
									type="text"
									required
									defaultValue="0.50"
									pattern="^\d+(\.\d{1,2})?$"
									title="Введіть число з максимум 2 десятковими знаками (наприклад: 0.50)"
									className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="0.50"
								/>
							</div>

							<div>
								<div className="block text-sm font-medium text-gray-700 mb-1">
									Максимальний CPM *
								</div>
								<input
									name="max_cpm"
									type="text"
									required
									defaultValue="4.00"
									pattern="^\d+(\.\d{1,2})?$"
									title="Введіть число з максимум 2 десятковими знаками (наприклад: 4.00)"
									className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="4.00"
								/>
							</div>
						</div>

						<div>
							<div className="block text-sm font-medium text-gray-700 mb-1">
								Географічне таргетування *
							</div>
							<input
								name="geo"
								type="text"
								required
								defaultValue="UA"
								pattern="^[A-Z]{2}(,[A-Z]{2})*$"
								title="Введіть 2-літерні коди країн через кому (наприклад: UA, US, CA)"
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="UA, US, EU"
							/>
						</div>

						<div>
							<div className="block text-sm font-medium text-gray-700 mb-1">
								Тип реклами *
							</div>
							<select
								name="ad_type"
								required
								defaultValue="banner"
								className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							>
								<option value="">Оберіть тип реклами</option>
								<option value="banner">🖼️ Банер</option>
								<option value="video">🎥 Відео</option>
								<option value="native">📱 Нативна</option>
								<option value="popup">🔗 Popup</option>
								<option value="popunder">⬇️ Popunder</option>
							</select>
						</div>

						<div>
							<div className="block text-sm font-medium text-gray-700 mb-1">
								Частота показів *
							</div>
							<input
								name="frequency"
								type="text"
								required
								defaultValue="3"
								pattern="^\d+$"
								title="Введіть ціле число (наприклад: 3)"
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="3"
							/>
						</div>

						<div>
							<div className="block text-sm font-medium text-gray-700 mb-1">
								Завантажте креатив *
							</div>
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
								<div className="space-y-1 text-center">
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
										aria-hidden="true"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<div className="flex text-sm text-gray-600">
										<label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
											<span>Завантажити файл</span>
											<input
												name="creative"
												type="file"
												required
												className="sr-only"
												accept="image/*,video/*"
											/>
										</label>
										<p className="pl-1">або перетягніть сюди</p>
									</div>
									<p className="text-xs text-gray-500">
										PNG, JPG, GIF, MP4 до 10MB
									</p>
								</div>
							</div>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
						>
							Створити креатив
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreativeForm;
