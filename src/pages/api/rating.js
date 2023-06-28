import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "GET") {
    const rating = await sequelize.models.rating.findAll({
      order: [["id", "ASC"]],
    });

    res.status(200).json(rating);
  } else if (req.method === "PUT") {
    const ratings = req.body.ratings;

    let message = "";
    ratings.map((item) => {
      if (message !== "") return;

      if (item.kenaikanGaji < 0) {
        message = "Persentase kenaikan gaji tidak bisa negatif!";
      }
    });

    if (message !== "") {
      res.status(400).json({ message: message, status: 0 });
      return;
    }

    try {
      ratings.map(async (item) => {
        const rating = await sequelize.models.rating.findByPk(item.id);
        rating.kenaikanGaji = item.kenaikanGaji;
        rating.point = item.point;
        await rating.save();
      });
    } catch (error) {
      res.status(500).json({ message: "Gagal update data!", status: 0 });
      return;
    }
    res.status(200).json({ message: "Berhasil update data!", status: 1 });
  }
}
