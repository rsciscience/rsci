var webApp  = require('./webApp');
console.log('Init Web server');

var discovery = require('./discovery');
console.log('Init Discovery');

var state = {
    initTimeStamp: new Date()
}
webApp.init(3000, state.initTimeStamp);

var interface = 'en0'
discovery.search(interface).then((res) => {
    console.log(res);
    //webApp.setProps({ discoveryList: res });
});



