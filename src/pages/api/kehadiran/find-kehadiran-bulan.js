import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const kehadiranBulan = await sequelize.models.kehadiranBulan.findAll({
      where: {
        kehadiranTahunId: req.body.kehadiranTahunId,
      },
    });

    res.status(200).json(kehadiranBulan);
  }
}
