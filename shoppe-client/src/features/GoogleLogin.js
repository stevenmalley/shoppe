import { useEffect } from 'react';
import { serverPath } from "../config";

function GoogleLogin() {

  useEffect(()=>{
    fetch(`${serverPath}/auth/google/login`);
  },[]);

  return (
    <div>
    </div>
  );
}

export default GoogleLogin;