import { Fragment } from "react";
import Login from "../components/login/Login";
import { withIronSessionSsr } from "iron-session/next";

const LoginPage = (props) => {
  return (
    <Fragment>
      <Login />
    </Fragment>
  );
};

export default LoginPage;

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (user) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    return {
      props: { user: user ? user : null },
    };
  },
  (req, res) => {
    return {
      cookieName: process.env.COOKIES,
      password: process.env.COOKIES_PASSWORD,
      cookieOptions: {
        secure: process.env.ENVIRONMENT === "production",
      },
    };
  }
);
