let fs=require("fs");
let parser=require("./m3uparser");

const fileName="testfile.txt";

fs.readFile(fileName,"utf8",(err,data)=>{
  if(err) {
    console.log("Error reading file");
    return;
  }

  let m3u=new parser(data);
  m3u.parse();
  console.log(m3u.json.tags);
});
