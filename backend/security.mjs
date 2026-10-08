import dns from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

export function publicAddress(value) {
  try {
    let ip = ipaddr.parse(value.replace(/^\[|\]$/g, ''));
    if (ip.kind() === 'ipv6' && ip.isIPv4MappedAddress()) ip = ip.toIPv4Address();
    return ip.range() === 'unicast';
  } catch { return false; }
}
export async function validateUrl(value, lookup = dns.lookup) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Use a public HTTP or HTTPS URL without credentials.');
  if (url.port && !['80', '443'].includes(url.port)) throw new Error('Only standard website ports are supported.');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  const addresses = ipaddr.isValid(host) ? [{address: host}] : await lookup(host, {all: true});
  if (!addresses.length || addresses.some(a => !publicAddress(a.address))) throw new Error('Private, local and reserved network destinations are blocked.');
  return url.href;
}
export function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
