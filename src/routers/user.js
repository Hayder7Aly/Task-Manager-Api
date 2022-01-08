const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer")
const sharp = require("sharp")
const {sendWelcomeEmail, sendLeaveEmail} = require("../accounts/email")


const userRouter = new express.Router();

userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken()
    sendWelcomeEmail(user.email, user.name)
    res.status(201).send({user, token});
  } catch (err) {
    res.status(400).send(err);
  }

  // user.save().then(() => res.status(201).send(user)).catch((error) => res.status(400).send(error))
});

userRouter.post("/users/login", async (req,res) => {
    try{

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user , token})

    }catch(e){
        res.status(400).send(e)
    }
})


userRouter.post("/users/logout", auth, async(req,res)=> {

  try{

    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save()

    res.send({message : "Logout Perfectly !"})

  }catch(e){
    res.status(500).send()
  }

})


userRouter.post("/users/logoutall", auth, async(req,res) => {

  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send()
  }


})



userRouter.get("/users/me", auth , async (req, res) => {
  res.send(req.user)
});



userRouter.patch("/users/me", auth,  async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates !" });
  }

  try {

    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user);
    
  } catch (err) {
    res.status(400).send();
  }
});

userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    
    await req.user.remove()
    sendLeaveEmail(req.user.email, req.user.name)
    res.send(req.user);


  } catch (err) {
    res.status(500).send();
  }
});


const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {

    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
      cb(new Error("File must be in png, jpg and jpeg extension and could not be greater than 1 MB !"))
    }

    cb(undefined, true)

  }
})


userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
  // req.user.avatar = req.file.buffer

  const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

  req.user.avatar = buffer

  await req.user.save()
  res.send({message : "You avatar is saved !"})
},(error,req,res,next) => {
  res.status(400).send({error : error.message})
})



userRouter.delete('/users/me/avatar', auth, async (req,res) => {
  req.user.avatar = undefined

  await req.user.save()

  res.send()
})

userRouter.get("/users/:id/avatar", async (req,res) => {

  try{
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar){
      throw new Error()
    }

    res.set("Content-Type", "image/png")
    res.send(user.avatar)

  }catch(e){
    res.status(404).send()
  }

})


module.exports = userRouter;

