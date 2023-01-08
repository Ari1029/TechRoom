promiseWrapper = function(f){
    return(req,res,next)=>{
        f(req,res).catch(next);
    }
}

module.exports = promiseWrapper;