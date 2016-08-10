// Fonction qui permet de traiter le resultat recuperer avec la requête pour pouvoir envoyer le résultats

var sendResult = function (result, ignoreLeave) {
  var res = {};

  res.list = [];
  res.zapierLimitSize = 25;
  if (input.validDepartment) {
    res.validDepartmentList = input.validDepartment.split(',');
  }

  res.channelExist = function (channelName) {
    channelName = channelName.toLocaleLowerCase();
    for (index in this.list) {
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

      for (index in this.list) {
        if (channelName && this.list[index].channel === channelName) {
          this.list[index].message += message;
          break;
        }
      }
    }
  }

  res.listAddMessageFilter = function (channelName, message) {
    channelName = channelName.toLocaleLowerCase();
    if (this.validDepartmentList === undefined) {
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

        res.listAddMessageFilter(result[i].departmentName, messageTmp);
      }
    }
  }

  callback(null, res.list);
}