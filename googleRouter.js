const express = require("express");
const googleRouter = express.Router();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


module.exports = passport => {

  async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    return payload;
  }

  googleRouter.post("/", async (req,res,next)=>{
    const payload = await verify(req.body.credential).catch(console.error);
    
    if (payload.email_verified) {
      req.body.username = "SIGN IN WITH GOOGLE";
      req.body.password = JSON.stringify({name:payload.name,email:payload.email,sub:payload.sub});
      return next();
    }
  },
  passport.authenticate("local", {failureRedirect: "/user"}),
  (req,res) => {res.redirect("/user");});

  return googleRouter;
}