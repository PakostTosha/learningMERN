// Импорт "тела" запроса для валидации
import { body } from "express-validator";

// Массив правил валидации
export const registerValidation = [
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Пароль не может быть короче 5 символов").isLength({
		min: 5,
	}),
	body("fullName", "Длина имя должна быть больше или равна 3 символам").isLength(
		{ min: 3 }
	),
	body("avatarUrl", "Неверный формат ссылки на автар").optional().isURL(),
];
