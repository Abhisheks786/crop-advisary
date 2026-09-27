const convertToHectares = (value, unit) => {
  const v = parseFloat(value);
  switch (unit.toLowerCase()) {
    case 'acres':
    case 'acre':
      return v / 2.47105;
    case 'hectares':
    case 'hectare':
      return v;
    case 'sqmeters':
    case 'sqmeter':
      return v / 10000;
    default:
      return v;
  }
};

const convertToAcres = (value, unit) => {
  const v = parseFloat(value);
  switch (unit.toLowerCase()) {
    case 'hectares':
    case 'hectare':
      return v * 2.47105;
    case 'acres':
    case 'acre':
      return v;
    case 'sqmeters':
    case 'sqmeter':
      return v / 4046.86;
    default:
      return v;
  }
};

const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const calculateWaterInLiters = (mm, areaSqMeters) => {
  return mm * areaSqMeters;
};

const getSeasonFromMonth = (month) => {
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 11 || month <= 3) return 'Rabi';
  if (month >= 4 && month <= 5) return 'Zaid';
  return 'All Season';
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const roundToDecimal = (value, decimals) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

module.exports = {
  convertToHectares,
  convertToAcres,
  formatCurrency,
  calculateWaterInLiters,
  getSeasonFromMonth,
  generateId,
  clamp,
  roundToDecimal
};
