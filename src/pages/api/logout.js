import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  function handler(req, res, session) {
    req.session.destroy();
    res.status(200).json({ message: "Berhasil logout!", status: 1 });
  },
  {
    cookieName: process.env.COOKIES,
    password: process.env.COOKIES_PASSWORD,
    cookieOptions: {
      secure: process.env.ENVIRONMENT === "production",
    },
  }
);
