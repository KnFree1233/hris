import { getSequelize } from "@/helpers/sequelize";
import dayjs from "dayjs";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    if (req.body.checkIn) {
      const currDate = dayjs(new Date());
      const time = currDate.format("HH:mm:ss");
      const day = currDate.format("D");
      const month = currDate.format("M");
      const year = currDate.format("YYYY");

      const KehadiranTahun = sequelize.models.kehadiranTahun;
      const KehadiranBulan = sequelize.models.kehadiranBulan;
      const KehadiranHari = sequelize.models.kehadiranHari;

      try {
        const [kehadiranTahun, createdTahun] =
          await KehadiranTahun.findOrCreate({
            where: {
              karyawanNik: req.body.nik,
              tahun: year,
            },
          });

        const [kehadiranBulan, createdBulan] =
          await KehadiranBulan.findOrCreate({
            where: {
              bulan: month,
              kehadiranTahunId: kehadiranTahun.id,
            },
          });

        await KehadiranHari.create({
          hari: day,
          checkIn: time,
          kehadiranBulanId: kehadiranBulan.id,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Gagal melakukan check-in", status: 0 });
        return;
      }

      res.status(200).json({ message: "Berhasil Check In", status: 1 });
      return;
    } else if (req.body.checkOut) {
      const currDate = dayjs();
      const checkoutTime = dayjs("17:00:00", "HH:mm:ss");
      const time = currDate.format("HH:mm:ss");

      if (currDate < checkoutTime) {
        res
          .status(200)
          .json({ message: "Check out harus setelah pukul 17", status: 0 });
        return;
      } else {
        const day = currDate.format("D");
        const month = currDate.format("M");
        const year = currDate.format("YYYY");

        const KehadiranTahun = sequelize.models.kehadiranTahun;
        const KehadiranBulan = sequelize.models.kehadiranBulan;
        const KehadiranHari = sequelize.models.kehadiranHari;

        const kehadiranTahun = await KehadiranTahun.findOne({
          where: {
            karyawanNik: req.body.nik,
            tahun: year,
          },
        });

        const kehadiranBulan = await KehadiranBulan.findOne({
          where: {
            kehadiranTahunId: kehadiranTahun.id,
            bulan: month,
          },
        });

        const kehadiranHari = await KehadiranHari.findOne({
          where: {
            kehadiranBulanId: kehadiranBulan.id,
            hari: day,
          },
        });

        kehadiranHari.checkOut = time;

        const checkinValue = dayjs(kehadiranHari.checkIn, "HH:mm:ss");
        const checkoutValue = dayjs(kehadiranHari.checkOut, "HH:mm:ss");
        const result = checkoutValue.diff(checkinValue, "h");

        // dayjs(kehadiranHari.checkIn, "HH:mm:ss") <=
        //   dayjs("09:00:00", "HH:mm:ss")
        if (result >= 8) {
          kehadiranHari.status = true;
          kehadiranBulan.totalKehadiran += 1;
          await kehadiranBulan.save();
          kehadiranTahun.totalKehadiran += 1;
          await kehadiranTahun.save();
        } else {
          kehadiranBulan.totalAbsen += 1;
          await kehadiranBulan.save();
          kehadiranTahun.totalAbsen += 1;
          await kehadiranTahun.save();
        }

        await kehadiranHari.save();

        res.status(200).json({ message: "Berhasil Check Out", status: 1 });
      }
    }
  }
}
