/**
* Generates a standard URL for a method.
*
* @param basePath:    The base path to prefix the URL with.
* @param methodName:  The name of the method.
*
* @return string.
*/
export const methodUrl = (basePath, methodName) => {
  let url = `${ basePath }/${ methodName }`;
  url = '/' + url.replace(/^\/*/, '');
  return url;
};
