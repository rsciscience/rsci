
function test() {
    var sess = require('./experiments/exp1979/session');
    var ses = new sess("1234567", 
      {sessionVariables:{
        duration:5000,
        timeOutDuration:1,
      }});
  
    function watch() {
      console.log(arguments);
    }
  
    ses.on('Init', watch);
    ses.on('Dispose', watch);
    ses.on('Start', watch);
    ses.on('Stop', watch);
    ses.on('Event', watch);
    ses.on('Action', watch);
  
    console.log(sess);
  
    ses.init({
      start:watch,
      emitAction:watch,
      stop:watch,
      dispose:watch
    }
    );
    ses.listen({type:"UI_onReady"});
    ses.listen({type:"Scene1TrialStartNosepoke_onclick"});
    ses.listen({type:"Scene2nosepokestim2_onclick"});
    ses.listen({type:"Scene1TrialStartNosepoke_onclick"});
    ses.listen({type:"Scene2nosepokestim3_onclick"});
  
  
  
  }
  test();