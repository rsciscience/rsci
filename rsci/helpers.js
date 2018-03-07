function leftPadWithZeros(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}


module.exports = {
  generateId: function () {
    return leftPadWithZeros(Math.floor(Math.random() * 1000000000));
  },

  printObjetStructure: function (obj) {
    function getStruct(obj, cnt) {
      var mycnt = cnt + 1;
      var output = [];
      var tab = ''
      for (var i = 0; i < cnt; i++) {
        tab = tab + ' ';
      }

      try {
        var props = Object.keys(obj);

        for (var i = 0; i < props.length; i++) {
          var p = props[i];
          var typ = typeof obj[p];
          if (Array.isArray(obj[p])) {
            typ = 'array'
          }

          if (typeof obj[p].getMonth === 'function') {
            typ = 'date'

          }
          switch (typ) {
            case 'array':
              output.push(tab + p + ': ' + typ+ '[');
              output.push(getStruct(obj[p][0], mycnt));
              output.push(tab + ']');
              break;
            case 'object':

              output.push(tab + p + ': ' + typ + '{');
              output.push(getStruct(obj[p], mycnt));
              output.push(tab + '}');

              break;
              default: 
              output.push(tab + p + ': ' + typ);
          }

        }
    }catch (e){
        return tab +"???"
     
      }
      return output.join("\r\n");
    }

    return getStruct(obj,0);

  },


  dumpJobs: function (jobs) {
    debug('FriendlyJobStatusDump');
    debug("Job Count:" + jobs.length);

    for (var i = 0, len = jobs.length; i < len; i++) {
      var job = this.state.jobs[i];
      debug("Job:" + job.id);
      debug(job.clients.length);

      for (var j = 0, lenj = job.clients.length; j < lenj; j++) {

        var client = job.clients[j];
        debug('  Client:' + client.id);
        debug(client.actions.length);

        for (var k = 0, lenk = client.actions.length - 1; k < lenk; k++) {
          var action = client.actions[k]
          debug('    ' + action.actionType);

        }
      }
    }

  }

  };