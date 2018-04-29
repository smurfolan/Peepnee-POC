document.addEventListener('deviceready', this.onDeviceReady, false);

function onDeviceReady(){
    //alert("Drugario Sedlarov");
    //<a onclick="getMailboxes()" href="#mailboxes-page">
    //<a href="#popupLogin" onclick="verifyUser('${user.Id}')" data-rel="popup" data-position-to="window" class="ui-btn" data-transition="pop">
    var allUsers = getAllAvailableUsers();

    let usersOutput = '';
    $.each(allUsers, function(index, user){
      usersOutput += `
        <li data-icon="info">
        <a href="#popupLogin" onclick="setUsername('${user.username}')" data-rel="popup" data-position-to="window" class="ui-btn" data-transition="pop">
          
            <img src="${user.image}">
            <h2>${user.username}</h2>
          </a>
        </li>
      `;
    });

    $("#users").html(usersOutput).listview('refresh');
}

function setUsername(username) {
  //console.log(username);
  $(".password-input").val('');
  $(".username-input").val(username);
  $("#submit-link").data("username", username);
}

function verifyUser() {
  var selectedUsername = $("#submit-link").data("username");
  var passwordInserted = $(".password-input").val();
  //console.log($(".password-input").val());
  //console.log(selectedUser);
  var allUsers = getAllAvailableUsers();
  $.each(allUsers, function(index, user){
    if(selectedUsername === user.username) {
      if(passwordInserted === user.password) {
        $("#submit-link").attr("href", "#mailboxes-page");
        getMailboxes();
      }
      else {
        $("#submit-link").attr("href", "/");
      }
    }
  });
}

// HTTP Get call has to be sent to REST API
// Users page
function getAllAvailableUsers()
{
  return [{
            'username':'Jar Jar Binks',
            'Id':'fb872173-930e-493d-a9f1-643d75f6be09',
            'image':'http://icons.iconarchive.com/icons/jonathan-rey/star-wars-characters/256/Jar-Jar-Binks-icon.png',
            'password': 'user1'
          },
          {
            'username':'Yoda',
            'Id':'5720-450a-b28b-73fb4920b871-89645',
            'image':'https://icon-icons.com/icons2/193/PNG/256/Yoda02_23226.png',
            'password': 'user2'
          },
          {
            'username':'Darth Vader',
            'Id':'59a45318-5720-450a-b28b-73fb4920b871',
            'image':'http://www.iconarchive.com/download/i62301/jonathan-rey/star-wars-characters/Vader-02.ico',
            'password': 'user3'
          },
          {
            'username':'Obi One Kenobi',
            'Id':'fb872173-930e-493d-a9f1-643d75f6be09-123456',
            'image':'http://iconbug.com/data/58/256/32ba2ea5f0d1453b5430e8715e88aafb.png',
            'password': 'user4'
          }]
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
          <a onclick="showMailboxInformation('${mailbox.id}')" href="#messages-page" data-message-id="${mailbox.id}">
            ${mailbox.address}
            <span class="ui-li-count">${mailbox.messages.length}</span>
          </a>
        </li>
      `;
      } else {
        mailboxesOutput += `
        <li data-icon="info">
          <a onclick="showMailboxInformation('${mailbox.id}')" href="#messages-page" data-message-id="${mailbox.id}">
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
              <a href="#">
              Reseived on ${message.date}
              </a>
              </li>
            `;
          
          });
          $("#messages").show();
          $("#messages").next("p").hide();
          $("#messages").html(messagesOutput).listview('refresh');
        }
        if(mailbox.messages == null) {
          console.log(mailbox.messages);
          
          messagesOutput = `
          <p style="text-align:center;">There are no messages in this mailbox. Please go back.</p>
          `;
          $("#messages").hide();
          if(!$("#messages").next("p").length) {
            $("#messages").after(messagesOutput);
          }
        }
      }  
    });
  });
}

function userSelected(userId){
  // 1. Maker REST call to mark this user as 'taken' and return his boxes
  // 2. Navigate to another page dedicated to the mailboxes
  alert('You selected:' + userId);
  var signalRManager = new SignalrManager(userId);
}
