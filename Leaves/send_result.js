// Fonction qui permet de traiter le resultat recuperer avec la requête pour pouvoir envoyer le résultats

var sendResult = function (result, ignoreLeave) {
  var res = {};

  res.list = [];
  res.zapierLimitSize = 25;
  if (input && input.validDepartment !== undefined) {
    res.validDepartmentList = input.validDepartment.split(',');
  }

  res.channelExist = function (channelName) {
    for (index in this.list) {
      if (channelName && this.list[index].channel && channelName === this.list[index].channel) {
        return true;
      }
    }
    return false;
  }

  res.channelAdd = function (channelName) {
    var tmpChannelName = channelName.toLocaleLowerCase();

    if (channelName && this.list.length < this.zapierLimitSize && !this.channelExist(tmpChannelName)) {
      var newElem = {};
      newElem.channel = tmpChannelName;
      newElem.message = '';

      this.list.push(newElem);
    }
  }

  res.listAddMessage = function (channelName, message) {
    if (this.list.length < this.zapierLimitSize) {
      this.channelAdd(channelName);

      for (index in this.list) {
        if (channelName && this.list[index].channel === channelName.toLocaleLowerCase()) {
          this.list[index].message += message;
          break;
        }
      }
    }
  }

  res.listAddMessageFilter = function (channelName, message) {
    if (this.validDepartmentList === undefined || this.validDepartmentList.length === 0) {
      this.listAddMessage(channelName, message);
    }
    else {
      for (var index = 0; index < this.validDepartmentList; index) {
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

        res.listAddMessageFilter(result[i].departmentName, messageTmp);
      }
    }
  }

  callback(null, res.list);
}