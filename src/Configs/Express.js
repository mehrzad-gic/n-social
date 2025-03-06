import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cors from 'cors';

// Express Configuration
function Express(app){

    app.use(cors({
      origin: 'http://localhost:3000', // Allow only your React app's origin
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
      credentials: true, // Allow cookies and credentials
    }));

    // morgan
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan("dev"));
    }

    // bodyParser
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());


    // cookieParser
    app.use(cookieParser());

    // session
    app.use(session({
      saveUninitialized: true,
      resave: false,
      secret: 'secret',
      cookie: { maxAge: 600000 }
    }));

    // express-fileUpload Middleware
    app.use(fileUpload());

}

export default Express;