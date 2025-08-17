const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => {next(err)});
    }
}







export default asyncHandler;










// const asyncHandler = (fn) => (req, res, next) => {
//     try {
//         fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             status: 'error',
//             success: false,
//             message: error.message || 'Internal Server Error'
//         });
//     }
// }



// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}
