import { DataTypes } from "sequelize";

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.DB_PORT,
    logging: console.log,
  }
);

// //Mapping

const Departemen = sequelize.define(
  "departemen",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "departemen",
    timestamps: false,
  }
);

const Posisi = sequelize.define(
  "posisi",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    gajiDasar: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "posisi",
    timestamps: false,
  }
);

const Karyawan = sequelize.define(
  "karyawan",
  {
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    noHP: {
      type: DataTypes.STRING,
    },
    gaji: {
      type: DataTypes.INTEGER,
    },
    departemenId: {
      type: DataTypes.BIGINT,
    },
    posisiId: {
      type: DataTypes.BIGINT,
    },
    password: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: "karyawan",
    timestamps: false,
  }
);

const Kpi = sequelize.define(
  "kpi",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Nama KPI harus diisi",
        },
      },
    },
    tahun: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    departemenId: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: "kpi",
    timestamps: false,
  }
);

const KpiIndikator = sequelize.define(
  "kpiIndikator",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    persentaseStaff: {
      type: DataTypes.INTEGER,
    },
    persentaseManajer: {
      type: DataTypes.INTEGER,
    },
    target: {
      type: DataTypes.INTEGER,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
    kpiId: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: "kpi_indikator",
    timestamps: false,
  }
);

const Rating = sequelize.define(
  "rating",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.INTEGER,
    },
    kenaikanGaji: {
      type: DataTypes.INTEGER,
    },
    point: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "rating",
    timestamps: false,
  }
);

const Promosi = sequelize.define(
  "promosi",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    karyawanNik: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    posisiBaruId: {
      type: DataTypes.BIGINT,
    },
    finalize: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: "promosi",
    timestamps: false,
  }
);

const NilaiKaryawan = sequelize.define(
  "nilaiKaryawan",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    karyawanNik: {
      type: DataTypes.STRING,
    },
    totalNilai: {
      type: DataTypes.INTEGER,
    },
    rataRata: {
      type: DataTypes.FLOAT,
    },
    ratingId: {
      type: DataTypes.BIGINT,
    },
    point: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: "nilai_karyawan",
    timestamps: false,
  }
);

const NilaiKpi = sequelize.define(
  "nilaiKpi",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    totalNilai: {
      type: DataTypes.INTEGER,
    },
    ratingId: {
      type: DataTypes.BIGINT,
    },
    nilaiKaryawanId: {
      type: DataTypes.BIGINT,
    },
    kpiId: {
      type: DataTypes.BIGINT,
    },
    feedback: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: "nilai_kpi",
    timestamps: false,
  }
);

const NilaiIndikator = sequelize.define(
  "nilaiIndikator",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    nilai: {
      type: DataTypes.INTEGER,
    },
    kpiIndikatorId: {
      type: DataTypes.BIGINT,
    },
    nilaiKpiId: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: "nilai_indikator",
    timestamps: false,
  }
);

const KehadiranTahun = sequelize.define(
  "kehadiranTahun",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    tahun: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    karyawanNik: {
      type: DataTypes.STRING,
    },
    totalKehadiran: {
      type: DataTypes.INTEGER,
    },
    totalAbsen: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "kehadiran_tahun",
    timestamps: false,
  }
);

const KehadiranBulan = sequelize.define(
  "kehadiranBulan",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    bulan: {
      type: DataTypes.INTEGER,
    },
    kehadiranTahunId: {
      type: DataTypes.BIGINT,
    },
    totalKehadiran: {
      type: DataTypes.INTEGER,
    },
    totalAbsen: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "kehadiran_bulan",
    timestamps: false,
  }
);

const kehadiranHari = sequelize.define(
  "kehadiranHari",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    hari: {
      type: DataTypes.INTEGER,
    },
    kehadiranBulanId: {
      type: DataTypes.BIGINT,
    },
    checkIn: {
      type: DataTypes.STRING,
    },
    checkOut: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: "kehadiran_hari",
    timestamps: false,
  }
);
//End of Mapping

//Relationship
Departemen.hasMany(Karyawan, {
  foreignKey: "departemenId",
  as: "karyawan",
});
Departemen.hasMany(Kpi, {
  foreignKey: "departemenId",
  as: "kpi",
});

Posisi.hasMany(Karyawan, {
  foreignKey: "posisiId",
});

Karyawan.belongsTo(Departemen);
Karyawan.belongsTo(Posisi);
Karyawan.hasOne(NilaiKaryawan, {
  foreignKey: "karyawanNik",
});
Karyawan.hasMany(KehadiranTahun, {
  foreignKey: "karyawanNik",
  as: "kehadiranTahun",
});
Karyawan.hasOne(Promosi, {
  foreignKey: "karyawanNik",
});

Kpi.hasMany(KpiIndikator, {
  foreignKey: "kpiId",
  as: "kpiIndikator",
  onDelete: "CASCADE",
});
Kpi.hasMany(NilaiKpi, {
  foreignKey: "kpiId",
  as: "nilaiKpi",
  onDelete: "CASCADE",
});
Kpi.belongsTo(Departemen);

KpiIndikator.belongsTo(Kpi);
KpiIndikator.hasMany(NilaiIndikator, {
  foreignKey: "kpiIndikatorId",
  as: "nilaiIndikator",
  onDelete: "CASCADE",
});

Rating.hasMany(NilaiKaryawan, {
  foreignKey: "ratingId",
  as: "nilaiKaryawan",
});
Rating.hasMany(NilaiKpi, {
  foreignKey: "ratingId",
  as: "nilaiKpi",
});

Promosi.belongsTo(Karyawan);

NilaiKaryawan.hasMany(NilaiKpi, {
  foreignKey: "nilaiKaryawanId",
  as: "nilaiKpi",
});
NilaiKaryawan.belongsTo(Karyawan);
NilaiKaryawan.belongsTo(Rating);

NilaiKpi.hasMany(NilaiIndikator, {
  foreignKey: "nilaiKpiId",
  as: "nilaiIndikator",
  onDelete: "CASCADE",
});
NilaiKpi.belongsTo(NilaiKaryawan);
NilaiKpi.belongsTo(Kpi);
NilaiKpi.belongsTo(Rating);

NilaiIndikator.belongsTo(NilaiKpi);
NilaiIndikator.belongsTo(KpiIndikator);

KehadiranTahun.hasMany(KehadiranBulan, {
  foreignKey: "kehadiranTahunId",
  as: "kehadiranBulan",
});
KehadiranTahun.belongsTo(Karyawan);

KehadiranBulan.hasMany(kehadiranHari, {
  foreignKey: "kehadiranBulanId",
  as: "kehadiranHari",
});
KehadiranBulan.belongsTo(KehadiranTahun);

kehadiranHari.belongsTo(KehadiranBulan);
// End of Relationship

sequelize.sync().then(() => {
  console.log("Models synchronized");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export async function getSequelize() {
  return sequelize;
}

export { sequelize };
