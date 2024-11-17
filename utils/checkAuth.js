import jwt from "jsonwebtoken";

// Проверка авторизации
export default (req, res, next) => {
	// Из запроса вычленяем Bearer токен
	const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

	if (token) {
		// Если токен найден, декодировать id, добавить его в запрос и перейти к выполнению следующей функции: app.get(/auth/me)
		try {
			const decoded = jwt.verify(token, "secret123");
			req.userId = decoded._id;
			next();
		} catch (e) {
			return res.status(403).json({ message: "Нет доступа" });
		}
	} else {
		return res.status(403).json({ message: "Нет доступа" });
	}
};
