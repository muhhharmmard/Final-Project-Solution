import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'


import { getAllTodos } from '../../businessLogic/todos'
import { getToken } from '../../auth/utils'

// TODO: Get all TODO items for a current user
export const handler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
   
    const jwtToken: string = getToken(event.headers.Authorization)

    if (!jwtToken){
      return {
        statusCode: 500,
        body: "Error Permission denied"
      }
    }
    const todos = await getAllTodos(jwtToken)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: todos
      })
    }
  }


