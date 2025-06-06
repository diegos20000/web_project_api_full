const errorHandler = (err, req, res, next) => { 
     console.error(err);  

     const statusCode = err.statusCode || 500;  

     res.status(statusCode).send({  
          message: err.message || 'Se ha producido un error en el servidor',      
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
       });  
     };

module.exports = errorHandler;
