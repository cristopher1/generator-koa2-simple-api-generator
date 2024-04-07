class DatabaseServiceConfiguration {
  #dockerImage
  #volumenMapped
  #volumen
  #databaseEnvironmentVariables

  constructor(configuration) {
    const {
      dockerImage,
      volumenMapped,
      volumen,
      databaseEnvironmentVariables,
    } = configuration
    this.#dockerImage = dockerImage
    this.#volumenMapped = volumenMapped
    this.#volumen = volumen
    this.#databaseEnvironmentVariables = databaseEnvironmentVariables
  }

  getDockerImage() {
    return this.#dockerImage
  }

  getVolumenMapped() {
    return this.#volumenMapped
  }

  getVolumen() {
    return this.#volumen
  }

  getDatabaseEnvironmentVariables() {
    return this.#databaseEnvironmentVariables
  }
}

export const mysql = new DatabaseServiceConfiguration({
  dockerImage: 'mysql',
  volumenMapped: '\n      - mysql_data:/var/lib/mysql',
  volumen: '\n  mysql_data:',
  databaseEnvironmentVariables:
    'MYSQL_ROOT_PASSWORD=admin\nMYSQL_USER=admin\nMYSQL_PASSWORD=admin\nMYSQL_DATABASE=api\n',
})

export const mariadb = new DatabaseServiceConfiguration({
  dockerImage: 'mariadb',
  volumenMapped:
    '\n      - maria_db_data:/var/lib/mysql\n      - maria_db_backup:/backup',
  volumen: '\n  maria_db_data:\n  maria_db_backup:',
  databaseEnvironmentVariables:
    'MARIADB_ROOT_PASSWORD=admin\nMARIADB_USER=admin\nMARIADB_PASSWORD=admin\nMARIADB_DATABASE=api\n',
})

export const postgresql = new DatabaseServiceConfiguration({
  dockerImage: 'postgres',
  volumenMapped: '\n      - pg_data:/var/lib/postgresql/data',
  volumen: '\n  pg_data:',
  databaseEnvironmentVariables:
    'POSTGRES_USER=admin\nPOSTGRES_PASSWORD=admin\nPOSTGRES_DB=api\n',
})

export const mongodb = new DatabaseServiceConfiguration({
  dockerImage: 'mongo',
  volumenMapped: '\n      - mongo_data:/etc/mongo',
  volumen: '\n  mongo_data:',
  databaseEnvironmentVariables:
    'MONGO_INITDB_ROOT_USERNAME=admin\nMONGO_INITDB_ROOT_PASSWORD=admin\nMONGO_INITDB_DATABASE=api\n',
})

export const databaseServiceConfigurations = {
  mysql,
  mariadb,
  postgresql,
  mongodb,
}
