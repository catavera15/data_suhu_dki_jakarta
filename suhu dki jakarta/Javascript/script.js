let myChart = null;

let defaultWeatherData = [
    { x: 1,  year: 2011, month: 1,  y: 27.30 },
    { x: 2,  year: 2011, month: 2,  y: 27.40 },
    { x: 3,  year: 2011, month: 3,  y: 27.90 },
    { x: 4,  year: 2011, month: 4,  y: 28.60 },
    { x: 5,  year: 2011, month: 5,  y: 28.80 },
    { x: 6,  year: 2011, month: 6,  y: 28.70 },
    { x: 7,  year: 2011, month: 7,  y: 28.30 },
    { x: 8,  year: 2011, month: 8,  y: 28.80 },
    { x: 9,  year: 2011, month: 9,  y: 29.00 },
    { x: 10, year: 2011, month: 10, y: 29.20 },
    { x: 11, year: 2011, month: 11, y: 28.90 },
    { x: 12, year: 2011, month: 12, y: 28.90 },
    { x: 13, year: 2012, month: 1,  y: 27.30 },
    { x: 14, year: 2012, month: 2,  y: 27.90 },
    { x: 15, year: 2012, month: 3,  y: 28.00 },
    { x: 16, year: 2012, month: 4,  y: 28.10 },
    { x: 17, year: 2012, month: 5,  y: 28.30 },
    { x: 18, year: 2012, month: 6,  y: 28.40 },
    { x: 19, year: 2012, month: 7,  y: 27.90 },
    { x: 20, year: 2012, month: 8,  y: 28.10 },
    { x: 21, year: 2012, month: 9,  y: 28.50 },
    { x: 22, year: 2012, month: 10, y: 29.10 },
    { x: 23, year: 2012, month: 11, y: 28.10 },
    { x: 24, year: 2012, month: 12, y: 28.00 }
];

