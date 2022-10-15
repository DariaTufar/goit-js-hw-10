// npm i lodash.debounce
//  npm i notiflix

import './css/styles.css';
import debounce from '../node_modules/lodash.debounce';
import { Notify } from '../node_modules/notiflix';
import { fetchCountries } from './templateFunctions/fetchCountries';

const DEBOUNCE_DELAY = 300;

console.log('anything!!!!!!!!!');

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

console.log(input);

console.log(debounce);

function cleanMarkup(ref) {
  ref.innerHTML = '';
}

function inputHandler(e) {
  const textInput = e.target.value.trim();
  console.log(textInput);

  if (!textInput) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderMarkup(data) {
  if (data.length === 1) {
    cleanMarkup(listEl);
    const markupInfo = createInfoMarkup(data);
    countryInfo.innerHTML = markupInfo;
  } else {
    cleanMarkup(countryInfo);
    const markupList = createListMarkup(data);
    countryList.innerHTML = markupList;
  }
}

function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li>
        <img src="${flags.png}" 
        alt="${name.official}" 
        width="40" height="30">
        ${name.official}
        </li>`
    )
    .join('');
}

function createInfoMarkup(data) {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${
        name.official
      }" width="70" height="50">${name.official}</h1>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages)}</p>`
  );
}

input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
