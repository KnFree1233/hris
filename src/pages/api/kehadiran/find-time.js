import { getSequelize } from "@/helpers/sequelize";
import dayjs from "dayjs";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const KehadiranTahun = sequelize.models.kehadiranTahun;

    const currDate = dayjs(new Date());
    const year = currDate.format("YYYY");
    const kehadiranTahun = await KehadiranTahun.findOne({
      where: {
        karyawanNik: req.body.nik,
        tahun: year,
      },
    });

    if (!kehadiranTahun) res.status(200).json({ time: "" });
    else {
      const KehadiranBulan = sequelize.models.kehadiranBulan;

      const month = currDate.format("M");
      const kehadiranBulan = await KehadiranBulan.findOne({
        where: {
          bulan: month,
          kehadiranTahunId: kehadiranTahun.id,
        },
      });

      if (!kehadiranBulan) res.status(200).json({ time: "" });
      else {
        const KehadiranHari = sequelize.models.kehadiranHari;

        const day = currDate.format("D");
        const kehadiranHari = await KehadiranHari.findOne({
          where: {
            hari: day,
            kehadiranBulanId: kehadiranBulan.id,
          },
        });

        if (!kehadiranHari) res.status(200).json({ time: "" });
        else if (req.body.time === "checkin")
          res.status(200).json({ time: kehadiranHari.checkIn });
        else if (req.body.time === "checkout")
          res.status(200).json({ time: kehadiranHari.checkOut });
      }
    }
  }
}
