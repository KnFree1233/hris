import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  const NilaiKaryawan = sequelize.models.nilaiKaryawan;
  const NilaiKpi = sequelize.models.nilaiKpi;

  const { count, rows: karyawanList } =
    await sequelize.models.karyawan.findAndCountAll({
      where: {
        departemenId: 1,
      },
      include: [
        {
          model: NilaiKaryawan,
          include: [
            {
              model: NilaiKpi,
              as: "nilaiKpi",
              where: {
                status: true,
              },
            },
          ],
        },
      ],
    });

  res.status(200).json(karyawanList);
}
