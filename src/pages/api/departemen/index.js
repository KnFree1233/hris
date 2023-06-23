import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "GET") {
    const departemen = await sequelize.models.departemen.findAll();

    res.status(200).json(departemen);
    return;
  } else if (req.method === "POST") {
    const nama = req.body.nama;

    if (nama === "") {
      res.status(400).json({ message: "Semua field harus diisi!", status: 0 });
      return;
    }

    try {
      await sequelize.models.departemen.create({
        nama: nama,
      });
    } catch (error) {
      res.status(500).json({ message: "Gagal simpan data!", status: 0 });
      return;
    }

    res.status(200).json({ message: "Berhasil simpan data!", status: 1 });
    return;
  } else if (req.method === "PUT") {
    const nama = req.body.nama;

    if (nama === "") {
      res.status(400).json({ message: "Semua field harus diisi!", status: 0 });
      return;
    }

    try {
      const departemen = await sequelize.models.departemen.findByPk(
        req.body.id
      );

      departemen.nama = nama;
      departemen.save();
    } catch (error) {
      res.status(500).json({ message: "Gagal simpan data!", status: 0 });
      return;
    }
    res.status(200).json({ message: "Berhasil simpan data!", status: 1 });
    return;
  } else if (req.method === "PATCH") {
    try {
      const departemen = await sequelize.models.departemen.findByPk(
        req.body.id
      );

      departemen.destroy();
    } catch (error) {
      res.status(500).json({ message: "Gagal hapus data!", status: 0 });
      return;
    }
    res.status(200).json({ message: "Berhasil hapus data!", status: 1 });
    return;
  }
}
