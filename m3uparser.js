class m3u {
  constructor(text) {
    this.string=text;
    this.previousLineWasExt=false;
    this.json={
      unassigned:[],
      tags:[]
    };

    this.curobj={};
  }

  parse() {
    let lines=this.string.split(/\r?\n/);
    for(let line of lines) {
      let curLine=line.trim();
      if(curLine.length > 0) {
        this.parseLine(curLine);
      }
    }
  }

  parseLine(curLine) {
    let regex=/^\s*#?(EXT[^:]*):?/;
    let match=curLine.match(regex);
    if(match !== null) {
      if(this.previousLineWasExt === true) {
        this.json.tags.push(this.curobj);
      }

      this.previousLineWasExt=true;
      let EXT_TAG=match[1];
      this.curobj={name:EXT_TAG, attribs:{}};
      let i=curLine.indexOf(":");
      if(i !== -1 && i+1 !== curLine.length) {
        let keyVal=curLine.slice(i+1, curLine.length);
        this.parseKeyVal(keyVal);
      }
    } else {
      let link=curLine;

      if (this.previousLineWasExt === false) {
        console.log("Found link that cannot be assigned to an EXT Tag");
        this.json.unassigned.push(this.removeQuotationMarks(curLine));
      } else {
        this.curobj.link=this.removeQuotationMarks(curLine);
        this.json.tags.push(this.curobj);
        this.previousLineWasExt=false;
      }
    }
  }

  parseKeyVal(str) {
    let regex=/("[^"]*"|[^"=,]*)\s*=\s*("[^"]*"|[^,]*)/g;
    let match=regex.exec(str);

    if(match === null) { //no matches
      if(str.endsWith(",") === true) {
        this.curobj.val=str.slice(0,-1);
      } else {
        this.curobj.val=str;
      }
    }

    while(match !== null) {
      let key=this.removeQuotationMarks(match[1].trim());
      let val=this.removeQuotationMarks(match[2].trim());

      if(key in this.curobj.attribs) {
        console.log("Duplicate key detected: ${key}");
      } else {
        this.curobj.attribs[key]=val;
      }

      match=regex.exec(str);
    }
  }

  removeQuotationMarks(str) {
    if(str.startsWith("\"") && str.endsWith("\"")) {
      return str.slice(1,-1);
    } else {
      return str;
    }
  }

}

module.exports=m3u;
