
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


const covid19ImpactEstimator = (data) => {
  // variables & objects defintions/declarations
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = data;

  const impact = {};
  const severeImpact = {};

  const availableBeds = 0.35 * totalHospitalBeds;

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
    return Math.ceil(availableBeds - sc);
  }

  // make estimations
  // challenge 01
  // -impact
  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
    impact.currentlyInfected
  );

  // -severeImpact
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
    severeImpact.currentlyInfected
  );

  // challenge 02
  // -impact
  impact.severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(
    impact.infectionsByRequestedTime
  );
  impact.hospitalBedsByRequestedTime = calculateHospitalBedsByRequiredTime(
    impact.severeCasesByRequestedTime
  );

  // -severeImpact
  severeImpact.severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = calculateHospitalBedsByRequiredTime(
    severeImpact.severeCasesByRequestedTime
  );

  return {
    data,
    impact,
    severeImpact
  };
};

console.log(covid19ImpactEstimator(input));

// export default covid19ImpactEstimator;