function processAndRender(data) {
    if (!data || data.length === 0) return;

    const n = data.length;
    let sumX = 0, sumY = 0, sumX2 = 0, sumXY = 0;

    data.forEach(item => {
        const xVal = Number(item.x) || 0;
        const yVal = Number(item.y) || 0;
        sumX += xVal;
        sumY += yVal;
        sumX2 += (xVal * xVal);
        sumXY += (xVal * yVal);
    });

    const b = ((n * sumXY) - (sumX * sumY)) / ((n * sumX2) - (sumX * sumX)) || 0;
    const a = (sumY - (b * sumX)) / n || 0;

    const elN = document.getElementById('val-n');
    const elA = document.getElementById('val-a');
    const elB = document.getElementById('val-b');
    const elModel = document.getElementById('val-model');

    if (elN) elN.innerText = `${n} Bulan`;
    if (elA) elA.innerText = `${a.toFixed(3)} °C`;
    if (elB) elB.innerText = `${b >= 0 ? '+' : ''}${b.toFixed(3)} °C`;
    if (elModel) elModel.innerText = `Y = ${a.toFixed(2)} + ${b.toFixed(3)}X`;

    const tableBody = document.getElementById('table-body');
    if (tableBody) tableBody.innerHTML = "";
    
    let chartLabels = [];
    let actualData = [];
    let regressionData = [];

    data.forEach(item => {
        const x = Number(item.x);
        const y = Number(item.y);
        const x2 = x * x;
        const xy = x * y;
        const lry = a + (b * x);
        const ea = y - lry;

        // Format label sumbu X agar rapi (Bulan di atas, Tahun di bawah)
        chartLabels.push([String(item.month), String(item.year)]);
        actualData.push(y);
        regressionData.push(Number(lry.toFixed(2)));

        if (tableBody) {
            tableBody.innerHTML += `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                    <td class="px-3 py-2 font-semibold">${x}</td>
                    <td class="px-3 py-2">${item.year}</td>
                    <td class="px-3 py-2">${item.month}</td>
                    <td class="px-3 py-2 font-medium text-slate-800">${y.toFixed(2)}</td>
                    <td class="px-3 py-2 text-slate-500">${x2}</td>
                    <td class="px-3 py-2 text-slate-500">${xy.toFixed(2)}</td>
                    <td class="px-3 py-2 font-semibold text-indigo-600">${lry.toFixed(2)}</td>
                    <td class="px-3 py-2 text-slate-500">${ea.toFixed(2)}</td>
                </tr>
            `;
        }
    });

    const lastX = Number(data[data.length - 1].x) || data.length;
    const lastYear = Number(data[data.length - 1].year) || 2012;
    const lastMonth = Number(data[data.length - 1].month) || 12;

    for (let i = 1; i <= 3; i++) {
        let fX = lastX + i;
        let fMonth = lastMonth + i;
        let fYear = lastYear;
        if (fMonth > 12) {
            fMonth -= 12;
            fYear += 1;
        }
        const lry = a + (b * fX);

        chartLabels.push([String(fMonth), `${fYear} (P)`]);
        actualData.push(null);
        regressionData.push(Number(lry.toFixed(2)));

        if (tableBody) {
            tableBody.innerHTML += `
                <tr class="bg-indigo-50/70 font-semibold text-indigo-900 border-b border-indigo-100">
                    <td class="px-3 py-2">${fX}</td>
                    <td class="px-3 py-2">${fYear}</td>
                    <td class="px-3 py-2">${fMonth}</td>
                    <td class="px-3 py-2 text-slate-400 italic">Prediksi</td>
                    <td class="px-3 py-2 text-slate-400">-</td>
                    <td class="px-3 py-2 text-slate-400">-</td>
                    <td class="px-3 py-2 text-indigo-700 font-bold">${lry.toFixed(2)}</td>
                    <td class="px-3 py-2 text-slate-400">-</td>
                </tr>
            `;
        }
    }

    const canvas = document.getElementById('regressionChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (myChart) myChart.destroy();

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        label: 'rata rata cuaca (Y)',
                        data: actualData,
                        borderColor: '#eab308',
                        backgroundColor: '#eab308',
                        borderWidth: 2.5,
                        tension: 0.1,
                        pointRadius: 4,
                        spanGaps: true
                    },
                    {
                        label: 'LR(Y)',
                        data: regressionData,
                        borderColor: '#1e3a8a',
                        backgroundColor: '#1e3a8a',
                        borderWidth: 2.5,
                        pointRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: { size: 13, weight: '500' }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: true, color: '#e2e8f0' },
                        ticks: {
                            font: { size: 11, weight: '500' },
                            maxRotation: 0, // KUNCI: Membuat teks tetap lurus horizontal (tidak miring)
                            minRotation: 0
                        }
                    },
                    y: {
                        min: 26,
                        max: 30,
                        ticks: { stepSize: 0.5 }
                    }
                }
            }
        });
    }
}

processAndRender(defaultWeatherData);

fetch('data_suhu.xlsx')
    .then(response => {
        if (!response.ok) throw new Error("File tidak ditemukan");
        return response.arrayBuffer();
    })
    .then(buffer => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonRows.length < 2) return;

        const headers = jsonRows[0].map(h => String(h).trim().toLowerCase());
        let idxX = headers.findIndex(h => h.includes('no') || h === 'x');
        let idxYear = headers.findIndex(h => h.includes('tahun') || h.includes('year'));
        let idxMonth = headers.findIndex(h => h.includes('bulan') || h.includes('month'));
        let idxY = headers.findIndex(h => h.includes('suhu') || h.includes('y') || h.includes('asli') || h.includes('rata'));

        if (idxX === -1) idxX = 0;
        if (idxYear === -1) idxYear = 1;
        if (idxMonth === -1) idxMonth = 2;
        if (idxY === -1) idxY = 3;

        let formattedData = [];
        for (let i = 1; i < jsonRows.length; i++) {
            let row = jsonRows[i];
            if (!row || row.length === 0) continue;

            let valX = Number(row[idxX]) || i;
            let valYear = Number(row[idxYear]) || 2011;
            let valMonth = Number(row[idxMonth]) || ((i - 1) % 12) + 1;
            let valY = Number(row[idxY]);

            if (!isNaN(valY)) {
                formattedData.push({ x: valX, year: valYear, month: valMonth, y: valY });
            }
        }

        if (formattedData.length > 0) {
            processAndRender(formattedData);
        }
    })
    .catch(() => {});