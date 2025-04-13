exports.handler = async function(event, context) {
  console.log('Event: ', JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    },
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      requestContext: event.requestContext
    })
  };
};
