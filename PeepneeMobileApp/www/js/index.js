document.addEventListener('deviceready', this.onDeviceReady, false);

var setTimer;
var sendTime;
var defaultMailboxId = "-LCn1v6jBKNlBZPM4Gg6";

function onDeviceReady(){
  invokeSignalrManager();
  cordova.plugins.notification.local.on("click", function () {
    var now = new Date().getTime();
    /* There are some cases, which we track:
        1. if the user clicks the notification on time: the user see notification page with timer and three action buttons
            1.1 if the user answers on time: the user is redirect to homepage with confirmation message for the action which is taken
            1.2 if the user doesn't answer on time: after the time expired the action buttons are replaced with homepage button
        2. if the user doesn't click the notification on time: time was expired and the user see notification page with homepage button   
    */
    
    $("#notification-page-link").trigger("click");
    if(now - sendTime <= 15000) {
        timeExpired(false, ""); // case 1
        startTimer();
    } else {
        timeExpired(true, "the time expired"); // case 2
        pushMessgeToMailbox();
    }           
  });
  getMailboxes();
}

function PushNotification(takenPictureUrl, ocrParsedText){
  $("#new-mail-request-image").attr("src", takenPictureUrl);
  $("#new-mail-request-text").text(ocrParsedText);
  sendTime = new Date().getTime();   
  cordova.plugins.notification.local.schedule({
      title: "You are receiving a mail",
      text: "Do you want to open the mailbox?",
      foreground: true
  });
}

// Mailboxes page
function getMailboxes() {
  //console.log("getMailboxes() is invoke");
  var database = firebase.database();
  var ref = database.ref('mailboxes');
  ref.on('value', function(data) {
    //console.log(data.val());
    var mailboxes = data.val();
    var keys = Object.keys(mailboxes);

    var mailboxesCount = keys.length;
    var messagesCount = 0;

    var mailboxesOutput = '';
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if(mailboxes[key].messages) {
        messagesCount += Object.keys(mailboxes[key].messages).length;

        mailboxesOutput += `
        <li data-icon="info">
          <a onclick="showMailboxInformation('${key}')" href="#messages-page">
            ${mailboxes[key].address}
            <span class="ui-li-count">${Object.keys(mailboxes[key].messages).length}</span>
          </a>
        </li>
      `;
      } else {
        mailboxesOutput += `
        <li data-icon="info">
          <a onclick="showMailboxInformation('${key}')" href="#messages-page">
          ${mailboxes[key].address}
          </a>
        </li>
      `;
      }

    }
    //console.log(mailboxesCount);
    //console.log(messagesCount);

    $("#mailboxes-count .count").text(mailboxesCount);
    $("#messages-count .count").text(messagesCount);
    $("#mailboxes").html(mailboxesOutput).listview('refresh');
  });
}

// Messages
function showMailboxInformation(mailboxId) {
  //console.log("showMailboxInformation() is invoke");
  //console.log(mailboxId);
  var database = firebase.database();
  var ref = database.ref('mailboxes/' + mailboxId);
  ref.on('value', function(data) {
    //console.log(data.val());
    var mailbox = data.val();
    $('#mailbox-address').text(mailbox.address);

    var messagesOutput = '';
    if(mailbox.messages) {
      var messages = mailbox.messages;
      //console.log(messages);
      $.each(messages, function(key, message) {
        messagesOutput += `
            <li data-icon="info">
            <a onclick="showMessageDetails('${mailboxId}', '${key}')" href="#message-details">
            Reseived on ${message.date}
            </a>
            </li>
        `;
      });
      $("#messages").show();
      $("#remove-mailbox-btn").show();
      $("#messages").next("p").hide();
      $("#messages").html(messagesOutput).listview().listview('refresh');
    }
    else {
      messagesOutput = `
      <p style="text-align:center;">There are no messages in this mailbox. Please go back.</p>
      `;
      $("#messages").hide();
      $("#remove-mailbox-btn").hide();
      if(!$("#messages").next("p").length) {
        $("#messages").after(messagesOutput);
      } else {
        $("#messages").next("p").show();
      }
    }

  });
}

