var ipaddr = require('ipaddr.js');

exports.GetUserIP = (originIP) => {
  var ip = null;
  if (ipaddr.IPv4.isValid(originIP)) {
    ip = originIP;
  } else if (ipaddr.IPv6.isValid(originIP)) {
    var ipv6 = ipaddr.parse(originIP);
    if (ipv6.isIPv4MappedAddress()) {
      ip = ipv6.toIPv4Address().toString();
    } else {
      ip = ipv6.toString();
    }
  }
  return ip;
};
