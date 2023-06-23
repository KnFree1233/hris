import NoHighlighted from "../../styles/NoHighlighted.module.css";
import { useRouter } from "next/navigation";
import classes from "./Header.module.css";

const Header = (props) => {
  const { push } = useRouter();

  const logout = async () => {
    const response = await fetch("/api/logout");
    const data = await response.json();

    alert(data.message);

    if (data.status === 1) {
      push("/login");
    }
  };

  return (
    <nav className={`${"navbar"} ${classes.header}`}>
      <div className="container-fluid">
        <a className="navbar-brand">Human Resource Information System</a>
        <div className="dropdown">
          <div
            className={`${NoHighlighted.noselect} ${"dropdown-toggle me-5"}`}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {props.nama}
          </div>
          <ul className="dropdown-menu">
            <li>
              <a
                className="dropdown-item"
                type="button"
                onClick={() => logout()}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
