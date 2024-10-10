
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const {errorHandler} = require("../auth");

// Sending email
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD
//   }
// })

// function sendEmail(receiver, name, res) {
//   const mailOptions = {
//     from: process.EMAIL_USER,
//     to: receiver,
//     subject: "Successfully Registratered!",
//     text: `Hello! ${name} Thank you for signing up in our Ecommerce App!`
//   }
//   transporter.sendMail(mailOptions, (error, info) => {
//     if(error) {
//       return res.status(500).send(error.toString());
//     } 
//   })
// }

// Registration
module.exports.registerUser = (req, res) => {
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      mobileNo: req.body.mobileNo
    });
  
    const isValidMobileNo = (mobileNo) => {
      return mobileNo.length === 11;
    };
  
    const isValidEmail = (email) => {
      return email.includes('@');
    };
  
    const isValidPassword = (password) => {
      return password.length >= 8;
    };
  
    const { firstName, lastName, email, mobileNo, password } = req.body;
  
    if(!isValidEmail(email)) {
      return res.status(400).send({ message: 'Invalid email format.'});
    } else if(!isValidMobileNo(mobileNo)) {
      return res.status(400).send({ message: 'Mobile number is invalid.'});
    } else if(!isValidPassword(password)) {
      return res.status(400).send({ message: 'Password must be atleast 8 characters long.' });
    }
  
    User.find({email: req.body.email}).then(result => {
      if(result.length > 0) {
        return res.status(409).send({message: "Email already exists!"})
      }
      
      return newUser.save()
      .then((result) => {
        res.status(201).send({ message: 'User registered successfully', result});
        // sendEmail(email, firstName, res);
      }).catch(err => errorHandler(err, req, res))

    }).catch(err => errorHandler(err, req, res))

    
  };


// Authentication
module.exports.loginUser = (req, res) => {
  if(!req.body.email.includes('@')) {
    return res.status(400).send({ error: "Invalid Email" });
  }

  return User.findOne({ email: req.body.email }).then((result) => {
      if (!result) { 
        return res.status(404).send({ error: "No email found" });
      } else {

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

        if (isPasswordCorrect) {
            return res.status(200).send({access : auth.createAccessToken(result)});
        } else {
            return res.status(404).send({ error: "Email and password do not match" });
        }

      }
    })
    .catch((err) => errorHandler(err, req, res));
};


// get user details here
module.exports.getUserDetails = (req, res) => {
  const {id} = req.user;

  User.findById(id).then(user => {
    if(user) {
      res.status(200).send({user});
    } else {
      res.status(404).send({error: "User not found"});
    }
  }).catch(err => errorHandler(err, req, res));
}

// Update user to an admin | admin functionality
module.exports.setUserAsAdmin = (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).send({ error: 'UserId is required' });
  }

  return User.findByIdAndUpdate(userId, {isAdmin: true}, { new: true}).then(result => {
    
      if(!result) {
        return res.status(404).send({ error: 'User not found' });
      } else {
        return res.status(200).send({ updatedUser: result });
      }

  }).catch(err => errorHandler(err, req, res));
}


// Update user password
module.exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if(newPassword.length < 8) {
      return res.status(400).send({ message: 'Password must be atleast 8 characters long.' });
    }
    const { id } = req.user; 

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(201).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};