// Импорт модуля для создания и описания модели
import mongoose from "mongoose";

// Создание и описание схемы будущей модели
const UserSchema = new mongoose.Schema(
	{
		// Поле модели с указанием некоторых параметров (тип, уникальность, обязательное ...)
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		avatarUrl: String,
	},
	// Параметры, записывающиеся и обновляющиеся автоматически при создании/изменении схемы
	{
		timestamps: true,
	}
);

// Экспорт модели под названием "User" на основе схемы "UserSchema"
// Далее - MVC (model view controller)
export default mongoose.model("User", UserSchema);
