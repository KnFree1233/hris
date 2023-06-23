import { getSequelize } from "@/helpers/sequelize";
import { Op } from "sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  const search = req.body.search;

  const Departemen = sequelize.models.departemen;
  const Posisi = sequelize.models.posisi;
  const NilaiKaryawan = sequelize.models.nilaiKaryawan;
  const Rating = sequelize.models.rating;

  if (req.method === "POST") {
    const whereItem = {};
    whereItem[Op.or] = [
      {
        nama: {
          [Op.iLike]: "%" + search + "%",
        },
      },
      {
        nik: {
          [Op.iLike]: "%" + search + "%",
        },
      },
    ];

    if (req.body.departemenFilter > 0) {
      whereItem.departemenId = req.body.departemenFilter;
    }

    if (req.body.statusFilter > -1) {
      whereItem.status = req.body.statusFilter;
    }

    if (req.body.posisiFilter > 0) {
      whereItem.posisiId = req.body.posisiFilter;
    }

    const karyawan = await sequelize.models.karyawan.findAll({
      where: whereItem,
      include: [
        { model: Departemen },
        { model: Posisi },
        { model: NilaiKaryawan, include: "rating" },
      ],
    });
    res.status(200).json(karyawan);
  }
}
