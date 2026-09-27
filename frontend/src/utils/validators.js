export const isValidPH = (ph) => {
  const value = parseFloat(ph);
  return !isNaN(value) && value >= 0 && value <= 14;
};

export const isValidArea = (area) => {
  const value = parseFloat(area);
  return !isNaN(value) && value > 0;
};

export const isValidTemperature = (temp) => {
  const value = parseFloat(temp);
  return !isNaN(value) && value >= -20 && value <= 60; // Reasonable agricultural range
};

export const validateStep1 = (values) => {
  const errors = {};
  if (!values.state) errors.state = 'State is required';
  if (!values.district) errors.district = 'District is required';
  return errors;
};

export const validateStep2 = (values) => {
  const errors = {};
  if (!values.area) {
    errors.area = 'Area is required';
  } else if (!isValidArea(values.area)) {
    errors.area = 'Area must be a positive number';
  }
  if (!values.landUnit) errors.landUnit = 'Land unit is required';
  if (!values.soilType) errors.soilType = 'Soil type is required';
  
  if (values.ph && !isValidPH(values.ph)) {
    errors.ph = 'pH must be between 0 and 14';
  }
  return errors;
};

export const validateStep3 = (values) => {
  const errors = {};
  if (!values.waterLevel) errors.waterLevel = 'Water availability level is required';
  if (!values.irrigationMethod) errors.irrigationMethod = 'Irrigation method is required';
  return errors;
};

export const validateStep4 = (values) => {
  const errors = {};
  if (!values.season) errors.season = 'Season is required';
  if (values.temperature && !isValidTemperature(values.temperature)) {
    errors.temperature = 'Temperature is out of reasonable range (-20 to 60)';
  }
  return errors;
};

export const validateLoginForm = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

export const validateRegisterForm = (values) => {
  const errors = validateLoginForm(values);
  if (!values.name) {
    errors.name = 'Name is required';
  }
  if (values.password && values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};
