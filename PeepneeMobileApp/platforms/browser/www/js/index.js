document.addEventListener('deviceready', this.onDeviceReady, false);

function onDeviceReady(){
    //alert("Drugario Sedlarov");
    var allUsers = getAllAvailableUsers();

    let usersOutput = '';
    $.each(allUsers, function(index, user){
      usersOutput += `
        <li>
          <a onclick="userSelected('${user.Id}')" href="#">
            <img src="${user.image}">
            <h2>${user.username}</h2>
          </a>
        </li>
      `;
    });

    $("#users").html(usersOutput).listview('refresh');
}

// HTTP Get call has to be sent to REST API
function getAllAvailableUsers()
{
  return [{
            'username':'Jar Jar Binks',
            'Id':'894d91ce-31d9-4cd3-b1de-bea2f869a6dd',
            'image':'http://icons.iconarchive.com/icons/jonathan-rey/star-wars-characters/256/Jar-Jar-Binks-icon.png'
          },
          {
            'username':'Yoda',
            'Id':'224d44ce-31d9-4cd3-b1de-bea2f86922dd',
            'image':'https://icon-icons.com/icons2/193/PNG/256/Yoda02_23226.png'
          },
          {
            'username':'Darth Vader',
            'Id':'318d44ce-31d9-4cd3-b1de-bea2f86922kk',
            'image':'http://www.iconarchive.com/download/i62301/jonathan-rey/star-wars-characters/Vader-02.ico'
          },
          {
            'username':'Obi One Kenobi',
            'Id':'717d44ce-31d9-4cd3-b1de-bea2f86988ee',
            'image':'http://iconbug.com/data/58/256/32ba2ea5f0d1453b5430e8715e88aafb.png'
          }]
}

function userSelected(userId){
  // 1. Maker REST call to mark this user as 'taken' and return his boxes
  // 2. Navigate to another page dedicated to the mailboxes
  alert('You selected:' + userId);
}
