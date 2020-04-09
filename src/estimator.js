/*
const input = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  // periodType: 'days',
  // periodType: 'weeks',
  periodType: 'months',
  // timeToElapse: 58,
  // timeToElapse: 8.571428571,
  timeToElapse: 2,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};
*/

const covid19ImpactEstimator = (data) => {
  // variables & objects defintions/declarations
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = data;

  const estimations = {
    data,
    impact: {},
    severeImpact: {}
  };

  const availableBeds = Math.trunc(0.35 * totalHospitalBeds);

  let period = timeToElapse;

  if (periodType === 'weeks') period *= 7;
  if (periodType === 'months') period *= 30;
  const factor = Math.trunc(period / 3);

  // function definitions
  function calculateInfectionsByRequestedTime(ci) {
    return ci * (2 ** factor);
  }

  function calculateSevereCasesByRequestedTime(ibrt) {
    return 0.15 * ibrt;
  }

  function calculateHospitalBedsByRequiredTime(sc) {
    return availableBeds - sc;
  }

  // make estimations
  // challenge 01
  // -impact
  estimations.impact.currentlyInfected = reportedCases * 10;
  estimations.impact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
    estimations.impact.currentlyInfected
  );

  // -severeImpact
  estimations.severeImpact.currentlyInfected = reportedCases * 50;
  estimations.severeImpact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
    estimations.severeImpact.currentlyInfected
  );

  // challenge 02
  // -impact
  estimations.impact.severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(
    estimations.impact.infectionsByRequestedTime
  );
  estimations.impact.hospitalBedsByRequestedTime = calculateHospitalBedsByRequiredTime(
    estimations.impact.severeCasesByRequestedTime
  );

  // -severeImpact
  estimations.severeImpact.severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(
    estimations.severeImpact.infectionsByRequestedTime
  );
  estimations.severeImpact.hospitalBedsByRequestedTime = calculateHospitalBedsByRequiredTime(
    estimations.severeImpact.severeCasesByRequestedTime
  );

  // console.log(estimations);

  return estimations;
};

// covid19ImpactEstimator(input);

export default covid19ImpactEstimator;
