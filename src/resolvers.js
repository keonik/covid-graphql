module.exports = {
  Query: {
    counties: (_, __, { dataSources }) => dataSources.covidApi.getAllCounties(),
    county: (_, { fips }, { dataSources }) => dataSources.covidApi.getCounty(fips),
    states: (_, __, { dataSources }) => dataSources.covidApi.getAllStates(),
    state: (_, { stateCode }, { dataSources }) => dataSources.covidApi.getState(stateCode),
  },
};