// Message details
function showMessageDetails(mailboxId, messageId) {
  //console.log("showMessageDetails() is invoke");
  //console.log("showMessageDetails", mailboxId);
  //console.log("showMessageDetails", messageId);
  
  var database = firebase.database();
  var ref = database.ref('mailboxes/' + mailboxId );
  ref.on('value', function(data) {
    var messageDetailsOutput = '';
    if(data.val().messages) {
      var message = data.val().messages[messageId];
      if(message) {
        //console.log(message);
        $('#message-received-on').text(message.date);
        messageDetailsOutput += `
          <img id="message-details-img" src="${message.image}" style="width:320px" />
        `; 
      }
    }
    
    $("#message-received-on-title").text("Message received on");
    $("#remove-mailbox-btn").show();
    $("#message-info").html(messageDetailsOutput);
    $("#message-info").attr("data-mailboxid", mailboxId);
    $("#message-info").attr("data-messageid", messageId);
    //console.log("showMessageDetails-2", mailboxId);
    //console.log("showMessageDetails-2", messageId);
  });
}

function removeMail() {
  //console.log("removeMail() is invoke");
  $("#message-info").trigger("updatelayout");
  //console.log($("#message-info"));
  var mailboxId = $("#message-info").attr("data-mailboxid");
  var messageId = $("#message-info").attr("data-messageid");
  //console.log("removeMail", mailboxId);
  //console.log("removeMail", messageId);
  firebase.database().ref('mailboxes/' + mailboxId + '/messages/' + messageId).remove();
  $("#message-details-img").remove();
  $("#message-received-on-title").text("");
  $("#message-received-on").text("");
  $("#remove-mailbox-btn").hide();
  $("#message-details").trigger("updatelayout");
}

function invokeSignalrManager(){
  var signalRManager = new SignalrManager();
}

function clearInput() {
  $("#set-interval-input").val('');
  $("#add-secret-code-input").val('');
  $("#add-secret-question-input").val('');
  $("#add-secret-answer-input").val('');
  $("#rent-secret-code-input").val('');
}

$('#mailbox-behaviour-switch').change(function(event) {
  //console.log($(this).val());
  $("#default-time-container").toggle();
});

function pushMessgeToMailbox() {
    var mailboxMessages = firebase.database().ref('mailboxes/' + defaultMailboxId + '/messages');
    var newMail = {
      messageId: "mail-" + defaultMailboxId,
      date: new Date().toString(),
      image: $("#new-mail-request-image").attr("src"),
      ocrText: $("#new-mail-request-text").text()
    };
    mailboxMessages.push(newMail);
}

function acceptMessageBtnClicked() {
  $("#accept-message-container").show().delay(3000).fadeOut(); //show accept message

  pushMessgeToMailbox();

  clearInterval(setTimer); //stop timer
  timeExpired(true, "the mailbox was opened");
}

function sendAgainMessageBtnClicked() {
  $("#resend-message-container").show().delay(3000).fadeOut();
  clearInterval(setTimer); //stop timer
  timeExpired(true, "you should receive the notification again");
}

function ignoreMessageBtnClicked() {
  $("#reject-message-container").show().delay(3000).fadeOut();
  clearInterval(setTimer); //stop timer
  timeExpired(true, "the mailbox was not opened");
}

function startTimer() {
  var count = 10;
  setTimer = setInterval(function() {
    $("#timer").text(count + " seconds"); // case 1.1 - in this interval the user should answer

    if(count === 0) {
      timeExpired(true, "the time expired"); // case 1.2
      pushMessgeToMailbox();
      clearInterval(setTimer);
    }
    count--;
  }, 1000);
}

function timeExpired(isTimeExpired, displayMessage) {
  $("#timer").text(displayMessage);
  if(isTimeExpired) {
    $("#accept-message").hide();
    $("#send-again").hide();
    $("#ignore-message").hide();
    $("#homepage-link").show();
  } else {
    $("#accept-message").show();
    $("#send-again").show();
    $("#ignore-message").show();
    $("#homepage-link").hide();
  }
}