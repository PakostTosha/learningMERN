import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";
import User from "./models/User.js";

// Подключение к БД в облаке mongoDB и сообщение статуса подключения
mongoose
	.connect(
		"mongodb+srv://polyakovaa03:Chubrikazimov2003!@cluster0.gyqlk.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => console.log("DB OK"))
	.catch((err) => console.log("DB error,", err));

// Создание express приложения
const app = express();
// Заставляем приложение использовать JSON для обмена данными
app.use(express.json());

// Регистрация
app.post("/auth/register", registerValidation, async (req, res) => {
	try {
		// Валидация запроса
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		// Вытаскиваем данные из тела запроса
		const { email, password, fullName, avatarUrl } = req.body;
		// Хэшируем пароль
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		// Создаём документ (сущность пользователя)
		const doc = new UserModel({
			email,
			passwordHash: hash,
			fullName,
			avatarUrl,
		});

		// Сохраняем документ в БД и записываем результат в переменную
		const user = await doc.save();

		// Создаём JWT токен, где шифруем лишь свойство "_id" нового пользователя из mongoDB
		const token = jwt.sign(
			// Шифруем переданные данные
			{
				_id: user._id,
			},
			// Передаём ключ шифрования
			"secret123",
			// Допольнительные свойства (токен "живёт" 30 дней)
			{
				expiresIn: "30d",
			}
		);

		// Ответ JSON - новый пользователь без пароля
		const { passwordHash, ...userData } = user._doc;
		res.json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось зарегистрироваться",
		});
	}
});

// Авторизация
app.post("/auth/login", async (req, res) => {
	try {
		// Ищем пользователя по email из тела запроса
		const user = await UserModel.findOne({ email: req.body.email });
		// Если пользователь не найден, то вернуть ошибку
		// Причина ошибка (не подошёл пароль, не найден email) - не указывается
		if (!user) {
			return res.status(404).json({ message: "Не удалось авторизоваться" });
		}
		// Проверка пароля
		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		);
		if (!isValidPass) {
			return res.status(400).json({ message: "Неверный логин или пароль" });
		}
		// Пользователь нашёлся и подтвердил пароль
		// Обновляем токен, убираем пароль из ответа и возвращаем ответ
		const token = jwt.sign({ _id: user._id }, "secret123", { expiresIn: "30d" });
		const { passwordHash, ...userData } = user._doc;
		res.json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось авторизоваться",
		});
	}
});

// Информация о пользователе (передаём функцию проверки авторизации)
app.get("/auth/me", checkAuth, async (req, res) => {
	try {
		// checkAuth либо выдаст ошибку, либо добавит в req id из jwt, по которому возможно найти пользователя в БД
		const user = await User.findById(req.userId);

		// Подстраховка, если пользователь всё же не найден
		if (!user) {
			return res.status(404).json({ message: "Польнователь не найден" });
		}

		// Обновляем токен, возвращаем ответ
		const { passwordHash, ...userData } = user._doc;
		res.json(userData);
	} catch (err) {}
});

// Ставим слушатель приложение на локальный порт:4444
app.listen(4444, (error) => {
	if (error) {
		return console.log(error);
	}
	console.log("Server OK");
});
