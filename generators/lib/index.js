/** This package contains functions used by generators */

export class DataProcessor {
  static filterDatabaseName(databaseName) {
    let filteredDatabaseName = null

    if (databaseName) {
      const isSupported = [
        'mysql',
        'mariadb',
        'postgresql',
        'mongodb',
      ].includes(databaseName)

      if (!isSupported) {
        throw new Error(`The database ${databaseName} is not supported`)
      }

      filteredDatabaseName = databaseName
    }

    return filteredDatabaseName
  }
}
