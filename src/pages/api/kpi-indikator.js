import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "PATCH") {
    try {
      const kpiIndikator = await sequelize.models.kpiIndikator.findByPk(
        req.body.id
      );
      await kpiIndikator.destroy();
    } catch (error) {
      res.status(500).json({ message: "indikator Gagal dihapus", status: 0 });
    }

    res.status(200).json({ message: "Indikator berhasil dihapus", status: 1 });
  }
}
