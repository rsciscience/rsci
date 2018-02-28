 function leftPadWithZeros (number, length) {
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