import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const kehadiranTahun = await sequelize.models.kehadiranTahun.findOne({
      where: {
        karyawanNik: req.body.karyawanNik,
        tahun: req.body.tahun,
      },
    });

    res.status(200).json(kehadiranTahun);
  }
}
