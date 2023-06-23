import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  const nilaiKaryawanId = req.body.nilaiKaryawanId;
  const kpiId = req.body.kpiId;

  const NilaiIndikator = sequelize.models.nilaiIndikator;

  const nilaiKpi = await sequelize.models.nilaiKpi.findOne({
    where: {
      nilaiKaryawanId: nilaiKaryawanId,
      kpiId: kpiId,
    },
    include: [
      {
        model: NilaiIndikator,
        include: "kpiIndikator",
        as: "nilaiIndikator",
      },
    ],
  });

  res.status(200).json(nilaiKpi);
}
