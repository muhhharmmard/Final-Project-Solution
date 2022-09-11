import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
       //import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getToken } from '../../auth/utils'
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    //const todoId = await todoAccess.createTodo(userId, newTodo)

    // TODO: Implement creating a new TODO item
      console.log('Create todo: ', newTodo)
   const jwtToken: string = getToken(event.headers.Authorization) 

    const todo = await createTodo(newTodo,jwtToken)
    if (!newTodo) {
      return {
        statusCode: 500, 
        body : "Please input items to add"
      }
    }
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: todo
      })
    }
  }
)
  //Not using this now
// handler.use(
//   cors({
//     credentials: true
//   })
// )
// )
