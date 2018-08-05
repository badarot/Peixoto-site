/*
 * Cria a função formToJSON, que gera um json apartir de um formulário
 * Retirado do site: https://code.lengstorf.com/get-form-values-as-json/
 */


/*
 * Checks that an element has a non-empty `name` and `value` property.
 * @param  {Element} element  the element to check
 * @return {Bool}             true if the element is an input, false if not
 */
var isValidElement = function isValidElement(element) {
  return element.name && element.value;
};

/**
 * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the value should be added, false if not
 */
var isValidValue = function isValidValue(element) {
  return !['checkbox', 'radio'].includes(element.type) || element.checked;
};

/**
 * Checks if an input is a checkbox, because checkboxes allow multiple values.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a checkbox, false if not
 */
var isCheckbox = function isCheckbox(element) {
  return element.type === 'checkbox';
};

/**
 * Checks if an input is a `select` with the `multiple` attribute.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a multiselect, false if not
 */
var isMultiSelect = function isMultiSelect(element) {
  return element.options && element.multiple;
};

/**
 * Checa se o value do input deve ser adcionado a uma lista.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is contains 'list' in the name
 */
var isList = function isList(element) {
  return /list/.test(element.name)
};

/**
 * Retrieves the selected options from a multi-select as an array.
 * @param  {HTMLOptionsCollection} options  the options for the select
 * @return {Array}                          an array of selected option values
 */
var getSelectValues = function getSelectValues(options) {
  return [].reduce.call(options, function (values, option) {
    return option.selected ? values.concat(option.value) : values;
  }, []);
};

/**
 * A more verbose implementation of `formToJSON()` to explain how it works.
 *
 * NOTE: This function is unused, and is only here for the purpose of explaining how
 * reducing form elements works.
 *
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
var formToJSON_deconstructed = function formToJSON_deconstructed(elements) {

  // This is the function that is called on each element of the array.
  var reducerFunction = function reducerFunction(data, element) {

    // Add the current field to the object.
    data[element.name] = element.value;

    // For the demo only: show each step in the reducer’s progress.
    console.log(JSON.stringify(data));

    return data;
  };

  // This is used as the initial value of `data` in `reducerFunction()`.
  var reducerInitialValue = {};

  // To help visualize what happens, log the inital value, which we know is `{}`.
  console.log('Initial `data` value:', JSON.stringify(reducerInitialValue));

  // Now we reduce by `call`-ing `Array.prototype.reduce()` on `elements`.
  var formData = [].reduce.call(elements, reducerFunction, reducerInitialValue);

  // The result is then returned for use elsewhere.
  return formData;
};

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
var formToJSON = function formToJSON(elements) {
  return [].reduce.call(elements, function (data, element) {

    // Make sure the element has the required properties and should be added.
    if (isValidElement(element) && isValidValue(element)) {

      /*
       * Some fields allow for more than one value, so we need to check if this
       * is one of those fields and, if so, store the values as an array.
       */
      if (isCheckbox(element)) {
        data[element.name] = (data[element.name] || []).concat(element.value);
      } else if (isMultiSelect(element)) {
        data[element.name] = getSelectValues(element);
      } else if (isList(element)) {
        key = /\d+/.exec(element.name);
        data[key] = (data[key] || []).concat(element.value);
      } else {
        data[element.name] = element.value;
      }
    }

    // For the demo only: show each step in the reducer’s progress.

    return data;
  }, {});
};
