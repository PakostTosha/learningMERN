import express from "express";
import mongoose from "mongoose";

import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

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
app.post("/auth/register", registerValidation, UserController.register);
// Авторизация
app.post("/auth/login", UserController.login);

// Информация о пользователе (передаём функцию проверки авторизации)
app.get("/auth/me", checkAuth, UserController.getMe);

// Ставим слушатель приложение на локальный порт:4444
app.listen(4444, (error) => {
	if (error) {
		return console.log(error);
	}
	console.log("Server OK");
});
