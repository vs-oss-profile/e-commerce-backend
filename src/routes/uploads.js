const router = require("express").Router();

router.get("/:imgname", (req, res) => {
  const imgname = req.params.imgname;
  res.sendFile(process.cwd() + `/uploads/${imgname}`);
});

module.exports = router;
