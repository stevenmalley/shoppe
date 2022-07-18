import { useEffect } from 'react';
import { absolutePath } from '../serverPath.js';

function GoogleLogin() {

  useEffect(()=>{
    let oAuthScript;
    if (!document.getElementById("googleOAuthScript")) {
      // add Google OAuth script. Runs once when component mounts
      oAuthScript = document.createElement("script");
      oAuthScript.id = "googleOAuthScript"
      oAuthScript.src = "https://accounts.google.com/gsi/client";
      oAuthScript.async = true;
      oAuthScript.defer = true;
      document.body.appendChild(oAuthScript);
    }
    return ()=>{
      // remove Google OAuth script. Runs when component unmounts
      document.body.removeChild(oAuthScript);
    }
  },[]);

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  /* to decode the credential response.
  const responsePayload = decodeJwtResponse(response.credential);

  console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log('Family Name: ' + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);*/
  console.log(response)
}

  return (
    <div style={{width:300,margin:"20px auto"}}>
      <div id="g_id_onload"
          data-client_id="736022707807-rnm7nh3u5q6g8pjkvqs5etnfn77cio4r.apps.googleusercontent.com"
          data-login_uri={absolutePath+"/googleLogin"}
          data-auto_prompt="false">
      </div>
      <div className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left">
      </div>
    </div>
  );
}

export default GoogleLogin;