// Fonction qui permet de traiter le resultat recuperer avec la requête pour pouvoir envoyer le résultats

var getCleanChannelName = function(channelName) {
  channelName = channelName.replace(/\s+/g, '_');
  channelName = 'absence_' + channelName.toLocaleLowerCase();
  return channelName;
}

var sendResult = function (result, ignoreLeave) {
  var res = {};

  res.list = [];
  res.zapierLimitSize = 25;
  if (input.validDepartment) {
    res.validDepartmentList = input.validDepartment.toLocaleLowerCase().split(',');
    for (var i = 0; i < res.validDepartmentList.length; i++) {
      res.validDepartmentList[i] = getCleanChannelName(res.validDepartmentList[i]);
    }
    console.log(res.validDepartmentList);
  }

  res.channelExist = function (channelName) {
    channelName = channelName.toLocaleLowerCase();
    for (var index = 0; index < this.list.length; index++) {
      if (channelName && this.list[index].channel && channelName === this.list[index].channel) {
        return true;
      }
    }
    return false;
  }

  res.channelAdd = function (channelName) {
    channelName = channelName.toLocaleLowerCase();
    if (channelName && this.list.length < this.zapierLimitSize && !this.channelExist(channelName)) {
      var newElem = {};
      newElem.channel = channelName;
      newElem.message = '';

      this.list.push(newElem);
    }
  }

  res.listAddMessage = function (channelName, message) {
    channelName = channelName.toLocaleLowerCase();
    if (this.list.length < this.zapierLimitSize) {
      this.channelAdd(channelName);

      for (var index = 0; index < this.list.length; index++) {
        if (channelName && this.list[index].channel === channelName) {
          this.list[index].message += message;
          break;
        }
      }
    }
  }

  res.listAddMessageFilter = function (channelName, message) {
    channelName = channelName.toLocaleLowerCase();
    if (this.validDepartmentList === undefined || this.validDepartmentList === "") {
      this.listAddMessage(channelName, message);
    }
    else {
      for (var index = 0; index < this.validDepartmentList.length; index++) {
        if (this.validDepartmentList[index] === channelName) {
          this.listAddMessage(channelName, message);
        }
      }
    }
  }

  if (result !== undefined) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].numberDay >= input.numberDayMinimum && !checkIsIn(ignoreLeave, result[i].name)) {
        var messageTmp = result[i].name + ' : à partir de ' + result[i].detail + '\n';
        var channelName = getCleanChannelName(result[i].departmentName)

        console.log(channelName);
        res.listAddMessageFilter(channelName, messageTmp);
      }
    }
  }

  callback(null, res.list);
} 