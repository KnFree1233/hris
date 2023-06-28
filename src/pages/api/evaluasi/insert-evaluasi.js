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

    let message = "";

    try {
      let totalNilai = 0;
      const nilaiIndikator = req.body.kpiIndikator.map((item) => {
        if (message !== "") return;
        //persentase sudah disesuaikan dengan posisi sebelum masuk API
        if (item.nama !== "Kehadiran") {
          if (item.nilai > item.target) {
            message = "Nilai tidak bisa melebihi target!";
            return;
          } else if (item.nilai < 0) {
            message = "Nilai tidak bisa negatif!";
            return;
          }
        }

        if (item.target === 0)
          totalNilai += (item.nilai * item.persentase) / 100;
        else if (item.target > 0)
          if (item.nilai > item.target) {
            totalNilai +=
              (item.target / item.target) * 100 * (item.persentase / 100);
          } else {
            totalNilai +=
              (item.nilai / item.target) * 100 * (item.persentase / 100);
          }

        return { nilai: item.nilai, kpiIndikatorId: item.id };
      });

      if (message !== "") {
        res.status(400).json({ message: message, status: 0 });
        return;
      }

      let ratingId;
      if (totalNilai >= 90 && totalNilai <= 100) ratingId = 1;
      else if (totalNilai >= 70 && totalNilai <= 89) ratingId = 2;
      else if (totalNilai >= 60 && totalNilai <= 79) ratingId = 3;
      else if (totalNilai >= 50 && totalNilai <= 69) ratingId = 4;
      else if (totalNilai >= 0 && totalNilai <= 49) ratingId = 5;

      nilaiKpi = await sequelize.models.nilaiKpi.create({
        totalNilai: totalNilai,
        ratingId: ratingId,
        nilaiKaryawanId: req.body.nilaiKaryawanId,
        kpiId: req.body.kpiIndikator[0].kpiId,
        feedback: req.body.feedback,
      });

      const temp = nilaiIndikator.map((item) => {
        return { ...item, nilaiKpiId: nilaiKpi.id };
      });

      // nilaiKaryawan.totalNilai += totalNilai;
      // await nilaiKaryawan.save();

      await sequelize.models.nilaiIndikator.bulkCreate(temp);
    } catch (error) {
      res.status(500).json({ message: "Evaluasi Gagal disimpan", status: 0 });
    }

    res.status(200).json({ message: "Evaluasi berhasil disimpan", status: 1 });
  }
}
