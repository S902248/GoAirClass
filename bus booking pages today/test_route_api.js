const http = require('http');

const BASE_URL = 'http://localhost:5000/api/trains';

function request(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(body)); }
                catch (e) { resolve(body); }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function testRouteAPI() {
    try {
        console.log('--- Testing Route APIs ---');
        
        // 1. Get all trains
        console.log('\n1. Fetching trains...');
        const trainsRes = await request(BASE_URL + '/');
        if (!trainsRes.success || !trainsRes.trains || trainsRes.trains.length === 0) {
            console.log('No trains found. Response:', JSON.stringify(trainsRes));
            return;
        }
        const train = trainsRes.trains[0];
        const trainId = train._id;
        console.log(`Using Train ID: ${trainId} (${train.name})`);

        // 2. Update Route
        console.log('\n2. Updating Route...');
        const routeData = {
            stops: [
                {
                    station: train.source._id,
                    arrivalTime: '08:00',
                    departureTime: '08:15',
                    stopNumber: 1,
                    distance: 0
                },
                {
                    station: train.destination._id,
                    arrivalTime: '12:00',
                    departureTime: '12:00',
                    stopNumber: 2,
                    distance: 300
                }
            ]
        };
        const updateRes = await request(`${BASE_URL}/route/${trainId}`, 'POST', routeData);
        console.log('Update Status:', updateRes.success ? 'Success' : 'Failed');

        // 3. Get Route
        console.log('\n3. Fetching updated Route...');
        const getRes = await request(`${BASE_URL}/route/${trainId}`);
        console.log('Fetch Status:', getRes.success ? 'Success' : 'Failed');
        if (getRes.route) {
            console.log(`Found ${getRes.route.stops.length} stops.`);
            console.log('Stops:', JSON.stringify(getRes.route.stops.map(s => ({ 
                num: s.stopNumber, 
                station: s.station.name,
                arr: s.arrivalTime,
                dep: s.departureTime
            })), null, 2));
        }

        console.log('\n--- Test Completed ---');
    } catch (error) {
        console.error('Error during testing:', error.message);
    }
}

testRouteAPI();
