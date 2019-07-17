const aidbox = require('aidbox')

const init_context = {
  debug: process.env.APP_DEBUG,
  env: {
    init_url: process.env.APP_INIT_URL,
    init_client_id: process.env.APP_INIT_CLIENT_ID,
    init_client_secret: process.env.APP_INIT_CLIENT_SECRET,

    app_id: process.env.APP_ID,
    app_url: process.env.APP_HOST,
    app_port: process.env.APP_PORT,
    app_secret: process.env.APP_SECRET
  },
}

async function prepareClientPolicy(context) {
  console.log('prepare access policy && ui client');
  await context.request({
      url: '/',
      method: 'post',
      body: {
        resourceType: 'Bundle',
        type: 'Transaction',
        entry: [
          {
            resource: {
              auth: {
                authorization_code: {
                  redirect_uri: `${process.env.APP_URL}/login`
                }
              },
              secret: process.env.APP_SECRET,
              first_party: true,
              grant_types: ['authorization_code'],
              id: process.env.APP_INIT_CLIENT_ID,
              resourceType: 'Client'
            },
            request: {
              method: 'PUT',
              url: `/Client/${process.env.APP_CLIENT_ID}`
            }
          },
          {
            resource: {
              link: [{
                id: process.env.APP_CLIENT_ID,
                resourceType: 'Client'
              }],
              engine: 'allow',
              id: `allow-${process.env.APP_CLIENT_ID}`,
              resourceType: 'AccessPolicy'
            },
            request: {
              method: 'PUT',
              url: `/AccessPolicy/allow-${process.env.APP_CLIENT_ID}`
            }
          }
        ]
      }
    });
}

async function start() {
  console.log('try to register aidbox app', process.env.APP_INIT_URL);
  let ctx = null;
  try {
    ctx = await aidbox(init_context);
    console.log('aidbox app was registered');
    await prepareClientPolicy(ctx);
    console.log('App was started');
  } catch (err) {
    console.log('Error:', err);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

start();
