var dataImportToDb = [
        {   
            "id": "1111",
            "address": "Mladost 4, bl. 455, et. 3, ap. 6 ",
            "secretCode": "QWERTY",
            "secretQuestion": "Favorite color?",
            "secretAnswer": "Red",
            "messages": [
                {   
                    "messageId": "mail-1",
                    "date": "Thu Apr 26 2018 19:37:14 GMT+0300",
                    "image": "img/girl-holding-mail-while-looking-at-camera.jpg"
                },
                {   
                    "messageId": "mail-2",
                    "date": "Mon Apr 23 2018 14:31:12 GMT+0300",
                    "image": "img/direct-mail-innovations-mailman-holding-mailpieces.jpg"
                },
                {
                    "messageId": "mail-3",
                    "date": "Sun Apr 22 2018 10:15:11 GMT+0300",
                    "image": "img/little_man_holding_red_envelope.jpg"
                }

            ]
        },
        {   
            "id": "2222",
            "address": "Lyulin 10, bl. 322, et. 7, ap. 17 ",
            "secretCode": "ASDFGH",
            "secretQuestion": "Favorite book?",
            "secretAnswer": "The godfather",
            "messages": [
                {
                    "messageId": "mail-4",
                    "date": "Mon Apr 23 2018 14:31:12 GMT+0300",
                    "image": "img/mailman-holding-mail-vintage-images.jpg"
                },
                {
                    "messageId": "mail-5",
                    "date": "Sun Apr 22 2018 10:15:11 GMT+0300",
                    "image": "img/postman-holding-mail-and-bag-in-comics-style.jpg"
                }
            ]
        },
        {
            "id": "3333",
            "address": "Lozenets, bl. 16, et. 4, ap. 25 ",
            "secretCode": "ZXCVBN",
            "secretQuestion": "Your hometown?",
            "secretAnswer": "Petrich",
            "messages": [
                {   
                    "messageId": "mail-6",
                    "date": "Thu Apr 26 2018 19:37:14 GMT+0300",
                    "image": "img/you-ve-got-mail.png"
                }
            ]
        },
        {   
            "id": "4444",
            "address": "Izgrev, bl. 9, et. 2, ap. 24 ",
            "secretCode": "QWEASD",
            "secretQuestion": "Favorite singer?",
            "secretAnswer": "Mihaela Fileva",
            "messages": null
        },
        {   
            "id": "5555",
            "address": "Studentski grad, bl. 51, et. 1, ap. 11 ",
            "secretCode": "QWEASD",
            "secretQuestion": "Favorite actress?",
            "secretAnswer": "Nina Dobrev",
            "messages": null
        }
    ];

//console.log(firebase);
var database = firebase.database();
var ref = database.ref('mailboxes');
for(var i = 0; i < dataImportToDb.length; i++) {
    ref.push(dataImportToDb[i]);
}
//ref.push(dataImportToDb);