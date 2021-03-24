// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getAllGroups } from '../../businessLogic/groups';
import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

const app = express()

app.get('groups', async (_req, res) => {
  // get all groups as before
  const groups = await getAllGroups()

  // return a list of groups
  res.json({
    items: groups
  })
})

// create express server
const server = awsServerlessExpress.createServer(app)
// Pass API Gateweay events to the Express server
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   console.log('Processing event: ', event)

//   const groups = await getAllGroups()

//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       items: groups
//     })
//   }
// }