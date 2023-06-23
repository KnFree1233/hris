import SideBar from "../sidebar/SideBar";
import classes from "./Content.module.css";

const Content = (props) => {
  return (
    <div className={`${classes.content} ${"row"}`}>
      <div className="col-3 mt-5">
        <SideBar
          sidebarItemActive={props.sidebarItemActive}
          posisi={props.posisi}
          departemen={props.departemen}
        />
      </div>
      <div className="col-8 mt-5">{props.children}</div>
    </div>
  );
};

export default Content;
