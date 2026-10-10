import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import csrf from "csurf";
import rateLimit from "express-rate-limit";


import hotelRoute from "./hotel/route/route";
// import adminRoute from "./admin/route/routes";

import externalHotelRoute from "./hotel/external/hotel.route";

dotenv.config(); // Load environment variables at the very beginning

const app = express();

const csrfProtection = csrf({ cookie: true });


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("../public"));
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001", 
  "http://localhost:3002",
  "https://instant-booking-demo.netlify.app",
  "https://legendary-sfogliatella-1628a3.netlify.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If cookies are used
  })
);
app.use(helmet());

// Database connection
// const MONGODB_URI = "mongodb://localhost:27017/TheraSwiftLocal";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('The MONGODB_URI environment variable is not set.');
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected To Database - Initial Connection");
  } catch (err) {
    console.log(
      `Initial Distribution API Database connection error occurred -`,
      err
    );
  }
})();

// Router middleware
app.use(
  "/",
  express.Router().get("/", (req, res) => {
    res.json("Hello");
  })
);

app.use("/api/hotel", hotelRoute);

app.use("/api/v2/hotel", externalHotelRoute);
// app.use("/admin", adminRoute);


// App initialized port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
