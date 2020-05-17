const app = require("./server");
// let port = 3000;
let port = process.env.PORT || 3000;
app.listen(port, ()=>console.log("running"))
