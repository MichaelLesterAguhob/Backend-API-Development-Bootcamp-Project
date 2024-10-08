
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const {errorHandler} = require("../auth");

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
  
    return newUser.save()
    .then((result) => res.status(201).send({ message: 'User registered successfully', result}))
    .catch(err => errorHandler(err, req, res))
  };

 
// Authentication
module.exports.loginUser = (req, res) => {
  if(!req.body.email.includes('@')) {
    return res.status(400).send({ message: "Invalid email format" });
  }

  return User.findOne({ email: req.body.email }).then((result) => {
      if (!result) { 
        return res.status(404).send({ message: "No email found" });
      } else {

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

        if (isPasswordCorrect) {
            return res.status(200).send({ message: "Logged in successfully", access : auth.createAccessToken(result)});
        } else {
            return res.status(401).send({ message: "Incorrect email or password" });
        }

      }
    })
    .catch((err) => errorHandler(err, req, res));
};

// get user details here
module.exports.getUserDetails = (req, res) => {
  const {id} = req.user;

  User.findById(id).then(result => {
    res.status(200).send({result});
  }).catch(err => errorHandler(err, req, res));

}

// Update user to an admin | admin functionality
module.exports.setUserAsAdmin = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
      return res.status(400).send({ message: 'User ID is required.' });
  }

  try {
      const updatedUser = await User.findByIdAndUpdate(
          userId, {isAdmin: true}, { new: true} 
      );

      // if (!updatedUser) {
      //     return res.status(404).send({ message: 'User not found.' });
      // }

      return res.status(200).send({ message: 'User updated as admin successfully.' });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Failed to update user as admin.' });
  }
}


// Update user password
module.exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const { id } = req.user; 

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};