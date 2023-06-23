import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    let nilaiKpi = req.body.nilaiKpi;

    let nilaiKaryawan = null;
    try {
      nilaiKaryawan = await sequelize.models.nilaiKaryawan.findByPk(
        req.body.nilaiKaryawanId
      );
    } catch (error) {
      res.status(500).json({ message: "Evaluasi Gagal disimpan", status: 0 });
    }

    try {
      let totalNilai = 0;
      nilaiKpi.nilaiIndikator.map((item) => {
        if (req.body.posisi === "Staff") {
          if (item.kpiIndikator.target === 0)
            totalNilai +=
              (item.nilai * item.kpiIndikator.persentaseStaff) / 100;
          else if (item.kpiIndikator.target > 0) {
            if (item.nilai > item.kpiIndikator.target) {
              totalNilai +=
                (item.kpiIndikator.target / item.kpiIndikator.target) *
                100 *
                (item.kpiIndikator.persentaseStaff / 100);
            } else {
              totalNilai +=
                (item.nilai / item.kpiIndikator.target) *
                100 *
                (item.kpiIndikator.persentaseStaff / 100);
            }
          }
        } else {
          if (item.kpiIndikator.target === 0)
            totalNilai +=
              (item.nilai * item.kpiIndikator.persentaseManajer) / 100;
          else if (item.kpiIndikator.target > 0) {
            if (item.nilai > item.kpiIndikator.target) {
              totalNilai +=
                (item.kpiIndikator.target / item.kpiIndikator.target) *
                100 *
                (item.kpiIndikator.persentaseManajer / 100);
            } else {
              totalNilai +=
                (item.nilai / item.kpiIndikator.target) *
                100 *
                (item.kpiIndikator.persentaseManajer / 100);
            }
          }
        }
      });

      let ratingId;
      if (totalNilai >= 90 && totalNilai <= 100) ratingId = 1;
      else if (totalNilai >= 70 && totalNilai <= 89) ratingId = 2;
      else if (totalNilai >= 60 && totalNilai <= 79) ratingId = 3;
      else if (totalNilai >= 50 && totalNilai <= 69) ratingId = 4;
      else if (totalNilai >= 0 && totalNilai <= 49) ratingId = 5;

      const currNilaiKpi = await sequelize.models.nilaiKpi.findByPk(
        nilaiKpi.id
      );

      nilaiKaryawan.totalNilai -= currNilaiKpi.totalNilai;

      currNilaiKpi.totalNilai = totalNilai;
      currNilaiKpi.ratingId = ratingId;
      currNilaiKpi.feedback = req.body.feedback;

      await currNilaiKpi.save();

      nilaiKpi.nilaiIndikator.map(async (item) => {
        const currNilaiIndikator =
          await sequelize.models.nilaiIndikator.findByPk(item.id);

        currNilaiIndikator.nilai = item.nilai;
        currNilaiIndikator.save();
      });

      nilaiKaryawan.totalNilai += totalNilai;
      await nilaiKaryawan.save();
    } catch (error) {
      res.status(500).json({ message: "Evaluasi Gagal disimpan", status: 0 });
    }
    res.status(200).json({ message: "Evaluasi berhasil disimpan", status: 1 });
  }
}
