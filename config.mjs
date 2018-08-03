const environments = {};

environments.develop = {
  httpPort: 3000,
  httpsPort: 3000,
  envName: 'develop',
  filesStorageDirectory: '.filesStorage',
}

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  filesStorageDirectory: '.filesStorage',
}

const providedEnvironment = typeof(process.env.NODE_ENV) === 'string'
  ? process.env.NODE_ENV.toLowerCase()
  : '';
const environmentToExport = typeof(environments[providedEnvironment]) === 'object'
  ? environments[providedEnvironment]
  : environments.develop;

export default environmentToExport;

