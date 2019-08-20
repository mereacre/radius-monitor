const codes = require("./codes");
const transform = require("./transform");
const protocol = require("./protocol");
const md5 = require("md5");

function compute(packet, password) {
  const code = packet.code || "";
  const codeBuf = Buffer.from([codes.getCodeValue(code)]);

  const identifier = packet.identifier || 0;
  const identifierBuf = Buffer.from([identifier]);

  const authenticator = packet.authenticator || "";
  const requestAuthBuf = Buffer.from(authenticator, "hex");

  const attributes = packet.attributes || {};
  const attributesBuf = transform.attributesToBuffer(attributes);

  const length = codeBuf.length + identifierBuf.length + protocol.LENGTH_LENGTH +
                  requestAuthBuf.length + attributesBuf.length;
  const lengthBuf = Buffer.from([(length >> 8) & 0x00FF, length & 0x00FF]);

  const passwordBuf = Buffer.from(password);

  const responseBuf = Buffer.concat([codeBuf, identifierBuf, lengthBuf, requestAuthBuf, attributesBuf, passwordBuf]);

  // ResponseAuth = MD5(Code+ID+Length+RequestAuth+Attributes+Secret)
  return md5(responseBuf);
}

module.exports.compute = compute;