class CommonFunc {
  constructor(){

  }
  public doStringsMatch(s1: string, s2:string) {
    let isValid = true
    if(s1.length != s2.length){
      isValid = false
    }else{
      for(let i = 0; i < s1.length; i++){
        if(s1[i] != s2[i]){
          isValid = false;
        }
      }
    }
    return isValid;
  }

  public styleAndReturnString (content: string) {
    let newContent = "";
    const stringArray = content.split("_")
    if(stringArray.length > 1){
      newContent = stringArray.map((s) => s.charAt(0).toUpperCase() + s.toLocaleLowerCase().slice(1)).join(" ");
    }else{
      newContent = content.charAt(0).toUpperCase() + content.toLocaleLowerCase().slice(1);
    }
    return newContent;
  }
}
export default CommonFunc;