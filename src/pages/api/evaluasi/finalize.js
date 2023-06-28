import { rekomendasi } from "@/helpers/getRekomendasi";
import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const karyawan = req.body.karyawan;

    let message = "";
    let count = 0;
    karyawan.map((item) => {
      if (message !== "") return;

      if (item.nilaiKaryawan.nilaiKpi.length === 0)
        message = "Semua karyawan belum dievaluasi!";
      else if (item.nilaiKaryawan.nilaiKpi[0].status === true) count++;
    });

    if (message !== "") {
      res.status(200).json({ message: message, status: 0 });
      return;
    }
    if (count === karyawan.length) {
      res
        .status(200)
        .json({ message: "Evaluasi karyawan sudah final!", status: 0 });
    }

    try {
      karyawan.map(async (item) => {
        const currKaryawan = await sequelize.models.karyawan.findByPk(
          item.nik,
          {
            include: ["nilaiKaryawan", "posisi"],
          }
        );
        const currNilaiKpi = await sequelize.models.nilaiKpi.findByPk(
          item.nilaiKaryawan.nilaiKpi[0].id,
          {
            include: "rating",
          }
        );

        if (currNilaiKpi.status === false) {
          currKaryawan.gaji +=
            (currKaryawan.gaji * currNilaiKpi.rating.kenaikanGaji) / 100;
          currKaryawan.nilaiKaryawan.point += currNilaiKpi.rating.point;
        }

        const promosi = rekomendasi(currKaryawan.nilaiKaryawan.point);

        const [currPromosi, _] = await sequelize.models.promosi.findOrCreate({
          where: {
            karyawanNik: currKaryawan.nik,
          },
        });
        if (item.posisi.id === 5 && promosi.status === 1) {
          currPromosi.message = "";
          currPromosi.status = 0;
        } else {
          currPromosi.message = promosi.message;
          currPromosi.status = promosi.status;
        }
        currPromosi.finalize = false;
        await currPromosi.save();

        currNilaiKpi.status = true;

        await currKaryawan.nilaiKaryawan.save();
        await currNilaiKpi.save();
        await currKaryawan.save();
      });
    } catch (error) {
      res.status(500).json({ message: "Gagal finalize evaluasi!", status: 0 });
      return;
    }
    res.status(200).json({ message: "Berhasil finalize evaluasi!", status: 1 });
  }
}
