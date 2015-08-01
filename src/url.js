import _ from "lodash";
import pageJS from "./page-js";
import util from "js-util";


/**
 * Constructs a URL to a method.
 * @param {string} name: The unique name of the method.
 * @param {string} host: The host-name of the remote server.
 * @param {string} pattern: The URL route pattern.
 * @param {array} args: An array of arguments.
 */
export const getMethodUrl = (methodName, host, route, args) => {
  args = _.flatten(args);
  let url = route.path;

  // Convert arguments into URL.
  const urlParams = route.keys.map(item => item.name);
  if (urlParams.length > 0) {

    // Ensure enough arguments were passed.
    if (args.length < urlParams.length) {
      throw new Error(`Not enough arguments for method '${ methodName }'. The URL (${ url }) requires ${ urlParams.length }. Given args: [${ args }].`);
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



/**
 * Extracts the parameters from a URL.
 *
 *      For a URL pattern of "/foo/:id/edit?skip=:skip"
 *      the URL of "/foo/abc/edit?skip=10"
 *      would produce an:
 *          - an [id] of "abc"
 *          - a [skip] or 10.
 *
 * @param {object} route: The route definition to match with.
 * @param {string} url: The URL path to examine.
 * @return {array} of string values.
 */
export const getUrlParams = (route, url) => {
  let result = [];
  if (_.isString(url)) {

    // Split the URL into the [path] and [query-string].
    let [ path, queryString ] = url.split("?");
    const context = new pageJS.Context(path);

    // Perform reg-ex matching.
    // NB:  Only the path (not the query-string) is used to match.
    //      This prevents an error where page-js does not spot the path variables
    //      in the presence of a query-string.
    route = new pageJS.Route(route.path.split("?")[0]);
    route.match(context.path, context.params);
    const params = context.params;

    // Extract params from the query-string.
    if (!_.isEmpty(queryString)) {
      queryString.split("&").forEach(item => {
          let [key, value] = item.split("=");
          if (!_.isUndefined(value)) {
            params[key] = value;
          }
      });
    }

    // Process the params into the return array.
    _.keys(params).forEach(key => {
          let value = params[key];
          if (util.isNumeric(value)) {
            // Convert to number.
            value = parseFloat(value);
          } else {
            // Convert to boolean.
            switch (value) {
              case "true": value = true; break;
              case "false": value = false; break;
            }
          }
          result[key] = value;
          result.push(value);
    });
  }
  return result;
};
