export const formatScore = (score) => {
  return typeof score === 'number' ? score.toFixed(1) : score;
};

export const formatWaterLevel = (level) => {
  if (!level) return 'Unknown';
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
};

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (typeof num !== 'number') return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const getScoreColor = (score) => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-primary';
  if (score >= 40) return 'text-warning';
  return 'text-danger';
};

export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
};

export const getRiskColor = (risk) => {
  const normalizedRisk = (risk || '').toLowerCase();
  if (normalizedRisk === 'low') return 'text-success';
  if (normalizedRisk === 'medium') return 'text-warning';
  if (normalizedRisk === 'high') return 'text-danger';
  return 'text-text-secondary';
};

export const getStatusIcon = (status) => {
  const normalizedStatus = (status || '').toLowerCase();
  if (normalizedStatus === 'completed') return 'check-circle';
  if (normalizedStatus === 'pending') return 'clock';
  if (normalizedStatus === 'failed') return 'x-circle';
  return 'help-circle';
};
