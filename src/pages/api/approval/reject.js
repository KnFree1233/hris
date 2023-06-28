import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const id = req.body.id;

    try {
      const promosi = await sequelize.models.promosi.findByPk(id);

      promosi.finalize = true;
      await promosi.save();
    } catch (error) {
      res.status(500).json({ message: "Gagal update data!", status: 0 });
      return;
    }
    res.status(200).json({ message: "Berhasil update data!", status: 1 });
  }
}
