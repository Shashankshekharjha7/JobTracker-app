const BASE_URL = 'http://localhost:3000';
let token = '';

async function testFullFlow() {
  try {
    // 1. Login
    console.log('1️⃣ Logging in...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('✅ Logged in! Token:', token.substring(0, 30) + '...\n');

    // 2. Create Job
    console.log('2️⃣ Creating job...');
    const createJobRes = await fetch(`${BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        company: 'Google',
        role: 'Software Engineer',
        status: 'APPLIED',
        location: 'Mountain View, CA'
      })
    });
    const job = await createJobRes.json();
    console.log('✅ Job created:', job, '\n');

    // 3. Get All Jobs
    console.log('3️⃣ Fetching all jobs...');
    const getJobsRes = await fetch(`${BASE_URL}/api/jobs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const jobs = await getJobsRes.json();
    console.log('✅ Total jobs:', jobs.length);
    console.log('Jobs:', jobs, '\n');

    // 4. Get Stats
    console.log('4️⃣ Fetching stats...');
    const statsRes = await fetch(`${BASE_URL}/api/jobs/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const stats = await statsRes.json();
    console.log('✅ Stats:', stats, '\n');

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFullFlow();