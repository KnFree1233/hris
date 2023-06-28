import { getSequelize } from "@/helpers/sequelize";
import dayjs from "dayjs";
import { Op } from "sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const NilaiKaryawan = sequelize.models.nilaiKaryawan;
    const NilaiKpi = sequelize.models.nilaiKpi;
    const Kpi = sequelize.models.kpi;
    const Posisi = sequelize.models.posisi;
    const Departemen = sequelize.models.departemen;
    const Rating = sequelize.models.rating;

    const whereItem = {};
    if (req.body.departemenId !== 0) {
      whereItem["nik"] = {
        [Op.ne]: req.body.nik,
      };
      whereItem["departemenId"] = req.body.departemenId;
    }
    if (req.body.departemenId === 0) {
      whereItem["posisiId"] = {
        [Op.gte]: 4,
      };
    }
    else{
      whereItem["posisiId"] = {
        [Op.lte]: 3,
      };
    }

    const karyawan = await sequelize.models.karyawan.findAll({
      where: whereItem,
      include: [
        {
          model: NilaiKaryawan,
          include: [
            {
              model: NilaiKpi,
              as: "nilaiKpi",
              include: [
                {
                  model: Kpi,
                  where: {
                    tahun: dayjs().year() - 1,
                    // departemenId: req.body.departemenId,
                  },
                },
                {
                  model: Rating,
                },
              ],
            },
          ],
        },
        {
          model: Posisi,
        },
        {
          model: Departemen,
        },
      ],
    });

    res.status(200).json(karyawan);
  }
}
