/**
 * Calculates the commission based on category, distance, day of the week, and operator.
 * 
 * @param {Object} params
 * @param {string} params.category - The booking category (e.g., "hotel", "flight", "bus")
 * @param {number} params.distance - The distance of the journey in km
 * @param {boolean} params.isWeekend - Whether the booking is for a weekend
 * @param {string} params.operator - The service operator name (e.g., "VRL")
 * @returns {number} The calculated commission value
 */
export const calculateCommission = ({
  category,
  distance,
  isWeekend,
  operator
}) => {

  let commission = 80; // base

  // category
  if (category === "hotel") commission += 50;
  if (category === "flight") commission += 30;

  // route
  if (distance < 200) commission += 20;
  if (distance > 500) commission += 50;

  // demand
  if (isWeekend) commission += 40;

  // operator
  if (operator === "VRL") commission += 30;

  return commission;
};
