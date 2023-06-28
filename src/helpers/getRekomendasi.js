export const rekomendasi = (value) => {
  if (value >= 6) {
    return {
      status: 1,
      message:
        "Sangat direkomendasikan untuk promosi ke posisi tingkat yang lebih tinggi",
    };
  } else if (value >= 3 && value <= 5) {
    return {
      status: 1,
      message:
        "Direkomendasikan untuk promosi ke posisi tingkat yang lebih tinggi",
    };
  } else if (value <= 2 && value >= -2) {
    return {
      status: 0,
      message: "",
    };
  } else if (value <= -3 && value >= -5) {
    return {
      status: -1,
      message:
        "Direkomendasikan untuk demosi ke posisi tingkat yang lebih rendah",
    };
  } else if (value <= -6) {
    return {
      status: -1,
      message:
        "Sangat direkomendasikan untuk demosi ke posisi tingkat yang lebih rendah",
    };
  }
};
