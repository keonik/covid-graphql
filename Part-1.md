1. npm init -y
2. touch src/index.js
3. add a `hello world` log
   ```js
   console.log("hello world");
   ```
4. open package.json and add dev script
   ```json
       "dev": "nodemon src/index.js --watch src/",
       "start": "node src/index.js"
   ```
5. run in terminal `npm run dev` and inspect
   ```bash
       hello world
   ```
6. install dependencies

   ```bash
   npm install apollo-server apollo-datasource-rest dotenv
   ```

   - apollo-server
   - apollo-datasource-rest
   - dotenv
   - nodemon

7. create schema with default hello world example

   ```bash
   touch src/schema.js
   ```

   ```js
   const { gql } = require("apollo-server");

   const typeDefs = gql`
     type Query {
       hello: String
     }
   `;

   module.exports = typeDefs;
   ```

8. Open src/index.js and build your apollo server

   ```js
   require("dotenv").config();
   const { ApolloServer } = require("apollo-server");
   const typeDefs = require("./schema");

   const server = new ApolloServer({ typeDefs });

   server.listen(9000).then(() => {
     console.log("server running 🔥 http://localhost:9000");
   });
   ```

   Inspect at http://localhost:9000 to see your schema defined

   Notice there is no resolver return for your hello response when you query hello

9. Create resolver for the hello endpoint

   ```bash
   touch src/resolvers.js
   ```

   ```js
   module.exports = {
     Query: {
       hello: () => {
         return "hello world";
       },
     },
   };
   ```

10. Add resolver to src/index.js apollo-server declaration

    ```js
    const resolvers = require("./resolvers");

    const server = new ApolloServer({ typeDefs, resolvers });
    ```

    expected output on hello query now

    ```bash
    hello world
    ```

11. Add data source

    ```bash
    mkdir src/datasources
    touch src/datasources/CovidActNowAPI.js
    ```

    ```js
    const { RESTDataSource } = require("apollo-datasource-rest");

    class CovidActNowAPI extends RESTDataSource {
      constructor() {
        super();
        this.baseURL = "https://api.covidactnow.org/v2/";
      }
    }

    module.exports = CovidActNowAPI;
    ```

12. source api key into env file

    ```bash
    touch .env
    ```

    ```bash
    COVID_ACT_NOW=YOUR_KEY_HERE
    ```

13. Add some methods to fetch states and counties in your CovidActNowAPI class

    ```js
    async getAllStates() {
    const response = await this.get(`states.json?apiKey=${process.env.COVID_ACT_NOW}`);
    return response || [];
    }

    async getState(stateCode) {
        const response = await this.get(
        `state/${stateCode}.timeseries.json?apiKey=${process.env.COVID_ACT_NOW}`
        );
        return response;
    }

    async getAllCounties() {
        const response = await this.get(`counties.json?apiKey=${process.env.COVID_ACT_NOW}`);
        return response || [];
    }

    async getCounty(fips) {
        const response = await this.get(
        `county/${fips}.timeseries.json?apiKey=${process.env.COVID_ACT_NOW}`
        );
        return response;
    }
    ```

14. add data source to apollo-graphql server declaration in src/index.js

    ```js
    const server = new ApolloServer({
      dataSources: () => ({
        covidApi: new CovidActNowAPI(),
      }),
      typeDefs,
      resolvers,
    });
    ```

15. Update schema to reflect states and counties as queries

    ```js
    const typeDefs = gql`
      type Query {
        counties: [County]
        county(fips: String!): County
        states: [State]
        state(stateCode: String!): State
      }

      type County {
        fips: String
        country: String
        state: String
        county: String
        population: Int
        metrics: Metric
        riskLevels: RiskLevel
        actuals: Actual
        lastUpdatedDate: String
        url: String
        metricsTimeseries: [Metric]
        actualsTimeseries: [Actual]
        riskLevelsTimeseries: [RiskLevel]
      }

      type State {
        fips: String
        country: String
        state: String
        population: Int
        metrics: Metric
        riskLevels: RiskLevel
        actuals: Actual
        lastUpdatedDate: String
        url: String
        metricsTimeseries: [Metric]
        actualsTimeseries: [Actual]
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
        date: String
      }

      type ICUHeadroomDetails {
        currentIcuCovid: Int
        currentIcuCovidMethod: String
        currentIcuNonCovid: Int
        currentIcuNonCovidMethod: String
        icuCapacityRatio: Float
      }

      type RiskLevel {
        overall: Int
        testPositivityRatio: Float
        caseDensity: Float
        contactTracerCapacityRatio: Float
        infectionRate: Float
        icuHeadroomRatio: Float
        icuCapacityRatio: Float
        date: String
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
    ```

16. Update resolvers to resolve correctly in src/resolvers.js

    ```js
    Query: {
    counties: (_, __, { dataSources }) => dataSources.covidApi.getAllCounties(),
    county: (_, { fips }, { dataSources }) => dataSources.covidApi.getCounty(fips),
    states: (_, __, { dataSources }) => dataSources.covidApi.getAllStates(),
    state: (_, { stateCode }, { dataSources }) => dataSources.covidApi.getState(stateCode),
    },
    ```
