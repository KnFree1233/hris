import { getSequelize } from "@/helpers/sequelize";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const sequelize = await getSequelize();

    let data = {};
    if (req.method === "POST") {
      if (req.body.nik === "admin" && req.body.password === "admin123") {
        data = {
          nama: "Admin",
          nik: "000000",
          departemen: {
            id: 0,
            nama: "Admin",
          },
          posisi: {
            id: 0,
            nama: "Admin",
          },
        };
      } else {
        const karyawan = await sequelize.models.karyawan.findByPk(
          req.body.nik,
          {
            include: ["departemen", "posisi"],
          }
        );

        if (karyawan === null || karyawan.password !== req.body.password) {
          res
            .status(400)
            .json({ message: "NIK atau password salah!", status: 0 });
          return;
        } else if (karyawan.status === false) {
          res
            .status(400)
            .json({
              message: "Akun anda tidak aktif, silahkan hubungi HRD",
              status: 0,
            });
          return;
        }

        data = {
          nama: karyawan.nama,
          nik: karyawan.nik,
          departemen: karyawan.departemen,
          posisi: karyawan.posisi,
        };
      }

      req.session.user = data;
      await req.session.save();

      res.status(200).json({
        message: "Login berhasil!",
        status: 1,
      });
      return;
    }
  },
  {
    cookieName: process.env.COOKIES,
    password: process.env.COOKIES_PASSWORD,
    cookieOptions: {
      secure: process.env.ENVIRONMENT === "production",
    },
  }
);
