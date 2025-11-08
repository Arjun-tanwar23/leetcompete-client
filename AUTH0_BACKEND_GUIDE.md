/**
 * BACKEND API ENDPOINT REQUIRED FOR AUTH0 INTEGRATION
 * 
 * Add this endpoint to your backend to handle Auth0 authentication
 * This endpoint should match your existing signup/login flow but handle Auth0 users
 */

// POST /auth/auth0-callback
// This endpoint handles both first-time registration and existing user login for Auth0 users

/*
Request Body:
{
  "auth0Id": "google-oauth2|123456789",
  "email": "user@example.com", 
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "emailVerified": true
}

Headers:
{
  "Authorization": "Bearer <auth0-access-token>",
  "Content-Type": "application/json"
}

Response for NEW USER (first-time signup):
{
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "user@example.com",
    "picture": "https://lh3.googleusercontent.com/...",
    "auth0Id": "google-oauth2|123456789",
    "authProvider": "auth0",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "isNewUser": true
}

Response for EXISTING USER (login):
{
  "user": {
    "_id": "user-id", 
    "name": "John Doe",
    "email": "user@example.com",
    "picture": "https://lh3.googleusercontent.com/...",
    "auth0Id": "google-oauth2|123456789",
    "authProvider": "auth0"
  },
  "isNewUser": false
}

Error Responses:
- 403: User exists in Auth0 but not in your database (should signup first)
- 401: Invalid Auth0 token
- 500: Server error
*/

// Example Implementation (Node.js/Express):
/*
app.post('/auth/auth0-callback', verifyAuth0Token, async (req, res) => {
  try {
    const { auth0Id, email, name, picture, emailVerified } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { auth0Id: auth0Id },
        { email: email }
      ]
    });
    
    if (user) {
      // Existing user - login flow
      if (!user.auth0Id) {
        // User exists with email but no auth0Id, link accounts
        user.auth0Id = auth0Id;
        user.authProvider = 'auth0';
        user.picture = picture;
        await user.save();
      }
      
      // Set session/cookie (same as regular login)
      req.session.user = user;
      
      res.json({
        user: user,
        isNewUser: false
      });
    } else {
      // New user - registration flow  
      const newUser = new User({
        auth0Id: auth0Id,
        email: email,
        name: name,
        picture: picture,
        authProvider: 'auth0',
        emailVerified: emailVerified
      });
      
      await newUser.save();
      
      // Set session/cookie (same as regular signup)
      req.session.user = newUser;
      
      res.json({
        user: newUser,
        isNewUser: true
      });
    }
    
  } catch (error) {
    console.error('Auth0 callback error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Middleware to verify Auth0 token
function verifyAuth0Token(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  // Verify JWT token with Auth0
  // Use jsonwebtoken and jwks-client libraries
  // Verify against your Auth0 domain
  
  next();
}
*/