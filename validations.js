// Импорт "тела" запроса для валидации
import { body } from "express-validator";

// Массив правил валидации регистрации
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

// Массив правил валидации авторизации
export const loginValidation = [
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Пароль не может быть короче 5 символов").isLength({
		min: 5,
	}),
];

// Массив правил валидации создания статей
export const postCreateValidation = [
	body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
	body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
	body("tags", "Неверный формат тэгов (укажите массив)").optional().isString(),
	body("imagesUrl", "Неверная ссылка на изображение").optional().isString(),
];
