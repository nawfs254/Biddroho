import http from 'http';

const BASE_URL = 'http://127.0.0.1:3000';
const CONCURRENT_USERS = 100;

const ROUTES = [
  '/',
  '/music',
  '/events',
  '/band',
  '/book',
  '/news',
  '/contact',
  '/media'
];

// Custom HTTP Agent with keepAlive for realistic connection pooling
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 150,
});

async function makeRequest(path, method = 'GET', body = null) {
  const start = performance.now();
  try {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'User-Agent': 'BIDDROHO-LoadTest-100Users/1.0',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      agent,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);
    const duration = performance.now() - start;
    await res.text(); // drain response body

    return {
      success: res.status >= 200 && res.status < 400,
      status: res.status,
      duration,
      path,
    };
  } catch (err) {
    const duration = performance.now() - start;
    return {
      success: false,
      status: 'ERR',
      duration,
      path,
      error: err.message,
    };
  }
}

// User Simulation Journey
async function simulateUser(userId) {
  const results = [];

  // 1. Visit homepage
  results.push(await makeRequest('/'));

  // 2. Visit random 2-3 content routes like a real browsing user
  const randomRoute1 = ROUTES[Math.floor(Math.random() * ROUTES.length)];
  const randomRoute2 = ROUTES[Math.floor(Math.random() * ROUTES.length)];
  results.push(await makeRequest(randomRoute1));
  results.push(await makeRequest(randomRoute2));

  // 3. Visit booking page
  results.push(await makeRequest('/book'));

  // 4. A subset of users attempts to submit booking inquiry (tests rate limit concurrency)
  if (userId % 5 === 0) {
    const submitResult = await makeRequest('/api/book', 'POST', {
      name: `Load Test User ${userId}`,
      email: `loadtest_${userId}@biddroho-test.com`,
      phone: '+880 1711-000000',
      eventDate: '2026-12-31',
      eventType: 'Rock Festival / Arena Concert',
      venue: 'National Stadium',
      city: 'Dhaka',
      expectedAudience: '15,000+ Stadium Scale',
      venueSetting: 'outdoor',
      eventNature: 'ticketed',
    });
    results.push(submitResult);
  }

  return results;
}

function calculatePercentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  const index = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, Math.min(index, sortedArr.length - 1))];
}

async function runLoadTest() {
  console.log('='.repeat(70));
  console.log(`🔥 BIDDROHO STRESS / LOAD TEST: ${CONCURRENT_USERS} CONCURRENT USERS AT A TIME`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Launching ${CONCURRENT_USERS} parallel virtual user sessions simultaneously...`);
  console.log('='.repeat(70));

  const overallStart = performance.now();

  // Launch all 100 users concurrently using Promise.all
  const userPromises = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i));
  }

  const allUserResults = await Promise.all(userPromises);
  const overallDuration = (performance.now() - overallStart) / 1000;

  // Flatten all individual requests
  const allRequests = allUserResults.flat();
  const durations = allRequests.map((r) => r.duration).sort((a, b) => a - b);

  // Group by status code
  const statusCounts = {};
  for (const r of allRequests) {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  }

  // Group by route
  const routeStats = {};
  for (const r of allRequests) {
    if (!routeStats[r.path]) {
      routeStats[r.path] = { count: 0, totalMs: 0, errors: 0 };
    }
    routeStats[r.path].count++;
    routeStats[r.path].totalMs += r.duration;
    if (!r.success && r.status !== 429) {
      routeStats[r.path].errors++;
    }
  }

  const totalRequests = allRequests.length;
  const successfulRequests = allRequests.filter((r) => r.success).length;
  const rateLimitedRequests = allRequests.filter((r) => r.status === 429).length;
  const failedRequests = allRequests.filter((r) => !r.success && r.status !== 429).length;

  const minLatency = durations[0].toFixed(1);
  const maxLatency = durations[durations.length - 1].toFixed(1);
  const avgLatency = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);
  const p50 = calculatePercentile(durations, 50).toFixed(1);
  const p90 = calculatePercentile(durations, 90).toFixed(1);
  const p95 = calculatePercentile(durations, 95).toFixed(1);
  const p99 = calculatePercentile(durations, 99).toFixed(1);
  const reqPerSec = (totalRequests / overallDuration).toFixed(1);

  console.log('\n📊 LOAD TEST EXECUTION RESULTS');
  console.log('-'.repeat(70));
  console.log(`Concurrent Active Users:  ${CONCURRENT_USERS}`);
  console.log(`Total Requests Dispatched: ${totalRequests}`);
  console.log(`Test Execution Duration:  ${overallDuration.toFixed(2)}s`);
  console.log(`Throughput (RPS):         ${reqPerSec} req/sec`);
  console.log(`Successful (2xx / 3xx):   ${successfulRequests} (${((successfulRequests / totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Rate-Limited (429 Shield):${rateLimitedRequests} (Expected protection on burst API spam)`);
  console.log(`Server Errors (5xx / ERR):${failedRequests}`);

  console.log('\n⏱️ LATENCY PERCENTILES');
  console.log('-'.repeat(70));
  console.log(`Minimum Latency:          ${minLatency} ms`);
  console.log(`p50 (Median):             ${p50} ms`);
  console.log(`Average Latency:          ${avgLatency} ms`);
  console.log(`p90 Latency:              ${p90} ms`);
  console.log(`p95 Latency:              ${p95} ms`);
  console.log(`p99 Latency:              ${p99} ms`);
  console.log(`Maximum Latency:          ${maxLatency} ms`);

  console.log('\n🌐 ROUTE PERFORMANCE BREAKDOWN');
  console.log('-'.repeat(70));
  console.log(
    'Route'.padEnd(16) +
    'Requests'.padStart(10) +
    'Avg Latency'.padStart(16) +
    'Errors'.padStart(10)
  );
  for (const [route, stats] of Object.entries(routeStats)) {
    const avg = (stats.totalMs / stats.count).toFixed(1) + ' ms';
    console.log(
      route.padEnd(16) +
      String(stats.count).padStart(10) +
      avg.padStart(16) +
      String(stats.errors).padStart(10)
    );
  }

  console.log('\n📋 HTTP STATUS CODE DISTRIBUTION');
  console.log('-'.repeat(70));
  for (const [code, count] of Object.entries(statusCounts)) {
    console.log(`HTTP ${code}: ${count} requests`);
  }
  console.log('='.repeat(70));
}

runLoadTest().catch(console.error);
