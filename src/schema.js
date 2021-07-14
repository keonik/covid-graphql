const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    counties: [County]
    county(fips: String!): County
    states: [State]
    state(stateCode: String!): State
  }

  type County {
    fips: String!
    country: String!
    state: String!
    county: String!
    population: Int!
    metrics: Metric!
    riskLevels: RiskLevel!
    actuals: Actual!
    lastUpdatedDate: String
    url: String
    metricsTimeseries: [Metric!]
    actualsTimeseries: [Actual!]
    riskLevelsTimeseries: [RiskLevel!]
  }

  type State {
    counties: [County!]
    fips: String!
    country: String!
    state: String!
    level: String!
    population: Int!
    metrics: Metric!
    riskLevels: RiskLevel!
    actuals: Actual!
    lastUpdatedDate: String
    url: String!
    metricsTimeseries: [Metric!]
    actualsTimeseries: [Actual!]
  }

  type Metric {
    testPositivityRatio: Float
    caseDensity: Float
    contactTracerCapacityRatio: Float
    infectionRate: Float
    infectionRateCI90: Float
    icuHeadroomRatio: Float
    icuHeadroomDetails: ICUHeadroomDetails
    icuCapacityRatio: Float
    vaccinationsInitiatedRatio: Float
    vaccinationsCompletedRatio: Float
    date: String
  }

  type ICUHeadroomDetails {
    currentIcuCovid: Int
    currentIcuCovidMethod: String
    currentIcuNonCovid: Int
    currentIcuNonCovidMethod: String
  }

  type RiskLevel {
    overall: Int
    testPositivityRatio: Float
    caseDensity: Float
    contactTracerCapacityRatio: Float
    infectionRate: Float
    icuHeadroomRatio: Float
    icuCapacityRatio: Float
  }

  type Actual {
    cases: Int
    deaths: Int
    positiveTests: Int
    negativeTests: Int
    contactTracers: Float
    hospitalBeds: HospitalBed
    icuBeds: ICUBed
    newCases: Int
    newDeaths: Int
    vaccinesDistributed: Int
    vaccinationsInitiated: Int
    vaccinationsCompleted: Int
    vaccinesAdministered: Int
    date: String
  }

  type HospitalBed {
    capacity: Int
    currentUsageTotal: Int
    currentUsageCovid: Int
    typicalUsageRate: Float
  }

  type ICUBed {
    capacity: Int
    currentUsageTotal: Int
    currentUsageCovid: Int
    typicalUsageRate: Float
  }
`;

module.exports = typeDefs;
