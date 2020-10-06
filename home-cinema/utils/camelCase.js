/* eslint-disable no-param-reassign */

const mapObj = require('map-obj');
const QuickLru = require('quick-lru');

const preserveCamelCase = string => {
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;

  for (let i = 0; i < string.length; i++) {
    const character = string[i];

    if (
      isLastCharLower &&
      /[a-zA-Z]/.test(character) &&
      character.toUpperCase() === character
    ) {
      string = `${string.slice(0, i)}-${string.slice(i)}`;
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i++;
    } else if (
      isLastCharUpper &&
      isLastLastCharUpper &&
      /[a-zA-Z]/.test(character) &&
      character.toLowerCase() === character
    ) {
      string = `${string.slice(0, i - 1)}-${string.slice(i - 1)}`;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower = character.toLowerCase() === character;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = character.toUpperCase() === character;
    }
  }

  return string;
};

const camelCase = (input, options) => {
  if (!(typeof input === 'string' || Array.isArray(input))) {
    throw new TypeError('Expected the input to be `string | string[]`');
  }

  options = Object.assign(
    {
      pascalCase: false,
    },
    options,
  );

  const postProcess = x =>
    options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;

  if (Array.isArray(input)) {
    input = input
      .map(x => x.trim())
      .filter(x => x.length)
      .join('-');
  } else {
    input = input.trim();
  }

  if (input.length === 0) {
    return '';
  }

  if (input.length === 1) {
    return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
  }

  if (/^[a-z\d]+$/.test(input)) {
    return postProcess(input);
  }

  const hasUpperCase = input !== input.toLowerCase();

  if (hasUpperCase) {
    input = preserveCamelCase(input);
  }

  input = input
    .replace(/^[_\- ]+/, '')
    .toLowerCase()
    .replace(/[_\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());

  return postProcess(input);
};

const has = (array, key) =>
  array.some(x => (typeof x === 'string' ? x === key : x.test(key)));
const cache = new QuickLru({ maxSize: 100000 });

const camelCaseConvert = (input, options) => {
  options = Object.assign(
    {
      deep: false,
    },
    options,
  );

  const { exclude } = options;

  return mapObj(
    input,
    (key, value) => {
      if (!(exclude && has(exclude, key))) {
        if (cache.has(key)) {
          key = cache.get(key);
        } else {
          const ret = camelCase(key);

          if (key.length < 100) {
            // Prevent abuse
            cache.set(key, ret);
          }

          key = ret;
        }
      }

      return [key, value];
    },
    { deep: options.deep },
  );
};

function camelCaseKeys(input, options) {
  if (Array.isArray(input)) {
    return Object.keys(input).map(key => camelCaseConvert(input[key], options));
  }
  return camelCaseConvert(input, options);
}

module.exports = {
  camelCase,
  camelcase: camelCase,
  camelCaseKeys,
  camelcaseKeys: camelCaseKeys,
};
