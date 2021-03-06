import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import {  decode, verify } from 'jsonwebtoken' 
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import Axios from 'axios'

const logger = createLogger('auth0')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = process.env.AUTH0_URL // env  var AUTH0_URL

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)

  logger.info(`cert url: ${jwksUrl}`)

  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  logger.info(`Decoded JWT: ${jwt}`)

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  const cert = await getCert()

  return verify(token,cert, {algorithms: ['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) {
    throw new Error('Missing authentication header')
  }
   

  if (!authHeader.toLowerCase().startsWith('bearer ')){
    throw new Error('Invalid authentication header')
  }
    
  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function getCert() {
  logger.info(`fetching the certs for validate the JWT`)

  const response = await Axios.get(jwksUrl)
  
  const [ keys ] = response.data

  if(!keys){
    throw new Error("JWKS not found")
  }

  const validKeys = keys.filter( key => key.alg === 'RS256' && key.kty === 'RSA' && key.use === 'sig')

 if(!validKeys){
    throw new Error(" Invalid JWKS")
  }

  const extractedCrt = validKeys[0].x5c[0]
  const cert = `-----BEGIN CERTIFICATE-----\n${extractedCrt}\n-----END CERTIFICATE-----\n`
  
  return cert

}
