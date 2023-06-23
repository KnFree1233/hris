import Text from "../ui/Text";
import classes from "./Profile.module.css";

const Profile = (props) => {
  return (
    <div className={`${classes.profile} ${"row mb-4 pt-3"}`}>
      <div className="col">
        <div className="row">
          <div className="col">
            <Text label="Nama" text={props.nama} />
            <Text label="Departemen" text={props.departemen} />
            <Text label="Posisi" text={props.posisi} />
          </div>
          <div className="col">
            <Text label="Email" text={props.email} />
            <Text label="Nomor Telepon" text={props.telp} />
            <Text label="Gaji" text={"Rp" + props.gaji} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
