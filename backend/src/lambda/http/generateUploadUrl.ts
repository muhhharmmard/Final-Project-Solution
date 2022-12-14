import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { getPresignedImageUrl } from "../../businessLogic/todo";
import { decodeJWTFromAPIGatewayEvent, parseUserId } from "../../auth/utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("todo");
import * as uuid from "uuid";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);
    const todoId = event.pathParameters.todoId;

    // TODO: Return presigned url

    const jwtToken = decodeJWTFromAPIGatewayEvent(event);

    const userId = parseUserId(jwtToken);

    const imageId = uuid.v4();

    const signedUrl: String = await getPresignedImageUrl(
      todoId,
      imageId,
      userId
    );

    logger.info("todo IMAGE URL CREATED", {
      key: todoId,
      userId: userId,
      imageId: imageId,
      date: new Date().toISOString,
    });

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
      body: JSON.stringify({ uploadUrl: signedUrl }),
    };
  }
);

handler
  .use(
    cors({
      credentials: true,
    })
  )
  .use(httpErrorHandler());