
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJHhvC4cbw0UfLMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1yLWMxeTBwcy51cy5hdXRoMC5jb20wHhcNMjEwMzIxMDAyNTE1WhcN
MzQxMTI4MDAyNTE1WjAkMSIwIAYDVQQDExlkZXYtci1jMXkwcHMudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx+twvjxKWUEnNc4t
mT2TxTC+szZo1dpSHmI7PB5epDqoPEpfuDyq/alZ2kHbg79m1xobtSMnRHLYHdLp
1AdNclKk+6hy99gFCwT/eL7CxXqWOP3V4V3xxua07ubxX/U0rz+t0QjPEPA4nnVJ
zvmhvLC0qRk3IRAUI3TwRJOb0YPnM7YABhdU8s7tY79FbRrJ7RYJRMtRrsQm9ClK
GpG6B8IOPMQJWUrd11FUqsRK3cF9DXexGNFYVSS+iD/vn2P+24wD5QQPvwJfpCbt
Eb/5/S0amQZEQeyhkW+9l2o7DBcDtTBaRHbP9utnVHRsDmp6kms7gKFepqB+wFgL
i8kSvQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSm01OSN5wO
a7G81S1+hAa2t57/4jAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AL9WUW2VNbl/ulJw/xnx1COpjTXwitMp33A0TN5PtifE8W/6+Xo7DxoA+agD+Fqi
Lu8fiTCQdwmsUzulTZ/a1e1HmZJJlqxE1xFIZwoXS5STHuKTV/WybZ12wWVhZna6
Mb+jh9wJAEc8JK5DD0mnUnoBNlqFwXqdhs9HSwy6Vj3Qqg9PclomfnwQVQFyKfWa
nn6K2w7Vn/EAkefNQco6hL676+ihIesHtdVGiN86HXNB6Hiekp0DKQtJhY0WLxz/
80wi108BqP5xYJySGwbeFpDWJxnhrIjCV54VYX01BdgJ6TDJrDg+Sgss60fube2t
RMWvDYh51foSGZzViIxvjfo=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  // return null
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User authorized: ', jwtToken)

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
    console.log('User authorized: ', e.message)

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


function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header.')

  if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(
    token,
    cert,
    {
      algorithms: ['RS256']
    }
  ) as JwtToken
}

