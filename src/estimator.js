/*
const input = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'months',
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
    return Math.trunc(availableBeds - sc);
  }

  function calculateCasesForICUByRequestedTime(ibrt) {
    return Math.trunc(0.05 * ibrt);
  }

  function calculateCasesForVentilatorsByRequestedTime(ibrt) {
    return Math.trunc(0.02 * ibrt);
  }

  function calculateDollarsInFlight(ibrt) {
    const dollarsInFlight = (ibrt
    * data.region.avgDailyIncomeInUSD
    * data.region.avgDailyIncomePopulation)
    / period;

    return Math.trunc(dollarsInFlight);
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

  // challenge 03
  // -impact
  impact.casesForICUByRequestedTime = calculateCasesForICUByRequestedTime(
    impact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = calculateCasesForVentilatorsByRequestedTime(
    impact.infectionsByRequestedTime
  );
  impact.dollarsInFlight = calculateDollarsInFlight(
    impact.infectionsByRequestedTime
  );

  // -severeImpact
  severeImpact.casesForICUByRequestedTime = calculateCasesForICUByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = calculateCasesForVentilatorsByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.dollarsInFlight = calculateDollarsInFlight(
    severeImpact.infectionsByRequestedTime
  );

  return {
    data,
    impact,
    severeImpact
  };
};

// console.log(covid19ImpactEstimator(input));

// export default covid19ImpactEstimator;

module.exports = covid19ImpactEstimator;
