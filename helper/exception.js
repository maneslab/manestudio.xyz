const UserException = function(message){
  this.message=message;
  this.name="UserException";
}

UserException.prototype.toString = function (){
  return this.name + ': "' + this.message + '"';
}


const UnloginException = function(){
  this.name="UnloginException";
}

UnloginException.prototype.toString = function (){
  return "user unlogin error";
}

module.exports = {
    'UserException' : UserException,
    'UnloginException' : UnloginException
}