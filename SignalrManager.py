from requests import Session
from signalr import Connection

with Session() as session:
    #create a connection
    connection = Connection("http://likkleapi-staging.azurewebsites.net/signalr", session)

    #get PeepneeHub hub
    peepneeHub = connection.register_hub('PeepneeHub')

    #define message handlers
    def mailRequestAccepted():
        print('OMG! Mail was accepted.')

    def mailRequestDeclined():
        print('Hmm! Mail was declined.')

    def repeatMailRequest():
       print('What? Repeat mail request.')

    def updateDefaultOwnerSettings(openAfterDefaultTime, secondsToDefaultBehaviour):
       print("Kewl? Update settings to openAfterDefaultTime: {0} and secondsToDefaultBehaviour: {1}".format(openAfterDefaultTime, secondsToDefaultBehaviour))

    def print_error(error):
        print('error: ', error)

    peepneeHub.client.on('mailRequestAccepted', mailRequestAccepted)
    peepneeHub.client.on('mailRequestDeclined', mailRequestDeclined)
    peepneeHub.client.on('repeatMailRequest', repeatMailRequest)
    peepneeHub.client.on('updateDefaultOwnerSettings', updateDefaultOwnerSettings)

    #process errors
    connection.error += print_error

    #start a connection
    print("Connection was started")
    with connection:
		#peepneeHub.server.invoke('mailRequestAccepted')
		#peepneeHub.server.invoke('updateDefaultOwnerSettings', 0, 13)
		peepneeHub.server.invoke('newMailRequest', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnQvWejaCTkhgjydvKMD4F3xJcPxrPh5cDasXRtI7t7zxG9QQP', 'Nova smetka za plashtane ot Sofiiska voda')
		connection.wait(18)