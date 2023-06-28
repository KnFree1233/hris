import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const item = req.body.item;

    if (parseInt(item.posisiBaruId) === 0) {
      res
        .status(400)
        .json({ message: "Posisi baru belum dipilih!", status: 0 });
      return;
    }

    try {
      const promosi = await sequelize.models.promosi.findByPk(item.id);

      const posisi = await sequelize.models.posisi.findByPk(item.posisiBaruId);

      const karyawan = await sequelize.models.karyawan.findByPk(
        item.karyawanNik,
        {
          include: "nilaiKaryawan",
        }
      );

      if (item.status === -1) {
        karyawan.status = false;
        await karyawan.save();
        await promosi.destroy();
      } else {
        karyawan.posisiId = item.posisiBaruId;
        if (item.status === 1) karyawan.gaji = posisi.gajiDasar;
        karyawan.nilaiKaryawan.point = 0;
        await karyawan.save();
        await karyawan.nilaiKaryawan.save();

        promosi.finalize = true;
        await promosi.save();
      }
    } catch (error) {
      res.status(500).json({ message: error.message, status: 0 });
      return;
    }
    res.status(200).json({ message: "Berhasil update data!", status: 1 });
  }
}
