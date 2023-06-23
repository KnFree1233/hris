import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "GET") {
    let departemen = await sequelize.models.departemen.findAll({
      raw: true,
    });

    if (!departemen) {
      res.status(200).json(null);
      return;
    }
    departemen = await Promise.all(
      departemen.map(async (item) => {
        const { count, rows: karyawanList } =
          await sequelize.models.karyawan.findAndCountAll({
            where: {
              departemenId: item.id,
            },
            include: ["nilaiKaryawan"],
          });

        let totalNilai = 0;

        if (karyawanList) {
          karyawanList.map((item) => {
            totalNilai += item.nilaiKaryawan.totalNilai;
          });
        }
        const rataRata = (totalNilai / count).toFixed(2);

        return {
          ...item,
          totalKaryawan: count,
          rataRata: rataRata,
          totalNilai: totalNilai,
        };
      })
    );

    res.status(200).json(departemen);
    return;
  }
}
