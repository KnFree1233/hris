import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const kpi = await sequelize.models.kpi.findOne({
      where: {
        tahun: req.body.tahun,
        departemenId: req.body.departemenId,
      },
      include: "kpiIndikator",
    });

    res.status(200).json(kpi);
  }
}
