import { sequelize } from "@/helpers/sequelize";
import { Op } from "sequelize";

export default async function handler(req, res) {

  if (req.method === "GET") {
    const Karyawan = sequelize.models.karyawan;
    const Promosi = sequelize.models.promosi;

    const approvals = await Promosi.findAll({
      where: {
        [Op.and]: [
          {
            status: {
              [Op.ne]: 0,
            },
          },
          {
            finalize: false,
          },
        ],
      },
      include: [
        {
          model: Karyawan,
          include: "posisi",
        },
      ],
    });

    res.status(200).json(approvals);
  }
}
