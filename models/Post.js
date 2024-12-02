// Импорт модуля для создания и описания модели
import mongoose from "mongoose";

// Создание и описание схемы будущей модели
const PostSchema = new mongoose.Schema(
	{
		// Поле модели с указанием некоторых параметров (тип, уникальность, обязательное ...)
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			require: true,
		},
		imageUrl: String,
	},
	// Параметры, записывающиеся и обновляющиеся автоматически при создании/изменении схемы
	{
		timestamps: true,
	}
);

// Экспорт модели под названием "Post" на основе схемы "PostSchema"
// Далее - MVC (model view controller)
export default mongoose.model("Post", PostSchema);
