/* ####### NEEDS INPUT MODIFICATION ##### */

const myFilePath = "/<YOUR PATH>/";     // NEEDS CONFIG!

const backupsName = "Metrc-MI-Industry-BackupCodes.txt";
const backupsFile = myFilePath+backupsName;

const myMetrcPassword = "<YOUR PASSWORD>";   // USE .env to hide login info

// $('#download-backup-codes').click(function() {
                //     if (!confirm('Downloading new backup codes will invalidate any previously downloaded set of codes.')) {
                //         return;
                //     }
                //     window.open('/user/profile/backupcodes/download');
                // });


/* ###### METRC URLS ######   */
const urlLogin = "https://mi.metrc.com/log-in";
const urlMfa = "https://mi.metrc.com/log-in/mfa";
// const urlUserProfile = "https://mi.metrc.com/user/profile?licenseNumber=AU-P-000214";
const urlBackups = "/user/profile/backupcodes/download";

/* ##### PAGE ASSETS ##### */
const modalDiv = document.getElementById("modal-div");
const myLoginForm = document.getElementById("login-form");
const myFileInput = document.getElementById("file-input");
myFileInput.style.width = "100%";
const myUsernameInput = document.getElementById("user-input");
const myPasswordInput = document.getElementById("password-input");
const mySubmitButton = document.getElementById("submit-button");
modalDiv.style.backgroundColor = "black";
modalDiv.style.color = "white";
const fileContentsElement = document.getElementById('embed-div');

function login(credentials){
    fetch(urlLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
        mode: 'same-origin',
    })
    .then(response => {
        // Access and process cookies from response headers
        const cookies = response.headers.get('Set-Cookie');
        console.log('Cookies received:', cookies);
        document.cookie = cookies;
        return response.json();
    })
    .then(data => {
      const sessionToken = data.sessionToken;
      //   console.log("data: ", data);
    })
    .catch(error => {
        console.error('Login error:', error)
    });
};

function getCodesFromLocalstorage(){
    if(!localStorage.backupindex) {
        localStorage.setItem("backupindex", 0);
        const currentIndex = 0;
    } else {
        const currentIndex = localStorage.getItem("backupindex");
    }
};
function readCodesToList(codeText) {
    var codeList = codeText.split('\n');
    if (codeList.length < 1) {
        return codeList;
    } else {
        return [];
    }
};
function getCodesFromFile(event){
    var codeList = [];
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            codeList = readCodesToList(event.target.result);
        };
        fileReader.readAsText(selectedFile);
        return codeList;
    }
};

// function downloadCodes(sessionToken){
//     fetch(urlBackups, {
//       headers: {
//         Authorization: `Bearer ${sessionToken}`
//       },
//       credentials: 'include',
//       mode: 'cors'
//     })
//     .then(response => response.json())
//     .then(data => {
//       // Process the data from the API
//     })
//     .catch(error => console.error('API request error:', error));
// };

function inputCodes(sessionToken, myCode){
    // window.open(urlMfa);
    fetch(urlMfa, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      },
      credentials: 'include',
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
      // Process the data from the API
    })
    .catch(error => console.error('API request error:', error));
};

$("#body_content").append(modalDiv);

function controller() {

    /* ####### LOCAL STORAGE ##### */
    // Count how many codes you've used
    let backupIndex = localStorage.getItem("backupindex");
    if (!backupIndex) {
        backupIndex = 0
    } else {
        backupIndex = backupIndex+1;
    }
    localStorage.setItem("backupindex", backupIndex);
    var metrcUser = localStorage.getItem("metrcuser");
    if (metrcUser) {
        $("#username-input").val(metrcUser);
    }

    /* See if backups file was detected and get code */
    const myLocalCodes = document.getElementById("embedded-codes").innerHTML;
    if (myLocalCodes) {
        var myCodeList= readCodesToList(myLocalCodes);
        if (myCodeList.length>1) {
            const myCode = myCodeList[backupIndex];
        }
    }

    /* ##### FILE READER ###### */
    myFileInput.addEventListener('change', (e)=>getCodesFromFile(e));
};
controller();
$("#password-input").val(myMetrcPassword);
// $("#file-input").val("/Metrc-MI-Industry-BackupCodes.txt");
$("#submit-button").on("click", (e) => {
    e.preventDefault();
    var myUn = $("#username-input").val();
    var myPw = $("#password-input").val();
    localStorage.setItem("metrcuser", myUn);
    // localStorage.setItem("backuplocation", $("#file-input").val());
    const credentials = {
      'username': myUn,
      'password': myPw
    };
    login(credentials);
    // window.open(urlLogin);
    // $("#username").val(myUn);
    // $("#password").val(myPw);
    // setTimeout(2000, $("#login_button").click());
    // inputCodes(myToken, myCode);
});
