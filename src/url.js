import _ from "lodash";


/**
 * Constructs a URL to a method.
 * @param {string} host: The host-name of the remote server.
 * @param {string} pattern: The URL route pattern.
 * @param {array} args: An array of arguments.
 */
export const getMethodUrl = (host, route, args) => {
  args = _.flatten(args);
  let url = route.path;

  // Convert arguments into URL.
  const urlParams = route.keys.map(item => item.name);
  if (urlParams.length > 0) {

    // Ensure enough arguments were passed.
    if (args.length < urlParams.length) {
      throw new Error(`Not enough arguments. The URL (${ url }) requires ${ urlParams.length }.`);
    }

    // Construct the string.
    let i = 0;
    urlParams.forEach(key => {
        key = `:${ key }`;
        let index = url.indexOf(key);
        url = `${ url.substr(0, index) }${ args[i] }${ url.substring(index + key.length, url.length) }`;
        i += 1;
    });
  }

  // Prepend the host (if one exists).
  // NOTE: This is only required when doing server-to-server communications.
  if (host) { url = host + url; }

  // Finish up.
  return url;
};
