const codes = require("./codes");
const attributes = require("./attributes");
const protocol = require("./protocol");

function bufferToPacket(buffer) {
  const packet = {attributes: {}};

  if (buffer.length < protocol.AUTHENTICATOR_OFFSET + protocol.AUTHENTICATOR_LENGTH)
    return {error: `Error buffer length [${buffer.length}]`};

  packet.code = codes.getCodeName(buffer[protocol.CODE_OFFSET]);
  packet.identifier = buffer[protocol.IDENTIFIER_OFFSET];
  packet.length = (buffer[protocol.LENGTH_OFFSET_HIGH] << 8) | buffer[protocol.LENGTH_OFFSET_LOW];
  packet.authenticator = buffer.slice(protocol.AUTHENTICATOR_OFFSET,
              protocol.AUTHENTICATOR_OFFSET + protocol.AUTHENTICATOR_LENGTH).toString("hex");

  let attributesOffset = protocol.ATTRIBUTES_OFFSET;
  let attributeName;
  let attributeLength;

  while(attributesOffset < buffer.length) {
    attributeName = attributes.getAttributeName(buffer[attributesOffset]);
    attributesOffset ++;

    if (attributesOffset < buffer.length) {
      attributeLength = buffer[attributesOffset] - 2;
      attributesOffset ++;

      if (attributeLength >=0 && attributesOffset + attributeLength <= buffer.length) {
        packet.attributes[attributeName] = buffer.slice(attributesOffset, attributesOffset + attributeLength).toString("hex");
      } else break;

      attributesOffset += attributeLength;
    } else break;
  }
  return packet;
}

function attributesToBuffer(params) {
  let attributesBuf = Buffer.alloc(0);

  for (const attributeName in params) {
    const attributeCodeBuf = Buffer.from([attributes.getAttributeType(attributeName)]);
    const attributeValueBuf = Buffer.from(params[attributeName], "hex");
    const attributeLength = attributeValueBuf.length + 2;
    const attributeValueLengthBuf = Buffer.from([attributeLength]);

    if (attributeLength <= 0xFF)
      attributesBuf = Buffer.concat([attributesBuf, attributeCodeBuf, attributeValueLengthBuf, attributeValueBuf]);
  }  

  return attributesBuf;
}

function packetToBuffer(packet) {
  const code = packet.code || "";
  const codeBuf = Buffer.from([codes.getCodeValue(code)]);

  const identifier = packet.identifier || 0;
  const identifierBuf = Buffer.from([identifier]);

  const authenticator = packet.authenticator || "";
  const authenticatorBuf = Buffer.from(authenticator, "hex");

  const attributes = packet.attributes || {};
  const attributesBuf = attributesToBuffer(attributes);

  const length = codeBuf.length + identifierBuf.length + protocol.LENGTH_LENGTH +
                  authenticatorBuf.length + attributesBuf.length;
  const lengthBuf = Buffer.from([(length >> 8) & 0x00FF, length & 0x00FF]);

  return Buffer.concat([codeBuf, identifierBuf, lengthBuf, authenticatorBuf, attributesBuf]);
}

module.exports = {
  bufferToPacket: bufferToPacket,
  packetToBuffer: packetToBuffer,
  attributesToBuffer: attributesToBuffer,
}
