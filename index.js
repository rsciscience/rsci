var webApp  = require('./webApp');
console.log('Init Web server');

var discovery = require('./discovery');
console.log('Init Discovery');

webApp.listen(3000, () => console.log('Example app listening on port 3000!'))


