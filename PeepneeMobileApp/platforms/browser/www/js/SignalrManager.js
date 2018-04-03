class SignalrManager {
  constructor(userIdentifier) {
    this.userId = userIdentifier;
    this.hubUrlAddress = 'http://likkleapi-staging.azurewebsites.net/signalr';
    this.hubName = 'BoongalooGroupsActivityHub';

    this.Initialize();
  }

  // Event handlers
  GroupWasLeftByUser(leftGroupId){
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

    var message = '[' + time + '] ' + 'Id of the left group:' + leftGroupId
    console.log(message);

    <!--Obviously, local push notifications can be fired after a SignalR event. Even if in background-->
    // PushNotification('Group was left by user', message)
  }

  Initialize(){
    var connection = $.hubConnection(this.hubUrlAddress, {useDefaultPath: false});
    this.boongalooGroupsActivityHub = connection.createHubProxy(this.hubName);

    this.boongalooGroupsActivityHub.on('GroupWasLeftByUser', this.GroupWasLeftByUser);

    connection.qs = { 'userId' : this.userId };
    connection.start()
				.done(function(){ console.log('Now connected, connection ID=' + connection.id); })
				.fail(function(){ console.log('Could not connect'); });
  }
}
