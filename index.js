

// const express = require("express");
// const app = express();

// const connectDb = require('./db.js');
// const PORT = process.env.PORT || 3000;

// connectDb();

// // Middleware for parsing JSON data
// app.use(express.json());

// // Middleware for parsing URL-encoded data
// app.use(express.urlencoded({ extended: false }));

// //Import and use the Authentication Route
// const authRoutes = require("./routes/authRoute.js");
// app.use('/auth', authRoutes);

// //Import and use the OTPRoute
// const otpRoutes = require("./routes/otpRoute.js");
// app.use('/verify-otp', otpRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: 'Something went wrong' });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`)
// });
// Load environment variables from .env file
require('dotenv').config();  // Make sure this is at the top

const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
const chatRoutes = require('./routes/chatRoutes');
const { joinRoom, sendMessage } = require('./controllers/chatController');


const connectDb = require('./db.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDb();

// Middleware for parsing JSON data
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Import and use the Authentication Route
const authRoutes = require("./routes/authRoute.js");
app.use('/auth', authRoutes);

// Import and use the OTP Route
const otpRoutes = require("./routes/otpRoute.js");
app.use('/verify-otp', otpRoutes);





// Import and use the Voting route
const votingRoutes = require("./routes/votingRoute.js");
app.use('/voting', votingRoutes);
 
// Import and use the Member route
const memberRoutes = require("./routes/memberRoute.js");
app.use('/members', memberRoutes);

// Import and use the submit forms
const  submitFormAnswersRoutes = require("./routes/submitFormAnswersRoute.js");
app.use('/submitFormAnswers',submitFormAnswersRoutes);

// Import and use the match route
const matchRoutes = require("./routes/matchRoute.js");
app.use('/match', matchRoutes);


// Use chat routes
app.use('/api/chat', chatRoutes);


// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ userId }) => {
      joinRoom(socket, userId);
  });

  socket.on('sendMessage', ({ userId, message }) => {
      sendMessage(io, userId, message);
  });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});




// highlights
const highlightRoutes = require('./routes/highlightRoute')
app.use('/highlight', highlightRoutes );

// Event of Club
const eventRoutes = require('./routes/eventRoute')
app.use('/event', eventRoutes ); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});