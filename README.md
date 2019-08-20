# RADIUS Monitor
A basic implementation of the RADIUS server ([RFC2865](https://tools.ietf.org/html/rfc2865))

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