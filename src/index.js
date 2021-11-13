import { fetchCountries } from './services';
import Notiflix from 'notiflix';
import './css/styles.css';
import debounce from 'lodash.debounce'
const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
inputRef.addEventListener('input', debounce(getCountry, DEBOUNCE_DELAY));
function getCountry() {
    listRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
    const nameCountry = inputRef.value.trim();
    if (!nameCountry) {
        return
    }
    fetchCountries(nameCountry).then(response => {
        if (!response.ok) {
            Notiflix.Notify.failure("Oops, there is no country with that name");
        }
        return response.json();
    }).then(countries => {
        if (countries.length > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            return
        }
        if (countries.length === 1) {
            return markupForOneCountry(countries);
        }
        else {
            return markupCountries(countries);
        }
    }).catch(console.log);
};
function markupForOneCountry(country) {
    const { flags, name, capital, languages, population } = country[0];
    const lang = Object.values(languages).join(', ');
    const markup = `<p><img src="${flags.svg}" alt="${name.common}" width="70px" height="40px"><span class="country-name">${name.common}</span><p>
        <ul class="list-information">
        <li class="list-information__item">Capital:<span class="content-item">${capital}</span></li>
        <li class="list-information__item">Population:<span class="content-item">${population}</span></li>
        <li class="list-information__item">Languages:<span class="content-item">${lang}</span></li>
        </ul>`
    return countryInfoRef.innerHTML = markup;
};
function markupCountries(countries) {
 listRef.innerHTML = countries.map(({name, flags}) => `<li class="country-list__item"><img src="${flags.svg}" width="40" height="40" alt="${name.common}" /><span class="countries-name">${name.common}</span></li>`).join('');
};

