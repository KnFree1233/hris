import { sequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const NilaiKaryawan = sequelize.models.nilaiKaryawan;
    const NilaiKpi = sequelize.models.nilaiKpi;

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

        let totalNilai = 0;

        if (karyawanList) {
          karyawanList.map((item) => {
            if(item.nilaiKaryawan){
              item.nilaiKaryawan.nilaiKpi.map((nilai) => {
                totalNilai += nilai.totalNilai;
              });
            }
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
