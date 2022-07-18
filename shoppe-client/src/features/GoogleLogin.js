import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { googleSignIn } from './store/auth';
import serverPath from '../serverPath.js';

function GoogleLogin() {

  const dispatch = useDispatch();

  function signInCallback(goog) {
    
    goog.accounts.id.initialize({
      client_id: "736022707807-rnm7nh3u5q6g8pjkvqs5etnfn77cio4r.apps.googleusercontent.com",
      callback: (googleResponse) => dispatch(googleSignIn(googleResponse))
    });
    goog.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
    goog.accounts.id.prompt(); // also display the One Tap dialog
  }

  useEffect(()=>{
    if (!document.getElementById("googleOAuthScript")) {
      // add Google OAuth script. Runs once when component mounts
      let oAuthScript = document.createElement("script");
      oAuthScript.id = "googleOAuthScript"
      oAuthScript.src = "https://accounts.google.com/gsi/client";
      oAuthScript.async = true;
      oAuthScript.defer = true;
      document.body.appendChild(oAuthScript);
      oAuthScript.onload = () => {
        if (!document.getElementById("googleCallbackScript")) {
          // loads Google buttons
          document.googleSignInCallback = signInCallback;
          let googleCallback = document.createElement("script");
          googleCallback.id = "googleCallbackScript"
          googleCallback.src = serverPath+"/scripts/googleLoginScript";
          googleCallback.async = true;
          googleCallback.defer = true;
          document.body.appendChild(googleCallback);
        }
      }
    }
    return ()=>{
      // remove Google scripts. Runs when component unmounts
      if (document.getElementById("googleOAuthScript")) document.body.removeChild(document.getElementById("googleOAuthScript"));
      if (document.getElementById("googleCallbackScript")) document.body.removeChild(document.getElementById("googleCallbackScript"));
    }
  },[]);

  return (
    <div style={{width:300,margin:"20px auto"}}>
      <div id="buttonDiv"></div> 
    </div>
  );
}

export default GoogleLogin;