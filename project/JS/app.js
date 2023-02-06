const app = document.querySelector('.app');
const popup = document.querySelector('.popup');
const textInput = document.querySelector('.form-input');
const btnInput = document.querySelector('.form');

const link = 'https://api.openweathermap.org/data/2.5/weather?&appid=8379da078b2e9f6b46beec17eb0c2c7e';

let store = {
    temp: 0,
    name: 'Tokyo',
    country: 0,
    weather: {
        main: '',
    },
    properties: {
        visibility: {},
        speed: {},
        feelsLike: {},
        tempMax: {}
    },
    
};


const fetchData = async () => {
    const result = await fetch(`${link}&q=${store.name}`);
    const data = await result.json();
    
    const {
        main: {
            temp,
            feels_like: feelsLike,
            temp_max: tempMax,
        },
        sys: {
            country,
        },
        visibility,
        wind: {
            speed,
        },
        weather: [
            {
                main
            }
        ]

    } = data; // диструктуризация обьекта

    
    store = {
        ...store,
        temp: `${Math.round(temp - 273)} `,

        country: 0,
        weather: [
            {
                main: `${main}`,
            }
        ],
        properties: {
               tempMax: `${Math.round(tempMax - 273)} °`,
               visibility: `${visibility/1000} km`,
               speed: `${speed} km/h`,
               feelsLike: `${Math.round(feelsLike - 273)} °`,
            },
    };

    renderContent();
};



const getMainWeather = (weather) => {
    return Object.values(weather).map(({main}) => {
        if(main.includes("Clouds")){
            return '03d@2x.png';
        }
        if(main.includes("Thunderstorm")){
            return '11d@2x.png';
        }
        if(main.includes("Drizzle")){
            return '10d@2x.png';
        }
        if(main.includes("Rain")){
            return '09d2x.png';
        }
        if(main.includes("Snow")){
            return '13d@2x.png';
        }
        if(main.includes("Clear")){
            return '01d@2x.png';
        }
    });

   
};

const renderProperty = (properties ) => {
    const {tempMax, visibility, speed, feelsLike} = properties;

    return ` <div class="weather__more">
                <div class="weather__temperatura item">
                    <img src="Image/temperature-feels-like.svg" alt="Temperature" width='20px' height='20px'>
                    <h2>${feelsLike}</h2>
                </div>
                <div class="weather__humidity item">
                    <img src="./Image/high-temperature.png" alt="Wet" width='20px' height='20px'>
                    <h2>${tempMax}</h2>
                </div>
                <div class="weather__visibility item">
                    <img src="Image/Mountain.png" alt="Mountain" width='20px' height='20px'>
                    <h2>${visibility}</h2>
                </div>
                <div class="weather__sw item">
                    <img src="Image/Wind.png" alt="Wind" width='20px' height='20px'>
                    <h2>${speed}</h2>
                </div>
            </div>`;
};
const markup = () => {

    const {
        name,
        temp,
        country,
        properties,
        weather
    } = store;    

    return `<div class="weather">
                <div class="weather__title">
                    <h1 class="weather__title-citi">
                        ${name}
                    </h1>
                </div>
                    <div class="weather__deg">
                        ${temp}°
                    </div>
                    <div class="weather__description">
                        ${weather[0].main}
                    </div>
                <div class="weather__state">
                    <img src="./Image/${getMainWeather(weather)}" alt="state">
                </div>

            <div class="weather__prop">
            ${renderProperty(properties)}
            </div>
        </div>
        `;
};

const addClassPops = () => {
    popup.classList.add('active');
};
const removeClassPops = () => {
    popup.classList.remove('active');
};

const renderContent = () => {
    app.innerHTML = markup();

    const citi = document.querySelector('.weather__title-citi');
    const close = document.querySelector('.popup-close__img');
    citi.addEventListener('click', addClassPops);
    close.addEventListener('click', removeClassPops);
};


const changeInput = (e) => {
    store = {
        ...store,
        name: e.target.value,
    };
};

const changeSubmit = (e) => {
    e.preventDefault();

    const value = store.name;
    if (!value) return null;

    fetchData();
    removeClassPops();
};


textInput.addEventListener('input', changeInput);
btnInput.addEventListener('submit', changeSubmit);

fetchData();