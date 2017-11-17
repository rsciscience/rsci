const express = require('express')

const output = {
    app: express(),
    state: {discoveryList: []}
}

output.app.get('/', (req, res) => res.send('Hello World!'))

output.app.get('/discovery', (req, res) => {
    res.send(JSON.stringify( {id: 2, title: 'Im a client', initTimeStamp: output.state.initTimeStamp }));
});

output.app.get('/discovery/list', (req, res) => {
    res.send(JSON.stringify(state.discoveryList));
});

output.init = function(port, initTimeStamp) {
    this.state.initTimeStamp = initTimeStamp;
    this.app.listen(3000, () => console.log('Example app listening on port 3000!'));
}.bind(output);

output.setProps = function(props) {
    this.state.discoveryList = this.props.discoveryList;
    
};

module.exports = output;
