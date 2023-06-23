import { getSequelize } from "@/helpers/sequelize";
import { ratingValue } from "../../../helpers/getRate";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  if (req.method === "POST") {
    const NilaiIndikator = sequelize.models.nilaiIndikator;

    const nilaiKaryawanId = req.body.nilaiKaryawanId;
    const kpiId = req.body.kpiId;
    const nik = req.body.nik;

    let kpi = await sequelize.models.kpi.findByPk(kpiId);
    if(kpi){
      kpi = kpi.toJSON();
    }

    let kehadiranTahun = await sequelize.models.kehadiranTahun.findOne({
      where: {
        karyawanNik: nik,
        tahun: kpi ? kpi.tahun : 0,
      },
    });
    if (kehadiranTahun) {
      kehadiranTahun = kehadiranTahun.toJSON();
    } else if (!kehadiranTahun) {
      kehadiranTahun = { totalKehadiran: 0 };
    }

    let nilaiKpi = await sequelize.models.nilaiKpi.findOne({
      where: {
        nilaiKaryawanId: nilaiKaryawanId,
        kpiId: kpiId,
      },
      include: [
        {
          model: NilaiIndikator,
          include: "kpiIndikator",
          as: "nilaiIndikator",
        },
        "rating",
      ],
    });

    if (nilaiKpi) {
      nilaiKpi = nilaiKpi.toJSON();
      let totalNilai = 0;
      nilaiKpi.nilaiIndikator = nilaiKpi.nilaiIndikator.map((item) => {
        let persen = 0;
        if (req.body.posisi === "Staff")
          persen = item.kpiIndikator.persentaseStaff;
        else if (req.body.posisi === "Manajer")
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
    }

    res.status(200).json(nilaiKpi);
  }
}
