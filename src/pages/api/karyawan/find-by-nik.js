import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const NilaiKaryawan = sequelize.models.nilaiKaryawan;
    const NilaiKpi = sequelize.models.nilaiKpi;
    const NilaiIndikator = sequelize.models.nilaiIndikator;
    const Posisi = sequelize.models.posisi;
    const Departemen = sequelize.models.departemen;
    const KehadiranTahun = sequelize.models.kehadiranTahun;
    const KehadiranBulan = sequelize.models.kehadiranBulan;
    const KehadiranHari = sequelize.models.kehadiranHari;

    const karyawan = await sequelize.models.karyawan.findByPk(req.body.nik, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: NilaiKaryawan,
          attributes: {
            exclude: ["karaywanNik"],
          },
          include: [
            {
              model: NilaiKpi,
              as: "nilaiKpi",
              where: {
                status: true,
              },
              include: [
                {
                  model: NilaiIndikator,
                  include: "kpiIndikator",
                  as: "nilaiIndikator",
                  attributes: {
                    exclude: ["nilaiKpiId"],
                  },
                },
                "kpi",
              ],
            },
          ],
        },
        {
          model: KehadiranTahun,
          as: "kehadiranTahun",
        },
        {
          model: Posisi,
        },
        {
          model: Departemen,
          attributes: {
            exclude: ["id"],
          },
        },
      ],
    });

    res.status(200).json(karyawan);
  }
}
