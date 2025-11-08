/**
 * ENHANCED AUTH0 BACKEND IMPLEMENTATION GUIDE
 * 
 * This endpoint handles Auth0 Google authentication with automatic database storage
 * Matches your existing signup/login flow exactly
 */

// POST /auth/auth0-callback
// Handles both first-time registration and existing user login for Auth0 users

/*
ENHANCED REQUEST BODY:
{
  "auth0Id": "google-oauth2|123456789",
  "email": "user@example.com", 
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "emailVerified": true,
  "isSignupFlow": true,  // NEW: Indicates if user clicked signup button
  "provider": "google-oauth2"
}

Headers:
{
  "Authorization": "Bearer <auth0-access-token>", // Optional
  "Content-Type": "application/json"
}

ENHANCED RESPONSES:

✅ NEW USER SIGNUP (Automatic Database Storage):
{
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "user@example.com",
    "picture": "https://lh3.googleusercontent.com/...",
    "auth0Id": "google-oauth2|123456789",
    "authProvider": "auth0",
    "emailVerified": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "isNewUser": true,
  "message": "Account created successfully"
}

✅ EXISTING USER LOGIN:
{
  "user": {
    "_id": "user-id", 
    "name": "John Doe",
    "email": "user@example.com",
    "picture": "https://lh3.googleusercontent.com/...",
    "auth0Id": "google-oauth2|123456789",
    "authProvider": "auth0"
  },
  "isNewUser": false,
  "message": "Login successful"
}

❌ ERROR RESPONSES:
- 403: User tried to login but account doesn't exist (should signup first)
- 409: User tried to signup but account already exists (should login instead)
- 401: Invalid Auth0 token
- 500: Server error
*/

// ENHANCED IMPLEMENTATION (Node.js/Express):
/*
app.post('/auth/auth0-callback', async (req, res) => {
  try {
    const { 
      auth0Id, 
      email, 
      name, 
      picture, 
      emailVerified, 
      isSignupFlow, 
      provider 
    } = req.body;
    
    console.log(`🔄 Auth0 ${isSignupFlow ? 'SIGNUP' : 'LOGIN'} attempt:`, { email, name });
    
    // Check if user already exists in your database
    let existingUser = await User.findOne({ 
      $or: [
        { auth0Id: auth0Id },
        { email: email }
      ]
    });
    
    if (isSignupFlow) {
      // 📝 SIGNUP FLOW - User clicked "Continue with Google" on signup page
      
      if (existingUser) {
        // User already exists, return conflict error
        return res.status(409).json({ 
          message: 'Account already exists. Please login instead.',
          shouldLogin: true 
        });
      }
      
      // ✅ CREATE NEW USER IN DATABASE (Automatic Storage)
      const newUser = new User({
        auth0Id: auth0Id,
        email: email,
        name: name,
        picture: picture,
        authProvider: 'auth0',
        provider: provider,
        emailVerified: emailVerified,
        createdAt: new Date(),
        // Add any other default fields your User model needs
        // profileCompleted: false,
        // role: 'user',
        // preferences: {},
        // etc.
      });
      
      await newUser.save();
      console.log('✅ New user created in database:', newUser._id);
      
      // Set session/cookie (same as your regular signup)
      req.session.user = newUser;
      
      res.json({
        user: newUser,
        isNewUser: true,
        message: 'Account created successfully'
      });
      
    } else {
      // 🔑 LOGIN FLOW - User clicked "Continue with Google" on login page
      
      if (!existingUser) {
        // User doesn't exist, should signup first
        return res.status(403).json({ 
          message: 'Account not found. Please sign up first.',
          shouldSignup: true 
        });
      }
      
      // Update user info if needed
      if (!existingUser.auth0Id) {
        existingUser.auth0Id = auth0Id;
        existingUser.authProvider = 'auth0';
        existingUser.provider = provider;
      }
      
      // Update profile picture if changed
      if (picture && existingUser.picture !== picture) {
        existingUser.picture = picture;
      }
      
      await existingUser.save();
      console.log('✅ Existing user logged in:', existingUser._id);
      
      // Set session/cookie (same as your regular login)
      req.session.user = existingUser;
      
      res.json({
        user: existingUser,
        isNewUser: false,
        message: 'Login successful'
      });
    }
    
  } catch (error) {
    console.error('❌ Auth0 callback error:', error);
    res.status(500).json({ 
      message: 'Authentication failed',
      error: error.message 
    });
  }
});

// OPTIONAL: Middleware to verify Auth0 token (if you want extra security)
function verifyAuth0Token(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    // Token is optional, proceed without verification
    return next();
  }
  
  // If token exists, verify it
  // Use jsonwebtoken and jwks-client libraries
  // Verify against your Auth0 domain: dev-j5jwnjmxprsxq2z2.us.auth0.com
  
  next();
}

// DATABASE SCHEMA UPDATES NEEDED:
/*
Add these fields to your User model:

{
  // Existing fields
  name: String,
  email: String,
  password: String, // Optional for Auth0 users
  
  // New Auth0 fields
  auth0Id: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'auth0'], default: 'local' },
  provider: { type: String }, // 'google-oauth2', 'email', etc.
  picture: { type: String },
  emailVerified: { type: Boolean, default: false },
  
  // Your existing fields
  createdAt: { type: Date, default: Date.now },
  // ... other fields
}
*/
*/