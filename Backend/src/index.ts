import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import connectDB from "./model/dbConnect";
import cors from "cors";
//routes
import AuthRoute from "../src/routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes"
import AdminRoutes from "./routes/AdminRoutes"
import ErrorController from "./controller/ErrorController";
import path from "path";
import passport from "passport";
import corsOptions from "./helper/corsOptions";

const app = express();
const port = process.env.PORT ?? 3000;
connectDB();
// mongoose.connect('mongodb://localhost:27017/yourdatabase');

// Configure CORS options

app.use(passport.initialize());
app.use(cors(corsOptions));
// Middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true,limit: '50mb'}));
app.use(express.static(path.join(__dirname, './public')));
// Routes
app.use("/auth", AuthRoute);
app.use("/user",UserRoutes)
app.use("/admin",AdminRoutes)

app.use(ErrorController);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
