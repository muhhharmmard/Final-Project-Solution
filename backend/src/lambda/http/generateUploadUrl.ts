import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { generateUploadUrl } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    
    if (!todoId) {
      return {
        statusCode: 500,
        body: "Please input item id to generate signed url"
      }
    }
    const signedUrl = await generateUploadUrl(todoId);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl: signedUrl
      })
    }
  }
  
)
// Double cors hahahahhahahahha
handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
