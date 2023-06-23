import { ratingValue } from "@/helpers/getRate";
import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const NilaiKaryawan = sequelize.models.nilaiKaryawan;
    const NilaiKpi = sequelize.models.nilaiKpi;
    const NilaiIndikator = sequelize.models.nilaiIndikator;

    const nik = req.body.nik;
    const posisi = req.body.posisi;

    const karyawan = await sequelize.models.karyawan.findByPk(nik, {
      include: [
        {
          model: NilaiKaryawan,
        },
      ],
    });

    if (!karyawan) {
      res.status(200).json(null);
      return;
    }

    let nilaiKpi = await NilaiKpi.findOne({
      where: {
        nilaiKaryawanId: karyawan.nilaiKaryawan.id,
      },
      include: [
        {
          model: NilaiIndikator,
          include: "kpiIndikator",
          as: "nilaiIndikator",
        },
        "kpi",
      ],
      order: [["id", "DESC"]],
    });

    if (!nilaiKpi) {
      res.status(200).json(null);
      return;
    }

    nilaiKpi = nilaiKpi.toJSON();

    let kehadiranTahun = await sequelize.models.kehadiranTahun.findOne({
      where: {
        tahun: nilaiKpi.kpi.tahun,
      },
    });

    if (kehadiranTahun) {
      kehadiranTahun = kehadiranTahun.toJSON();
    } else if (!kehadiranTahun) {
      kehadiranTahun = { totalKehadiran: 0 };
    }

    let totalNilai = 0;
    nilaiKpi.nilaiIndikator = nilaiKpi.nilaiIndikator.map((item) => {
      let persen = 0;
      if (posisi === "Staff")
        persen = item.kpiIndikator.persentaseStaff;
      else if (posisi === "Manajer")
        persen = item.kpiIndikator.persentaseManajer;
      if (item.kpiIndikator.nama === "Kehadiran") {
        totalNilai +=
          (kehadiranTahun.totalKehadiran / item.kpiIndikator.target) *
          100 *
          (persen / 100);
        return {
          ...item,
          nilai:
            (kehadiranTahun.totalKehadiran / item.kpiIndikator.target) * 100,
        };
      } else {
        totalNilai +=
          (item.nilai / item.kpiIndikator.target) * 100 * (persen / 100);
        return {
          ...item,
          nilai: (item.nilai / item.kpiIndikator.target) * 100,
        };
      }
    });

    nilaiKpi.totalNilai = totalNilai;
    nilaiKpi["rate"] = ratingValue(totalNilai);

    res.status(200).json(nilaiKpi);
    return;
  }
}
