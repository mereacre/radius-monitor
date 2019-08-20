function getCodeName(code) {
  switch(code) {
    case 1: return "Access-Request";
    case 2: return "Access-Accept";
    case 3: return "Access-Reject";
    case 4: return "Accounting-Request";
    case 5: return "Accounting-Response";
    case 11: return "Access-Challenge";
    case 12: return "Status-Server (experimental)";
    case 13: return "Status-Client (experimental)";
    default:
      return "Reserved";
  }
}

function getCodeValue(name) {
  switch(name) {
    case "Access-Request": return 1;
    case "Access-Accept": return 2;
    case "Access-Reject": return 3;
    case "Accounting-Request": return 4;
    case "Accounting-Response": return 5;
    case "Access-Challenge": return 11;
    case "Status-Server (experimental)": return 12;
    case "Status-Client (experimental)": return 13;
    default:
      return 255;
  }
}

module.exports = {
  getCodeName: getCodeName,
  getCodeValue: getCodeValue,
}