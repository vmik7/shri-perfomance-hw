const GUID = '4bdb7ac4-23e8-4de3-b728-410baf9f1abd';
const Metrics = {
    connect: 'connect',
    ttfb: 'ttfb',
    fp: 'fp',
    fcp: 'fcp',
    buildListLoaded: 'buildListLoaded',
    settingsLoaded: 'settingsLoaded',
    showMoreButtonPressed: 'showMoreButtonPressed',
};

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
function showMetricByPeriod(data, page, name, start, finish) {
    console.group(
        `Просмотр метрики '${name}' в период c ${start} по ${finish}`,
    );

    const dateStart = new Date(start);
    const dateFinish = new Date(finish);

    const sampleData = data
        .filter((item) => {
            const dateCurrent = new Date(item.date);
            return (
                item.page === page &&
                item.name === name &&
                dateStart <= dateCurrent &&
                dateCurrent <= dateFinish
            );
        })
        .map((item) => item.value);

    if (sampleData.length) {
        const result = {
            name,
            period: `[${start}, ${finish}]`,
            hits: sampleData.length,
            p25: quantile(sampleData, 0.25),
            p50: quantile(sampleData, 0.5),
            p75: quantile(sampleData, 0.75),
            p95: quantile(sampleData, 0.95),
        };
        console.table(result);
    } else {
        console.error(`В этот день метрика '${name}' не измерялась :(`);
    }
    console.groupEnd();
}

// показать сессию пользователя
function showSession(data, page, session) {
    console.group(`Просмотр метрик сессии [id = ${session}]`);
    const sampleData = data.filter((item) => {
        return item.page === page && item.requestId === session;
    });
    if (sampleData.length) {
        const result = {
            browser: sampleData[0].additional.browser,
            platform: sampleData[0].additional.platform,
            date: sampleData[0].date,
        };
        for (const metric of sampleData) {
            result[metric.name] = metric.value;
        }
        console.table(result);
    } else {
        console.error('Сессия не найдена :(');
    }
    console.groupEnd();
}

// сравнить метрику в разных срезах (платформы)
function metricAcrossPlatforms(data, page, name) {
    console.group(`Сравнение метрики '${name}' по платформам`);
    const sampleData = data
        .filter((item) => item.name === name && item.page === page)
        .reduce((result, current) => {
            const platform = current.additional.platform;
            if (!Object.keys(result).includes(platform)) {
                result[platform] = [];
            }
            result[platform].push(current.value);
            return result;
        }, {});
    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const values = [...sampleData[key]];
            sampleData[key] = {
                hits: values.length,
                p25: quantile(values, 0.25),
                p50: quantile(values, 0.5),
                p75: quantile(values, 0.75),
                p95: quantile(values, 0.95),
            };
        }
    }
    console.table(sampleData);
    console.groupEnd();
}

// сравнить метрику в разных срезах (браузеры)
function metricAcrossBrowsers(data, page, name) {
    console.group(`Сравнение метрики '${name}' по браузерам`);
    const sampleData = data
        .filter((item) => item.name === name && item.page === page)
        .reduce((result, current) => {
            const browser = current.additional.browser;
            if (!Object.keys(result).includes(browser)) {
                result[browser] = [];
            }
            result[browser].push(current.value);
            return result;
        }, {});
    for (const key in sampleData) {
        if (Object.prototype.hasOwnProperty.call(sampleData, key)) {
            const values = [...sampleData[key]];
            sampleData[key] = {
                hits: values.length,
                p25: quantile(values, 0.25),
                p50: quantile(values, 0.5),
                p75: quantile(values, 0.75),
                p95: quantile(values, 0.95),
            };
        }
    }
    console.table(sampleData);
    console.groupEnd();
}

// рассчитать метрику за выбранный день
function calcMetricByDate(data, page, name, date) {
    console.group(`Просмотр метрики '${name}' за ${date}`);
    const sampleData = data
        .filter((item) => {
            return (
                item.page === page && item.name === name && item.date === date
            );
        })
        .map((item) => item.value);

    if (sampleData.length) {
        const result = {
            name,
            date,
            hits: sampleData.length,
            p25: quantile(sampleData, 0.25),
            p50: quantile(sampleData, 0.5),
            p75: quantile(sampleData, 0.75),
            p95: quantile(sampleData, 0.95),
        };
        console.table(result);
    } else {
        console.error(`В этот день метрика '${name}' не измерялась :(`);
    }
    console.groupEnd();
}

fetch(`https://shri.yandex/hw/stat/data?counterId=${GUID}`)
    .then((res) => res.json())
    .then((result) => {
        const data = prepareData(result);

        showSession(data, 'index', '302951221015');
        calcMetricByDate(data, 'index', Metrics.buildListLoaded, '2021-07-06');
        showMetricByPeriod(
            data,
            'index',
            Metrics.showMoreButtonPressed,
            '2021-07-01',
            '2021-07-31',
        );
        metricAcrossPlatforms(data, 'index', Metrics.settingsLoaded);
        metricAcrossBrowsers(data, 'index', Metrics.fcp);
    });
