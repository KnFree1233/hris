import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "GET") {
    const kpi = await sequelize.models.kpi.findAll({
      include: ["kpiIndikator", "departemen"],
    });

    res.status(200).json(kpi);
  } else if (req.method === "POST") {
    if (req.body.kpi === "") {
      res.status(400).json({ message: "Nama performa indikator harus diisi!" });
      return;
    }

    let totalPersenStaff = 0;
    let totalPersenManajer = 0;
    let message = "";

    req.body.indikatorArray.map((item) => {
      if (message !== "") {
        return;
      }

      totalPersenStaff += +item.persentaseStaff;
      totalPersenManajer += +item.persentaseManajer;

      if (totalPersenStaff > 100) message = "Total persentase staff harus 100%";
      if (totalPersenManajer > 100)
        message = "Total persentase manajer harus 100%";
      if (item.persentaseStaff <= 0)
        message = "Total persentase staff harus lebih dari 0%";
      if (item.persentaseManajer <= 0)
        message = "Total persentase manajer harus lebih dari 0%";

      if (item.deskripsi === "") message = "Deskripsi harus diisi";
      if (item.target <= 0) message = "Target harus lebih besar dari 0";
      if (item.nama <= 0) message = "Nama indikator harus diisi";
    });

    if (message !== "") {
      res.status(400).json({ message: message, status: 0 });
      return;
    }
    if (totalPersenStaff !== 100) {
      res
        .status(400)
        .json({ message: "Total persentase staff harus 100%", status: 0 });
      return;
    }
    if (totalPersenManajer !== 100) {
      res
        .status(400)
        .json({ message: "Total persentase manajer harus 100%", status: 0 });
      return;
    }

    const checkKpi = await sequelize.models.kpi.findOne({
      where: {
        tahun: req.body.tahun,
        departemenId: req.body.departemenId,
      },
    });

    if (checkKpi) {
      res
        .status(400)
        .json({ message: "Performa indikator sudah ada!", status: 0 });
      return;
    }

    try {
      const kpi = await sequelize.models.kpi.create({
        nama: req.body.kpi,
        tahun: req.body.tahun,
        departemenId: req.body.departemenId,
      });
      const indikatorArray = req.body.indikatorArray.map((item) => {
        return { ...item, kpiId: kpi.id };
      });

      await sequelize.models.kpiIndikator.bulkCreate(indikatorArray);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal simpan performa indikator", status: 0 });
      return;
    }

    res
      .status(200)
      .json({ message: "Berhasil simpan performa indikator", status: 1 });
    return;
  } else if (req.method === "PUT") {
    const Kpi = sequelize.models.kpi;
    const KpiIndikator = sequelize.models.kpiIndikator;

    let kpi = {};

    try {
      kpi = await Kpi.findByPk(req.body.id);
    } catch (error) {
      res.status(500).json({ message: "Gagal update performa indikator" });
      return;
    }

    let totalPersenStaff = 0;
    let totalPersenManajer = 0;

    let indikatorArray = [];

    let message = "";

    indikatorArray = req.body.indikatorArray.map((item) => {
      if (message !== "") {
        return;
      }

      totalPersenStaff += +item.persentaseStaff;
      totalPersenManajer += +item.persentaseManajer;

      if (totalPersenStaff > 100) message = "Total persentase staff harus 100%";
      if (totalPersenManajer > 100)
        message = "Total persentase manajer harus 100%";
      if (item.persentaseStaff <= 0)
        message = "Total persentase staff harus lebih dari 0%";
      if (item.persentaseManajer <= 0)
        message = "Total persentase manajer harus lebih dari 0%";

      if (item.deskripsi === "") message = "Deskripsi harus diisi";
      if (item.target <= 0) message = "Target harus lebih besar dari 0";
      if (item.nama <= 0) message = "Nama indikator harus diisi";

      if (message === "") {
        return { ...item, kpiId: kpi.id };
      }
    });

    if (message !== "") {
      res.status(400).json({ message: message, status: 0 });
      return;
    }

    req.body.kpiIndikator.map((item) => {
      if (message !== "") {
        return;
      }

      totalPersenStaff += +item.persentaseStaff;
      totalPersenManajer += +item.persentaseManajer;

      if (totalPersenStaff > 100) message = "Total persentase staff harus 100%";
      if (totalPersenManajer > 100)
        message = "Total persentase manajer harus 100%";
      if (item.persentaseStaff <= 0)
        message = "Total persentase staff harus lebih dari 0%";
      if (item.persentaseManajer <= 0)
        message = "Total persentase manajer harus lebih dari 0%";

      if (item.deskripsi === "") message = "Deskripsi harus diisi";
      if (item.target <= 0) message = "Target harus lebih besar dari 0";
      if (item.nama <= 0) message = "Nama indikator harus diisi";
    });

    if (message !== "") {
      res.status(400).json({ message: message, status: 0 });
      return;
    }
    if (totalPersenStaff !== 100) {
      res
        .status(400)
        .json({ message: "Total persentase staff harus 100%", status: 0 });
      return;
    }
    if (totalPersenManajer !== 100) {
      res
        .status(400)
        .json({ message: "Total persentase manajer harus 100%", status: 0 });
      return;
    }

    try {
      kpi.nama = req.body.kpi;
      kpi.tahun = req.body.tahun;
      await kpi.save();

      req.body.kpiIndikator.map(async (item) => {
        const kpiIndikator = await KpiIndikator.findByPk(item.id);
        kpiIndikator.nama = item.nama;
        kpiIndikator.persentaseStaff = +item.persentaseStaff;
        kpiIndikator.persentaseManajer = +item.persentaseManajer;
        kpiIndikator.target = +item.target;
        await kpiIndikator.save();
      });

      KpiIndikator.bulkCreate(indikatorArray);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal update performa indikator", status: 0 });
      return;
    }

    res
      .status(200)
      .json({ message: "Berhasil update performa indikator", status: 1 });
    return;
  }

  if (req.method === "PATCH") {
    const Kpi = sequelize.models.kpi;

    try {
      const kpi = await Kpi.findByPk(req.body.id);

      await kpi.destroy();
    } catch (error) {
      res.status(500).json({ message: error.message, status: 0 });
      return;
    }

    res
      .status(200)
      .json({ message: "Berhasil hapus performa indikator", status: 1 });
    return;
  }
}
