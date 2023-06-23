export  const ratingValue = (value) => {
  if (value >= 90 && value <= 100) return "Sangat Baik";
  else if (value >= 70 && value <= 89) return "Baik";
  else if (value >= 60 && value <= 79) return "Biasa";
  else if (value >= 50 && value <= 69) return "Buruk";
  else if (value >= 0 && value <= 49) return "Sangat Buruk";
};
