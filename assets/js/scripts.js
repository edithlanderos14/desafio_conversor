const input = document.querySelector('.input');
const select = document.querySelector('.select');
const button = document.querySelector('.buscar');
const span = document.querySelector('.resultado');
const canvas = document.querySelector('.grafico');

const url = "https://mindicador.cl/api";

let myChart = null;

function renderGrafico(data){
    const ctx = canvas.getContext('2d');
    if(myChart){
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((elem) => {
                const fecha = new Date(elem.fecha);
                return `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`; // Formato de fecha día/mes/año
            }),
            datasets: [{
                label: "Últimos 10 días",
                backgroundColor: 'green',
                data: data.map((elem) => elem.valor)
            }]
        }
    });
}

async function buscarCotizacion() {
    try {
        const moneda = select.value;
        const fetching = await fetch(`${url}/${moneda}`);
        const data = await fetching.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

button.addEventListener('click', async () => {
    const result = await buscarCotizacion();
    const serie = result.serie.slice(0, 10);
    const lastValue = serie[0].valor;
    const fecha = new Date(serie[0].fecha);

    span.innerHTML = `La cotización del día ${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()} es $${lastValue}`;
    renderGrafico(serie);
});
