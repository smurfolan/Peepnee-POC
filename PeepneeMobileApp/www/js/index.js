document.addEventListener('deviceready', this.onDeviceReady, false);

var setTimer;

function onDeviceReady(){
  invokeSignalrManager();
  getMailboxes();
}

// Mailboxes page
function getMailboxes() {
  $.getJSON( "data.json", function( data ) {
    //console.log(data);
    let mailboxesOutput = '';
    let mailboxesCount = 0;
    let messagesCount = 0;
    $.each( data.mailboxes, function( index, mailbox ) {
      mailboxesCount++;
      if(mailbox.messages) {
        messagesCount += mailbox.messages.length;
        mailboxesOutput += `
        <li data-icon="info">
          <a onclick="showMailboxInformation('${mailbox.id}')" href="#messages-page">
            ${mailbox.address}
            <span class="ui-li-count">${mailbox.messages.length}</span>
          </a>
        </li>
      `;
      } else {
        mailboxesOutput += `
        <li data-icon="info">
          <a onclick="showMailboxInformation('${mailbox.id}')" href="#messages-page">
          ${mailbox.address}
          </a>
        </li>
      `;
      }
      
    });
    $("#mailboxes-count .count").text(mailboxesCount);
    $("#messages-count .count").text(messagesCount);
    $("#mailboxes").html(mailboxesOutput).listview('refresh');
   });
}

// Messages
function showMailboxInformation(mailboxId) {
  //console.log(mailboxId);
  $.getJSON( "data.json", function( data ) {
    let messagesOutput = '';
    $.each( data.mailboxes, function( index, mailbox ) {
      if(mailboxId == mailbox.id) {
        $('#mailbox-address').text(mailbox.address);
        //console.log(mailbox.messages);
        if(mailbox.messages) {
          $.each(mailbox.messages, function( key, message ) {
            messagesOutput += `
              <li data-icon="info">
              <a onclick="showMessageDetails('${mailbox.id}', '${message.messageId}')" href="#message-details">
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
        if(mailbox.messages == null) {
          //console.log(mailbox.messages);
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
      }  
    });
  });
}

// Message details
function showMessageDetails(mailboxId, messageId) {
  //console.log(mailboxId);
  //console.log(messageId);
  $.getJSON( "data.json", function( data ) {
    let messageDetailsOutput = '';
    $.each( data.mailboxes, function( index, mailbox ) {
      if(mailboxId == mailbox.id) {
        if(mailbox.messages) {
          $.each(mailbox.messages, function( key, message ) {
            if(message.messageId == messageId) {
              $('#message-received-on').text(message.date);
              messageDetailsOutput += `
              <img src="${message.image}" style="width: 320px"/>
            `;
            }
          });
          $("#message-info").html(messageDetailsOutput);
        }
      }
    });
  });
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