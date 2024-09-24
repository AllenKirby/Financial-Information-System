const db  = require('../firebase')
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth()

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    res.cookie('token', token, {
      httpOnly: true,    
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/', 
      sameSite: 'strict',
    });

    res.status(200).json({ username });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async(req, res) => {
  const {firstname, lastname, email, password} = req.body
  try {
      const user = db.collection('Users').doc(email);
      const ref = await user.set({
        ['firstname']: firstname,
        ['lastname']: lastname,
        ['email']: email,
        ['password']: password,
      })
      
      res.status(200).json({ message: 'Your account has been successfully created' });

  }catch(error){
      res.status(400).json({error: error.message})
  }
}

module.exports = {
  loginUser,
  signupUser
};
