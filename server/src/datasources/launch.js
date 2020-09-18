const { RestDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RestDataSource {
  constructor() {
    super();
    this.baseURL = `https://api.spacexdata.com/v2/`;
  }

  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.missionPatchSmall,
        missionPatchLarge: launch.links.missionPatch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type:launch.rocket.rocket_type,
      }
    }
  }

  async getAllLaunches() {
    const response = await this.get('launches');
    //launchReducer is used to transform the returned launches into the format expected by the schema
    return Array.isArray(response) ? response.map(launch => this.launchReducer(launch)) : [];
  }
  async getLaunchById({ launchId }) {
    const response = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(response[0]);
  }

  getLaunchByIds({ launchIds }) {
    return Promise.all(launchIds.map(launchId => this.getLaunchById({ launchId })));
  }
}

module.exports = LaunchAPI;