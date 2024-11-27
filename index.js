import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

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
// Сообщаем в какую папку отправляться при get запросе на получение статичного файла
app.use("/uploads", express.static("uploads"));

// Хранилище
const storage = multer.diskStorage({
	// Куда сохранять файл
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	// Как назвать файл
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

// Регистрация
app.post("/auth/register", registerValidation, UserController.register);
// Авторизация
app.post("/auth/login", loginValidation, UserController.login);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `uploads/${req.file.originalname}`,
	});
});

// Информация о пользователе (передаём функцию проверки авторизации)
app.get("/auth/me", checkAuth, UserController.getMe);

// CRUD-операции со статьями
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);

// Ставим слушатель приложение на локальный порт:4444
app.listen(4444, (error) => {
	if (error) {
		return console.log(error);
	}
	console.log("Server OK");
});
