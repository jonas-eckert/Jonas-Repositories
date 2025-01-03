import { calculateRiskTask } from "./operations/task/calculate-risk";
import { calculateRiskEntity } from "./operations/entity/calculate-risk";
import { calculateRiskUtility } from "./operations/utility/calculate-risk";

module.exports.eventRiskRouter = async (event) => {
  try {
    let apiPath = event.requestPath;

    //TASK SERVICES///////////////////////////////////////////////////////////////////
    if(apiPath === "/MasonGateway/task/EventRisk/v1/calculate-risk"){

      return calculateRiskTask(event);
    }

    //ENTITY SERVICES//////////////////////////////////////////////////////////////////
    if(apiPath === "/MasonGateway/entity/EventRisk/v1/calculate-risk"){

      return calculateRiskEntity(event);
    }

    //UTILITY SERVICES//////////////////////////////////////////////////////////////////
    if(apiPath === "/MasonGateway/utility/EventRisk/v1/calculate-risk"){

      return calculateRiskUtility(event)
    }
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Could not find path to call operation from handler.ts",
          input: event,
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error in handler.ts",
      errorName: error.name,
      errorMessage: error.message
    }
  }
}
