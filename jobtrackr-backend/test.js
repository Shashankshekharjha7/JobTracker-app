import('./src/server.js').catch(err => {
  console.error('Full error:', err);
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
});