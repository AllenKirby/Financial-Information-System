const admin = require('../firebaseAdmin')

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

const tokenVerifier = async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('Headers: ', req.headers);

  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({success: false, message: "Unauthorized: no token provided"})
  };

  const token = authHeader.split(' ')[1];
  try{
    console.log('Token Received: ', token);
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log('Decoded Token: ', decodedToken)
    return res.status(200).json({success: true, message: 'Access granted to protected route', user: req.user});

  }catch(error){
    return res.status(401).json({success: false, message: "Unathorized: Invalid Token"});
  }
}

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
  signupUser,
  tokenVerifier
};
