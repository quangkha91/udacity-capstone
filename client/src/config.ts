// FASHION: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '8450isxn3d'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // FASHION: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-szcscgmneo0l8ev5.us.auth0.com',            // Auth0 domain
  clientId: 'soOvsPd0YpiLQJnt5atIU90ohciDA2fD',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
