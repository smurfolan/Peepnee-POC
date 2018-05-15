document.addEventListener('deviceready', this.onDeviceReady, false);

var setTimer;

function onDeviceReady(){
  invokeSignalrManager();
  getMailboxes();
}

// Mailboxes page
function getMailboxes() {
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
      $("#messages").html(messagesOutput).listview('refresh');
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
  //console.log(mailboxId);
  //console.log(messageId);
  
  var database = firebase.database();
  var ref = database.ref('mailboxes/' + mailboxId );
  ref.on('value', function(data) {
    var messageDetailsOutput = '';
    if(data.val().messages) {
      var message = data.val().messages[messageId];
      //console.log(message);
      $('#message-received-on').text(message.date);
      messageDetailsOutput += `
        <img id="message-details-img" src="${message.image}" style="width:320px" />
      `;
    }
    
    $("#message-received-on-title").text("Message received on");
    $("#remove-mailbox-btn").show();
    $("#message-info").html(messageDetailsOutput);
    $("#message-info").attr("data-mailboxid", mailboxId);
    $("#message-info").attr("data-messageid", messageId);
  });
}

function removeMail() {
  var mailboxId = $("#message-info").data("mailboxid");
  var messageId = $("#message-info").data("messageid");
  //console.log(mailboxId);
  //console.log(messageId);
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

function acceptMessageBtnClicked() {
  $("#accept-message-container").show().delay(3000).fadeOut(); //show accept message

  var mailboxId = "-LCZFn574A554rJO0AQw";
  var mailboxMessages = firebase.database().ref('mailboxes/' + mailboxId + '/messages');
  var newMail = {
    messageId: "mail-" + mailboxId,
    date: new Date().toString(),
    image: $("#new-mail-request-image").attr("src"),
    ocrText: $("#new-mail-request-text").text()
  };
  mailboxMessages.push(newMail);

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