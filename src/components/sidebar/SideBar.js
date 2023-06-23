import classes from "./SideBar.module.css";
import SidebarItem from "./SidebarItem";

const SideBar = (props) => {
  return (
    <ul className={`${"container d-flex flex-column"} ${classes.sidebar}`}>
      <SidebarItem nama="Dashboard" active={props.sidebarItemActive} />
      {(props.departemen === "HRD" || props.posisi === "Admin") && (
        <SidebarItem nama="Karyawan" active={props.sidebarItemActive} />
      )}
      {(props.departemen === "HRD" || props.posisi === "Admin") && (
        <SidebarItem nama="Departemen" active={props.sidebarItemActive} />
      )}
      {(props.posisi === "Manajer" || props.posisi === "Admin") && (
        <SidebarItem nama="Evaluasi" active={props.sidebarItemActive} />
      )}
      {(props.departemen === "HRD" || props.posisi === "Admin") && (
        <SidebarItem
          nama="Performa Indikator"
          active={props.sidebarItemActive}
        />
      )}
      {(props.posisi === "Manajer" || props.posisi === "Staff") && (
        <SidebarItem nama="Evaluasiku" active={props.sidebarItemActive} />
      )}
    </ul>
  );
};

export default SideBar;
