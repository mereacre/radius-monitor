function getAttributeName(type) {
  switch(type) {
    case 1: return "User-Name";
    case 2: return "User-Password";
    case 3: return "CHAP-Password";
    case 4: return "NAS-IP-Address";
    case 5: return "NAS-Port";
    case 6: return "Service-Type";
    case 7: return "Framed-Protocol";
    case 8: return "Framed-IP-Address";
    case 9: return "Framed-IP-Netmask";
   case 10: return "Framed-Routing";
   case 11: return "Filter-Id";
   case 12: return "Framed-MTU";
   case 13: return "Framed-Compression";
   case 14: return "Login-IP-Host";
   case 15: return "Login-Service";
   case 16: return "Login-TCP-Port";
   case 17: return "(unassigned)";
   case 18: return "Reply-Message";
   case 19: return "Callback-Number";
   case 20: return "Callback-Id";
   case 21: return "(unassigned)";
   case 22: return "Framed-Route";
   case 23: return "Framed-IPX-Network";
   case 24: return "State";
   case 25: return "Class";
   case 26: return "Vendor-Specific";
   case 27: return "Session-Timeout";
   case 28: return "Idle-Timeout";
   case 29: return "Termination-Action";
   case 30: return "Called-Station-Id";
   case 31: return "Calling-Station-Id";
   case 32: return "NAS-Identifier";
   case 33: return "Proxy-State";
   case 34: return "Login-LAT-Service";
   case 35: return "Login-LAT-Node";
   case 36: return "Login-LAT-Group";
   case 37: return "Framed-AppleTalk-Link";
   case 38: return "Framed-AppleTalk-Network";
   case 39: return "Framed-AppleTalk-Zone";
   case 60: return "CHAP-Challenge";
   case 61: return "NAS-Port-Type";
   case 62: return "Port-Limit";
   case 63: return "Login-LAT-Port";
   case 64: return "Tunnel-Type";
   case 65: return "Tunnel-Medium-Type";
   case 77: return "Connect-Info";
   case 80: return "Message-Authenticator";
   case 81: return "Tunnel-Private-Group-Id";
   default:
      return "reserved";
  }
}

function getAttributeType(name) {
  switch(name) {
    case "User-Name":                 return 1;
    case "User-Password":             return 2;
    case "CHAP-Password":             return 3;
    case "NAS-IP-Address":            return 4;
    case "NAS-Port":                  return 5;
    case "Service-Type":              return 6;
    case "Framed-Protocol":           return 7;
    case "Framed-IP-Address":         return 8;
    case "Framed-IP-Netmask":         return 9;
    case "Framed-Routing":            return 10;
    case "Filter-Id":                 return 11;
    case "Framed-MTU":                return 12;
    case "Framed-Compression":        return 13;
    case "Login-IP-Host":             return 14;
    case "Login-Service":             return 15;
    case "Login-TCP-Port":            return 16;
    case "(unassigned)":              return 17;
    case "Reply-Message":             return 18;
    case "Callback-Number":           return 19;
    case "Callback-Id":               return 20;
    case "(unassigned)":              return 21;
    case "Framed-Route":              return 22;
    case "Framed-IPX-Network":        return 23;
    case "State":                     return 24;
    case "Class":                     return 25;
    case "Vendor-Specific":           return 26;
    case "Session-Timeout":           return 27;
    case "Idle-Timeout":              return 28;
    case "Termination-Action":        return 29;
    case "Called-Station-Id":         return 30;
    case "Calling-Station-Id":        return 31;
    case "NAS-Identifier":            return 32;
    case "Proxy-State":               return 33;
    case "Login-LAT-Service":         return 34;
    case "Login-LAT-Node":            return 35;
    case "Login-LAT-Group":           return 36;
    case "Framed-AppleTalk-Link":     return 37;
    case "Framed-AppleTalk-Network":  return 38;
    case "Framed-AppleTalk-Zone":     return 39;
    case "CHAP-Challenge":            return 60;
    case "NAS-Port-Type":             return 61;
    case "Port-Limit":                return 62;
    case "Login-LAT-Port":            return 63;
    case "Tunnel-Type":               return 64;
    case "Tunnel-Medium-Type":        return 65;
    case "Connect-Info":              return 77;
    case "Message-Authenticator":     return 80;
    case "Tunnel-Private-Group-Id":   return 81;
    default:
      return "reserved";
  }
}

module.exports = {
  getAttributeName: getAttributeName,
  getAttributeType: getAttributeType,
}