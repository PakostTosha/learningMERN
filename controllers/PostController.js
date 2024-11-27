import PostModel from "../models/Post.js";

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось создать статью",
		});
	}
};

export const getAll = async (req, res) => {
	try {
		// populate - объединяет найденные данные статей по свойству "user"
		// И в значение "user": помещает данные ["id", "fullname," "avatarUrl"]
		const posts = await PostModel.find()
			.populate("user", ["fullName", "avatarUrl"])
			.exec();

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось получить статьи",
		});
	}
};

export const getOne = async (req, res) => {
	try {
		// Вытаскиваем id из параметров запроса
		const postId = req.params.id;

		// При просмотре статей необходимо увеличивать количество просмотров
		// В старой версии передавалась callback функция, в новой - возвращает promise/query
		await PostModel.findByIdAndUpdate(
			// По какому параметру вести поиск
			{
				_id: postId,
			},
			// Что необходимо сделать при обновлении
			{
				// Увеличить поле на 1
				$inc: { viewsCount: 1 },
			},
			// Статью необходимо вернуть после обновления
			{
				returnDocument: "after",
			}
		)
			.then((doc) => {
				if (!doc) {
					return res.status(400).json({ message: "Статья не найдена" });
				}
				res.json(doc);
			})
			.catch((err) =>
				res.status(500).json({ message: "Не удалось получить статью", error: err })
			);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось получить статью",
		});
	}
};

export const remove = async (req, res) => {
	try {
		// Получаем id из тела запроса
		const postId = req.params.id;

		// Находим и удаляем по id
		await PostModel.findByIdAndDelete(postId)
			.then((doc) => {
				if (!doc) {
					return res.status(400).json({ message: "Статья не найдена" });
				}
				res.json({ success: true });
			})
			.catch((err) =>
				res.status(500).json({ message: "Статья не найдена", error: err })
			);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось удалить статью",
		});
	}
};

export const update = async (req, res) => {
	try {
		// Получить id
		const postId = req.param.id;
		// Изменить поля вытащенной статьи и сохранить
		await PostModel.updateOne(postId, {
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		});
		res.json({ success: true });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось обновить статью",
		});
	}
};
