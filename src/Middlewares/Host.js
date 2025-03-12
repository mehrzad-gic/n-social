const allows = ['http://localhost:5000/','http://localhost:5500/','http://localhost:3000/']

const Host = (req, res, next) => {

    const origin = req.headers.origin;

    console.log(origin);
    
    if (allows.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();

}

export default Host;