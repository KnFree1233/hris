import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "GET") {
    const Departemen = sequelize.models.departemen;
    const Posisi = sequelize.models.posisi;
    const NilaiKaryawan = sequelize.models.nilaiKaryawan;

    const karyawan = await sequelize.models.karyawan.findAll({
      include: [
        { model: Departemen },
        { model: Posisi },
        { model: NilaiKaryawan, include: "rating" },
      ],
    });

    res.status(200).json(karyawan);
  } else if (req.method === "POST") {
    const nik = req.body.nik;
    const nama = req.body.nama;
    const email = req.body.email;
    const gaji = req.body.gaji;
    const noHp = req.body.noHp;
    const departemenId = req.body.departemenId;
    const posisiId = req.body.posisiId;

    if (
      nik === "" ||
      nama === "" ||
      email === "" ||
      gaji === null ||
      noHp === ""
    ) {
      res.status(400).json({ message: "Setiap field harus diisi!", status: 0 });
    } else if (gaji <= 0) {
      res
        .status(400)
        .json({ message: "Gaji harus lebih besar dari 0!", status: 0 });
    } else {
      try {
        const karyawan = await sequelize.models.karyawan.create({
          nik: nik,
          nama: nama,
          email: email,
          gaji: gaji,
          noHP: noHp,
          departemenId: departemenId,
          posisiId: posisiId,
        });

        await sequelize.models.nilaiKaryawan.create({
          karyawanNik: karyawan.nik,
        });
      } catch (error) {
        res.status(500).json({ message: error.message, status: 0 });
        return;
      }

      res.status(200).json({ message: "Data berhasil disimpan!", status: 1 });
      return;
    }
  } else if (req.method === "PUT") {
    const nik = req.body.nik;
    const nama = req.body.nama;
    const email = req.body.email;
    const gaji = req.body.gaji;
    const noHp = req.body.noHp;
    const departemenId = req.body.departemenId;
    const posisiId = req.body.posisiId;
    const status = req.body.status;

    if (
      nik === "" ||
      nama === "" ||
      email === "" ||
      gaji === null ||
      noHp === ""
    ) {
      res.status(400).json({ message: "Setiap field harus diisi!", status: 0 });
    } else if (gaji <= 0) {
      res
        .status(400)
        .json({ message: "Gaji harus lebih besar dari 0!", status: 0 });
    } else {
      try {
        const karyawan = await sequelize.models.karyawan.findByPk(nik);
        karyawan.nama = nama;
        karyawan.email = email;
        karyawan.gaji = gaji;
        karyawan.noHP = noHp;
        karyawan.departemenId = departemenId;
        karyawan.posisiId = posisiId;
        karyawan.status = status;

        await karyawan.save();
      } catch (error) {
        res.status(500).json({ message: "Gagal simpan data", status: 0 });
        return;
      }

      res.status(200).json({ message: "Data berhasil disimpan!", status: 1 });
      return;
    }
  }
}
