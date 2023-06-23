import { getSequelize } from "@/helpers/sequelize";

export default async function handler(req, res) {
  const sequelize = await getSequelize();

  const rating = await sequelize.models.rating.findAll();

  res.status(200).json(rating);
}
