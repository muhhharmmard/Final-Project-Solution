import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('dataAccess-todo')

// TODO: Implement the dataLayer logic
export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) { }

    getAllTodos = async (userId: string): Promise<TodoItem[]> => {
        logger.log('info', 'Get todos for user: '.concat(userId))
        let todos: TodoItem[]
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        todos = result.Items as TodoItem[]
        return todos
    }

    createTodo = async (todo: TodoItem): Promise<TodoItem> => {
        logger.log('info', 'Create todo: '.concat(JSON.stringify(todo)))
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()
        return todo
    }

    updateTodo = async (userId: string, todoId: string, updateTodo: UpdateTodoRequest): Promise<void> => {
        logger.log('info', 'Update todo: '.concat(JSON.stringify({ ...updateTodo, userId, todoId })))
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #name=:name, dueDate=:dueDate, done=:done",
            ExpressionAttributeValues: {
                ":name": updateTodo.name,
                ":dueDate": updateTodo.dueDate,
                ":done": updateTodo.done
            },
            ExpressionAttributeNames: {
                "#name": "name"
            }
        }).promise()
    }

    deleteTodo = async (userId: string, todoId: string): Promise<void> => {
        logger.log('info', 'Delete todo: '.concat(todoId))
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            }
        }).promise()
    }

}