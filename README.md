# RADIUS Monitor [![npm version](https://badge.fury.io/js/radius-monitor.svg)](https://badge.fury.io/js/radius-monitor)
A basic implementation of the Remote Authentication Dial In User Service (RADIUS) server ([RFC2865](https://tools.ietf.org/html/rfc2865)). The package can be used to monitor the RADIUS request that a client is sending to a server.

## Install
```sh
npm install radius-monitor
```

## Example

```javascript
const radius = require("radius-monitor");

async function messageCallback(address, port, packet) {
  if ("error" in packet) {
    console.log(packet.error);  
    return {};
  }

  console.log(`Code: ${packet.code}`);
  console.log(`Identifier: ${packet.identifier}`);
  console.log(`Length: ${packet.length}`);
  console.log(`Authenticator: ${packet.authenticator}`);

  for (const attributeName in packet.attributes) {
    const attributeValue = packet.attributes[attributeName];
    console.log(`${attributeName}: ${attributeValue}`);
  }

  // Here do the processing of packet.attributes
  return {
    code: "Access-Accept",
    attributes: {},
  };
}

function errorCallback(error) {
  console.log(error.message);
}

function listenCallback(address) {
  console.log(`RADIUS server listening on ${address.address}:${address.port}.`);
}

function sentCallback(address, port, packet) {
  console.log("Message sent to client");
}

const serverCallbacks = {
  errorCallback: errorCallback,
  messageCallback: messageCallback,
  listenCallback: listenCallback,
  sentCallback: sentCallback,
};

radius.startServer(serverCallbacks, "password");

```

## Documentation

### ```startServer```
The radius-monitor package exposes only the function ```startServer``` to read/write RADIUS messages from/to clients. The function accepts three arguments: a dictionary with callback functions, the password that a client uses to connect to the server and the port number to listen for client messages. The default value for the port is ```1812``` as per ([RFC2865](https://tools.ietf.org/html/rfc2865)). The function ```startServer``` opens a UDP server on the default port ```1812``` if not specified. 

Below is an example of calling the ```startServer``` function with password ```password``` and port ```1812```:

- ```serverCallbacks <Object>```
- ```password <string>```
- ```port <number>```

```javascript
const serverCallbacks = {
  errorCallback: errorCallback,
  messageCallback: messageCallback,
  listenCallback: listenCallback,
  sentCallback: sentCallback,
};

radius.startServer(serverCallbacks, "password", 1812);
```

### ```errorCallback```
The callback function ```errorCallback``` is invoked when there's a binding or trasmission error from the server to the client.

- ```address <Error>```

```javascript
function errorCallback(error) {
  // Process the error object
}
```

### ```listenCallback```
The callback function ```listenCallback``` is invoked when the RADIUS server binds to the port specified in ```startServer``` function.

The function ```listenCallback``` accept as input an object containing the address information for a socket. This object will contain address, family and port properties.

 - ```address <Object>```

```javascript
function listenCallback(address) {
  // Use address.port, address.address and address.family
}
```

### ```sentCallback```
The callback function ```sentCallback``` is invoked when the RADIUS server successfully sends a message to the client.

The function ```sentCallback``` accept as input the address and the port of the client, and the RADIUS packet that was sent (described below).

 - ```address <string>``` 
 - ```port <number>```
 - ```packet <Object>```

```javascript
function sentCallback(address, port, packet) {
  // Here process packet
}
```

### RADIUS packet
The RADIUS packet has the following properties as per ([RFC2865](https://tools.ietf.org/html/rfc2865)):
  - ```code <string>```
  - ```identifier <number>```
  - ```length <number>```
  - ```authenticator <string>```
  - ```attributes <Object>```

The ```code``` property is one of the below values:
 - ```Access-Request```
 - ```Access-Accept```
 - ```Access-Reject```
 - ```Accounting-Request```
 - ```Accounting-Response```
 - ```Access-Challenge```
 - ```Status-Server (experimental)```
 - ```Status-Client (experimental)```

 The ```authenticator``` is the hex string of the authenticator 16 byte field of the RADIUS protocol. Use ```Buffer.from(packet.authenticator, "hex")``` to get the correspopnding 16 byte buffer.

The ```attributes``` property is a dictionary of key value pairs. The key is one of the values below:
 - ```User-Name```
 - ```User-Password```
 - ```CHAP-Password```
 - ```NAS-IP-Address```
 - ```NAS-Port```
 - ```Service-Type```
 - ```Framed-Protocol```
 - ```Framed-IP-Address```
 - ```Framed-IP-Netmask```
 - ```Framed-Routing```
 - ```Filter-Id```
 - ```Framed-MTU```
 - ```Framed-Compression```
 - ```Login-IP-Host```
 - ```Login-Service```
 - ```Login-TCP-Port```
 - ```(unassigned)```
 - ```Reply-Message```
 - ```Callback-Number```
 - ```Callback-Id```
 - ```(unassigned)```
 - ```Framed-Route```
 - ```Framed-IPX-Network```
 - ```State```
 - ```Class```
 - ```Vendor-Specific```
 - ```Session-Timeout```
 - ```Idle-Timeout```
 - ```Termination-Action```
 - ```Called-Station-Id```
 - ```Calling-Station-Id```
 - ```NAS-Identifier```
 - ```Proxy-State```
 - ```Login-LAT-Service```
 - ```Login-LAT-Node```
 - ```Login-LAT-Group```
 - ```Framed-AppleTalk-Link```
 - ```Framed-AppleTalk-Network```
 - ```Framed-AppleTalk-Zone```
 - ```CHAP-Challenge```
 - ```NAS-Port-Type```
 - ```Port-Limit```
 - ```Login-LAT-Port```
 - ```Tunnel-Type```
 - ```Tunnel-Medium-Type```
 - ```Connect-Info```
 - ```Message-Authenticator```
 - ```Tunnel-Private-Group-Id```

The value is a hex string denoting the value of the attribute. An example of ```attributes``` property is below:
```javascript
{
  "Tunnel-Type": Buffer.from([0x00, 0x00, 0x00, 0x0d]).toString("hex"),
  "Tunnel-Medium-Type": Buffer.from([0x00, 0x00, 0x00, 0x06]).toString("hex"),
  "Tunnel-Private-Group-Id": Buffer.from([0x32]).toString("hex"),
},        
```

### ```messageCallback```
The callback function ```messageCallback``` is invoked when the RADIUS server receives a message from the client.

The function ```messageCallback``` accept as input the address and the port of the client, and the RADIUS packet that was received (described above).

 - ```address <string>``` 
 - ```port <number>```
 - ```packet <Object>```

```javascript
function messageCallback(address, port, packet) {
  // Process packet
  return {
    code: "Access-Accept",
    attributes: {},
  }
}
```
If the ```messageCallback``` returns a non empty packet with a given ```code``` field and a ```attributes``` (can be empty) then the packet is sent to the client.

## RADIUS protocol description
Exactly one RADIUS packet is encapsulated in the UDP Data field, where the UDP Destination Port field indicates ```1812``` (decimal). When a reply is generated, the source and destination ports are reversed. 

### Codes
The server implements the following RADIUS codes (decimal):
```1``` Access-Request
```2``` Access-Accept
```3``` Access-Reject

### Identifier
The Identifier field is one octet, and aids in matching requests and replies.  The RADIUS server can detect  duplicate request if it has the same client source IP address an source UDP port and Identifier within a short span of time.

### Length
The Length field is two octets.  It indicates the length of the packet including the Code, Identifier Lengt, Authenticator and Attribute fields.  Octets outside the rang of the Length field MUST be treated as padding and ignored o reception.  If the packet is shorter than the Length fiel indicates it MUST be silently discarded.  The minimum length is ```2``` and maximum length is ```4096```.

### Authenticator
The Authenticator field is sixteen (```16```octets). The most significant octet is transmitted first.  Thi value is used toauthenticate the reply from the RADIUS serve andis used in the password hiding algorithm.

#### Request Authenticator
In Access-Request Packets, the Authenticator value is a 16 octet random number, called the Request Authenticator. The value SHOULD be unpredictable and unique over the lifetime of a secret (the password shared between the client and the RADIUS server), since repetition of a request value in conjunction with the same secret would permit an attacker to reply with a previously intercepted response.  Since it is expected that the same secret MAY be used to authenticate with servers in disparate geographic regions, the Request Authenticator field SHOULD exhibit global and temporal uniqueness.

The Request Authenticator value in an Access-Request packet SHOULD also be unpredictable, lest an attacker trick aserver into responding to a predicted future request, and then use the response to masquerade as that server to a future Access-Request.

Although protocols such as RADIUS are incapable of protecting against theft of an authenticated session via realtime active wiretapping attacks, generation of unique unpredictable requests can protect against a wide range of active attacks against authentication.

The NAS and RADIUS server share a secret. That shared secret followed by the Request Authenticator is put through a one-way MD5 hash to create a 16 octet digest value which is xored with the password entered by the user, and the xored result placed in the User-Password attribute in the Access-Request packet. See the entry for User-Password in the section on Attributes for a more detailed description.

#### Response Authenticator
The value of the Authenticator field in Access-Accept, Access-Reject, and Access-Challenge packets is called the Response Authenticator, and contains a one-way MD5 hash calculated over a stream of octets consisting of: the RADIUS packet, beginning with the Code field, including the Identifier, the Length, the Request Authenticator field from the Access-Request packet, and the response Attributes, followed by the shared secret.  That is ```ResponseAuth = MD5(Code+ID+Length+RequestAuth+Attributes+Secret)```, where + denotes concatenation.