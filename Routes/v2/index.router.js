const express = require("express");
const router = express.Router();
const path = require("path");

//route for contact us
router.use(
    "/contactUs",
    require("../../Controllers/v2/contactUs.controller")
  );

  //route to send leads email
  router.use(
    "/leads",
    require("../../Controllers/v2/leads.controller")
  );

  router.use(
    "/comment",
    require("../../Controllers/v2/comment.controller")
  );

  module.exports = router;