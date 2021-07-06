const GUID = '4bdb7ac4-23e8-4de3-b728-410baf9f1abd';

function quantile(arr, q) {
    const sorted = arr.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined) {
        return Math.floor(
            sorted[base] + rest * (sorted[base + 1] - sorted[base]),
        );
    }
    return Math.floor(sorted[base]);
}

function prepareData(result) {
    return result.data.map((item) => {
        item.date = item.timestamp.split('T')[0];

        return item;
    });
}

// показать значение метрики за несколько день
function showMetricByPeriod() {}

// показать сессию пользователя
function showSession() {}

// сравнить метрику в разных срезах
function compareMetric() {}

// рассчитать метрику за выбранный день
function calcMetricByDate(data, page, name, date) {
    const sampleData = data
        .filter((item) => {
            return (
                item.page === page && item.name === name && item.date === date
            );
        })
        .map((item) => item.value);

    console.log(
        `${date} ${name}: p25=${quantile(sampleData, 0.25)} p50=${quantile(
            sampleData,
            0.5,
        )} p75=${quantile(sampleData, 0.75)} p90=${quantile(
            sampleData,
            0.95,
        )} hits=${sampleData.length}`,
    );
}

fetch(`https://shri.yandex/hw/stat/data?counterId=${GUID}`)
    .then((res) => res.json())
    .then((result) => {
        const data = prepareData(result);

        calcMetricByDate(data, 'index', 'connect', '2021-07-06');
        calcMetricByDate(data, 'index', 'ttfb', '2021-07-06');
        calcMetricByDate(data, 'index', 'buildListLoaded', '2021-07-06');

        // добавить свои сценарии, реализовать функции выше
        // ...
    });
