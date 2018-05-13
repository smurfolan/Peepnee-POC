class SignalrManager {
  constructor() {
    this.hubUrlAddress = 'http://likkleapi-staging.azurewebsites.net/signalr';
    this.hubName = 'PeepneeHub';

    this.Initialize();
  }

  newMailRequest(takenPictureUrl, ocrParsedText) {
    //alert(takenPictureUrl + "\n" + ocrParsedText);
    PushNotification(takenPictureUrl, ocrParsedText);
  }

  Initialize(){
    var connection = $.hubConnection(this.hubUrlAddress, {useDefaultPath: false});
    var peepneeHub = connection.createHubProxy(this.hubName);

    peepneeHub.on('newMailRequest', this.newMailRequest);

    connection.start()
				.done(function(){ 
          console.log('Now connected, connection ID=' + connection.id);

          $("#accept-message").click(function() {
            peepneeHub.invoke('mailRequestAccepted');
          });

          $("#send-again").click(function() {
            peepneeHub.invoke('repeatMailRequest');
          });

          $("#ignore-message").click(function() {
            peepneeHub.invoke('mailRequestDeclined');
          });
           
        })
        .fail(function(){ console.log('Could not connect'); });    
  }
}
