import classes from "./SidebarItem.module.css";
import NoHighlighted from "../../styles/NoHighlighted.module.css";
import Link from "next/link";

const SidebarItem = (props) => {
  return (
    <Link
      href={
        props.nama === "Dashboard"
          ? "/"
          : "/" + props.nama.toLowerCase().replace(" ", "-")
      }
      className={classes["sidebar-item"]}
    >
      <li
        className={`${NoHighlighted.noselect} ${
          props.active === props.nama ? classes.active : ""
        }`}
        type="button"
      >
        {props.nama}
      </li>
    </Link>
  );
};

export default SidebarItem;
