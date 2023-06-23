import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  const posisi = await sequelize.models.posisi.findAll();

  res.status(200).json(posisi);
}
