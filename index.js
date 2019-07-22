const aidbox = require('aidbox');

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
              engine: 'json-schema',
              id: `allow-all`,
              schema:
                {
                  required: ['request-method'],
                  properties: {
                    'request-method': {
                      const: 'get',
                    }
                  }
                },
              resourceType: 'AccessPolicy'
            },
            request: {
              method: 'PUT',
              url: `/AccessPolicy/allow-all`
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
