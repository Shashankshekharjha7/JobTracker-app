import nlp from 'compromise';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// ============================================================================
// SKILL EXTRACTION - FREE LOCAL NLP (No API calls!)
// ============================================================================

const techSkills = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 
  'Swift', 'Kotlin', 'PHP', 'Scala', 'Dart', 'Perl', 'R', 'MATLAB', 'SQL',
  
  // Frontend
  'React', 'React.js', 'Vue', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML', 
  'CSS', 'Tailwind', 'TailwindCSS', 'Bootstrap', 'jQuery', 'Redux', 'MobX', 
  'Webpack', 'Vite', 'SASS', 'LESS', 'Material-UI', 'Chakra UI',
  
  // Backend
  'Node.js', 'Express', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring', 
  'Spring Boot', 'ASP.NET', 'Rails', 'Laravel', 'NestJS', 'Koa',
  
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB', 'Cassandra', 
  'Elasticsearch', 'Oracle', 'SQL Server', 'MariaDB', 'Neo4j', 'Firebase',
  
  // Cloud/DevOps
  'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 
  'GitLab', 'CircleCI', 'Terraform', 'Ansible', 'Puppet', 'Chef', 'CI/CD',
  
  // Tools & Platforms
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Confluence', 'Figma', 
  'Postman', 'VS Code', 'IntelliJ', 'Eclipse', 'Slack', 'Trello',
  
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin', 'Ionic',
  
  // Testing
  'Jest', 'Mocha', 'Cypress', 'Selenium', 'JUnit', 'PyTest', 'Postman',
  
  // APIs & Protocols
  'REST', 'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'SOAP', 'OAuth',
  
  // Architectures
  'Microservices', 'Monolithic', 'Serverless', 'Event-driven', 'MVC',
  
  // Methodologies
  'Agile', 'Scrum', 'Kanban', 'Waterfall', 'DevOps', 'TDD', 'BDD',
  
  // AI/ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  'NLP', 'Computer Vision', 'Neural Networks',
  
  // Other Tech
  'Linux', 'Unix', 'Windows Server', 'Nginx', 'Apache', 'RabbitMQ', 'Kafka',
  'WebRTC', 'Socket.io', 'Blockchain', 'Ethereum', 'Solidity'
];

const softSkills = [
  'Communication', 'Leadership', 'Problem Solving', 'Critical Thinking', 
  'Teamwork', 'Team Player', 'Time Management', 'Adaptability', 'Creativity', 
  'Collaboration', 'Work Ethic', 'Attention to Detail', 'Analytical', 
  'Decision Making', 'Conflict Resolution', 'Emotional Intelligence',
  'Public Speaking', 'Presentation', 'Negotiation', 'Mentoring'
];

export const extractSkillsFromJobDescription = async (jobDescription: string): Promise<string[]> => {
  if (!jobDescription || jobDescription.trim().length < 10) {
    console.log('⚠️ Job description too short, skipping extraction');
    return [];
  }

  console.log('🔍 Extracting skills using local NLP (FREE, no API)...');
  
  const foundSkills = new Set<string>();
  const lowerDesc = jobDescription.toLowerCase();

  techSkills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    const patterns = [
      new RegExp(`\\b${lowerSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
      new RegExp(`\\b${lowerSkill.replace(/\./g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
    ];
    if (patterns.some(pattern => pattern.test(jobDescription))) {
      foundSkills.add(skill);
    }
  });

  softSkills.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(jobDescription)) {
      foundSkills.add(skill);
    }
  });

  const experiencePatterns = [
    /(\d+)\+?\s*(?:to|\-|–)?\s*\d*\s*years?\s+(?:of\s+)?experience/gi,
    /(\d+)\+\s*years/gi,
    /minimum\s+(\d+)\s+years/gi,
    /at\s+least\s+(\d+)\s+years/gi,
  ];

  experiencePatterns.forEach(pattern => {
    const matches = jobDescription.matchAll(pattern);
    for (const match of matches) {
      foundSkills.add(`${match[1]}+ years experience`);
    }
  });

  if (/bachelor'?s?|BS|BA|undergraduate|B\.S\.|B\.A\./i.test(jobDescription)) foundSkills.add("Bachelor's Degree");
  if (/master'?s?|MS|MA|graduate|M\.S\.|M\.A\./i.test(jobDescription)) foundSkills.add("Master's Degree");
  if (/phd|doctorate|ph\.d\./i.test(jobDescription)) foundSkills.add("PhD");

  const certifications = ['AWS Certified', 'Azure Certified', 'PMP', 'Scrum Master', 'CISSP'];
  certifications.forEach(cert => {
    if (new RegExp(cert, 'gi').test(jobDescription)) foundSkills.add(cert);
  });

  const skillsArray = Array.from(foundSkills);
  console.log(`✅ Extracted ${skillsArray.length} skills:`, skillsArray);
  return skillsArray;
};

// ============================================================================
// HARD TECHNICAL QUESTION BANK — No API needed, always free
// ============================================================================

const skillQuestionBank: Record<string, Array<{ question: string; difficulty: string }>> = {
  'React': [
    { question: 'Explain the reconciliation algorithm in React. How does the virtual DOM diffing work under the hood, and what are its time complexity implications?', difficulty: 'Hard' },
    { question: 'How would you implement a custom hook that prevents unnecessary re-renders while keeping state in sync across multiple components? Walk me through your approach with code.', difficulty: 'Hard' },
    { question: 'Explain the difference between useLayoutEffect and useEffect. In what scenarios would using the wrong one cause visual glitches or bugs?', difficulty: 'Hard' },
    { question: 'How does React Fiber improve over the old stack reconciler? What is "time slicing" and how does it help with large component trees?', difficulty: 'Hard' },
    { question: 'Design a scalable state management solution for a large React app without using any external library. What trade-offs would you make?', difficulty: 'Hard' },
  ],
  'TypeScript': [
    { question: 'Explain the difference between `unknown` and `any`. Write a type-safe function that narrows an `unknown` input to a specific union type using type guards.', difficulty: 'Hard' },
    { question: 'What are conditional types in TypeScript? Implement a `DeepPartial<T>` utility type that recursively makes all properties optional.', difficulty: 'Hard' },
    { question: 'How does TypeScript\'s structural typing differ from nominal typing? When can this cause unexpected type compatibility issues?', difficulty: 'Hard' },
    { question: 'Explain variance in TypeScript generics — covariance, contravariance, and invariance. Give a real-world example where getting this wrong causes a runtime bug.', difficulty: 'Hard' },
    { question: 'Implement a type-safe event emitter in TypeScript where event names and their payload types are strictly enforced at compile time.', difficulty: 'Hard' },
  ],
  'Node.js': [
    { question: 'Explain the Node.js event loop in detail — all 6 phases. What is the difference between `process.nextTick` and `setImmediate`, and when would misusing them cause starvation?', difficulty: 'Hard' },
    { question: 'How would you debug a Node.js memory leak in production? Walk through your tooling, methodology, and how you\'d identify the leaking reference.', difficulty: 'Hard' },
    { question: 'Explain backpressure in Node.js streams. How does it work, and what happens if you ignore it when piping a large file?', difficulty: 'Hard' },
    { question: 'How does the Node.js cluster module work? What are its limitations compared to running separate processes behind a load balancer?', difficulty: 'Hard' },
    { question: 'Design a rate limiter in Node.js that works across multiple instances without a centralized store. What are the trade-offs of your approach?', difficulty: 'Hard' },
  ],
  'PostgreSQL': [
    { question: 'Explain the difference between MVCC and locking-based concurrency. How does PostgreSQL\'s MVCC implementation handle write skew anomalies?', difficulty: 'Hard' },
    { question: 'You have a query that takes 10 seconds on a table with 50M rows. Walk me through your full optimization process — from EXPLAIN ANALYZE output to index strategy.', difficulty: 'Hard' },
    { question: 'What is the difference between a Hash Join, Nested Loop Join, and Merge Join in PostgreSQL? When does the query planner choose each one?', difficulty: 'Hard' },
    { question: 'Explain PostgreSQL\'s WAL (Write-Ahead Log). How is it used for crash recovery, replication, and point-in-time recovery?', difficulty: 'Hard' },
    { question: 'How would you design a partitioning strategy for a 500GB time-series table? What are the trade-offs between range, list, and hash partitioning?', difficulty: 'Hard' },
  ],
  'AWS': [
    { question: 'Explain the difference between SQS Standard and FIFO queues. How would you design an idempotent consumer to handle duplicate message delivery?', difficulty: 'Hard' },
    { question: 'You are seeing intermittent 5xx errors from an ALB. Walk through your entire debugging process — what metrics, logs, and AWS tools would you use?', difficulty: 'Hard' },
    { question: 'Design a multi-region active-active architecture on AWS for a financial application with strict RPO=0 and RTO<30s requirements.', difficulty: 'Hard' },
    { question: 'Explain how AWS IAM policy evaluation works. What is the difference between identity-based, resource-based, and permission boundary policies? How are conflicts resolved?', difficulty: 'Hard' },
    { question: 'How would you optimize AWS Lambda cold starts for a latency-sensitive API? What are the trade-offs between provisioned concurrency, SnapStart, and architectural changes?', difficulty: 'Hard' },
  ],
  'Docker': [
    { question: 'Explain Docker\'s layered filesystem. How do layers affect image build time, push/pull performance, and container startup? How do you optimize for this?', difficulty: 'Hard' },
    { question: 'What is the difference between CMD and ENTRYPOINT in a Dockerfile? How do they interact, and what happens when you override them at `docker run`?', difficulty: 'Hard' },
    { question: 'How would you debug a container that starts and immediately exits with code 137? Walk through your methodology.', difficulty: 'Hard' },
    { question: 'Explain Docker\'s networking modes (bridge, host, overlay, macvlan). When would you use overlay networking and what are its performance implications?', difficulty: 'Hard' },
    { question: 'Design a multi-stage Dockerfile for a Node.js app that minimizes final image size, avoids shipping dev dependencies, and handles secrets securely at build time.', difficulty: 'Hard' },
  ],
  'Kubernetes': [
    { question: 'Explain how Kubernetes scheduling works. What factors does the kube-scheduler consider, and how would you influence pod placement using affinity, taints, and tolerations?', difficulty: 'Hard' },
    { question: 'Your pod is stuck in CrashLoopBackOff. Walk through your complete debugging process — every command you\'d run and what you\'re looking for.', difficulty: 'Hard' },
    { question: 'Explain the difference between a Deployment, StatefulSet, and DaemonSet. When would you use each, and what guarantees do they provide?', difficulty: 'Hard' },
    { question: 'How does Kubernetes handle service discovery and load balancing internally? Explain the role of kube-proxy, iptables/IPVS, and CoreDNS.', difficulty: 'Hard' },
    { question: 'Design a zero-downtime deployment strategy in Kubernetes for a stateful application with a database migration. What are the risks and how do you mitigate them?', difficulty: 'Hard' },
  ],
  'Python': [
    { question: 'Explain Python\'s GIL. How does it affect multi-threaded CPU-bound vs I/O-bound programs? How do you work around it for CPU-heavy tasks?', difficulty: 'Hard' },
    { question: 'What are Python descriptors? Implement a `@cached_property` descriptor from scratch that is thread-safe.', difficulty: 'Hard' },
    { question: 'Explain the difference between `__new__` and `__init__`. When would you override `__new__`, and implement a singleton using it.', difficulty: 'Hard' },
    { question: 'How does Python\'s asyncio event loop work? What is the difference between a coroutine, a task, and a future? When does `await` not actually pause execution?', difficulty: 'Hard' },
    { question: 'Explain Python\'s memory management — reference counting, cycle detection, and generational garbage collection. How would you profile and fix a memory leak?', difficulty: 'Hard' },
  ],
  'Redis': [
    { question: 'Explain Redis\'s persistence options — RDB snapshots vs AOF. What are the trade-offs for durability, performance, and recovery time?', difficulty: 'Hard' },
    { question: 'How would you implement a distributed lock in Redis? What are the failure modes of SETNX-based locking, and how does Redlock address them?', difficulty: 'Hard' },
    { question: 'Explain Redis cluster sharding. How are hash slots assigned, and what happens during a node failure and resharding?', difficulty: 'Hard' },
    { question: 'You notice Redis memory usage growing unboundedly. Walk through your investigation and the eviction policies you would consider.', difficulty: 'Hard' },
    { question: 'Design a real-time leaderboard system in Redis for 10 million users with sub-millisecond read latency. What data structures and commands would you use?', difficulty: 'Hard' },
  ],
  'MongoDB': [
    { question: 'Explain MongoDB\'s WiredTiger storage engine. How does it handle concurrency, compression, and journaling compared to the old MMAPv1 engine?', difficulty: 'Hard' },
    { question: 'How does MongoDB\'s aggregation pipeline work? Write a pipeline that computes a rolling 7-day average from a time-series events collection.', difficulty: 'Hard' },
    { question: 'Explain the trade-offs between embedding documents vs referencing in MongoDB. Design a schema for a social media app with posts, comments, and likes at scale.', difficulty: 'Hard' },
    { question: 'How does MongoDB replica set election work? What is the role of the oplog, and how does it ensure consistency after a primary failover?', difficulty: 'Hard' },
    { question: 'You have a slow MongoDB query on a collection with 100M documents. Walk through your optimization process using explain(), index strategies, and query patterns.', difficulty: 'Hard' },
  ],
  'GraphQL': [
    { question: 'Explain the N+1 problem in GraphQL. How does DataLoader solve it, and what are its limitations when dealing with paginated or filtered nested queries?', difficulty: 'Hard' },
    { question: 'How would you implement cursor-based pagination in GraphQL? Why is it superior to offset pagination for large datasets?', difficulty: 'Hard' },
    { question: 'Design a GraphQL schema for a multi-tenant SaaS application with field-level authorization. How do you prevent over-fetching of sensitive data?', difficulty: 'Hard' },
    { question: 'Explain how GraphQL subscriptions work under the hood using WebSockets. How would you scale them across multiple server instances?', difficulty: 'Hard' },
    { question: 'What is schema stitching vs federation in GraphQL? When would you choose federation, and what are the operational complexities it introduces?', difficulty: 'Hard' },
  ],
  'Machine Learning': [
    { question: 'Explain the bias-variance trade-off. How does it manifest in practice, and how do regularization techniques like L1 and L2 address it differently?', difficulty: 'Hard' },
    { question: 'Walk me through how gradient descent works with backpropagation in a neural network. What causes vanishing/exploding gradients and how do you mitigate them?', difficulty: 'Hard' },
    { question: 'Explain the attention mechanism in transformers. How does self-attention differ from cross-attention, and what is the computational bottleneck?', difficulty: 'Hard' },
    { question: 'How would you detect and handle data leakage in a machine learning pipeline? Give specific examples of subtle leakage that are easy to miss.', difficulty: 'Hard' },
    { question: 'Design an ML system for real-time fraud detection at 100K transactions/second. What are the latency, accuracy, and retraining trade-offs?', difficulty: 'Hard' },
  ],
  'Microservices': [
    { question: 'Explain the saga pattern for distributed transactions. Compare choreography vs orchestration sagas — when would you choose each and what are the failure modes?', difficulty: 'Hard' },
    { question: 'How do you handle partial failures in a microservices call chain? Implement a circuit breaker pattern and explain the state machine behind it.', difficulty: 'Hard' },
    { question: 'Explain eventual consistency in a microservices architecture. How do you handle the case where a service reads stale data and makes a decision based on it?', difficulty: 'Hard' },
    { question: 'Design the data architecture for a microservices system where each service owns its data. How do you handle cross-service queries and reporting?', difficulty: 'Hard' },
    { question: 'How would you implement distributed tracing across 15 microservices? What instrumentation, sampling strategy, and tooling would you use?', difficulty: 'Hard' },
  ],
  'REST API': [
    { question: 'Explain idempotency in REST APIs. Which HTTP methods must be idempotent by spec, and how would you make a POST endpoint idempotent in practice?', difficulty: 'Hard' },
    { question: 'Design a versioning strategy for a public REST API with 10,000 consumers. What are the trade-offs between URL versioning, header versioning, and content negotiation?', difficulty: 'Hard' },
    { question: 'How would you implement optimistic concurrency control in a REST API to prevent lost updates? Walk through the HTTP headers and error handling involved.', difficulty: 'Hard' },
    { question: 'Design a rate limiting system for a REST API that supports per-user, per-endpoint, and burst limits. How do you handle distributed rate limiting across multiple servers?', difficulty: 'Hard' },
    { question: 'Explain HATEOAS. What problems does it solve and why do most production APIs not implement it fully?', difficulty: 'Hard' },
  ],
  'REST': [
    { question: 'Explain idempotency in REST APIs. Which HTTP methods must be idempotent by spec, and how would you make a POST endpoint idempotent in practice?', difficulty: 'Hard' },
    { question: 'Design a versioning strategy for a public REST API with 10,000 consumers. What are the trade-offs between URL versioning, header versioning, and content negotiation?', difficulty: 'Hard' },
    { question: 'How would you implement optimistic concurrency control in a REST API to prevent lost updates? Walk through the HTTP headers and error handling involved.', difficulty: 'Hard' },
  ],
  'JavaScript': [
    { question: 'Explain the JavaScript event loop, microtask queue, and macrotask queue. What is the exact execution order of Promises, queueMicrotask, setTimeout, and requestAnimationFrame?', difficulty: 'Hard' },
    { question: 'Implement a deep clone function in JavaScript that handles circular references, Maps, Sets, Dates, and typed arrays without using JSON.stringify.', difficulty: 'Hard' },
    { question: 'Explain how prototypal inheritance works in JavaScript. What is the prototype chain lookup process, and how does `class` syntax map to it under the hood?', difficulty: 'Hard' },
    { question: 'How does JavaScript\'s memory model work? Explain the difference between the stack and heap, and describe how closures can cause memory leaks.', difficulty: 'Hard' },
    { question: 'Explain WeakMap and WeakRef. What problems do they solve that regular Map and strong references cannot, and what are their limitations?', difficulty: 'Hard' },
  ],
  'SQL': [
    { question: 'Explain the difference between INNER JOIN, LEFT JOIN, and a correlated subquery in terms of execution plan and performance. When is each preferable?', difficulty: 'Hard' },
    { question: 'What are window functions? Write a query using ROW_NUMBER, RANK, and LAG to compute a running total and detect gaps in sequential data.', difficulty: 'Hard' },
    { question: 'Explain SQL transaction isolation levels. What anomalies (dirty read, phantom read, non-repeatable read) does each level prevent?', difficulty: 'Hard' },
    { question: 'How would you design an index strategy for a table with 500M rows that supports both high-frequency point lookups and range scans on different columns?', difficulty: 'Hard' },
    { question: 'Explain the difference between a covering index and an index with included columns. How do you use EXPLAIN to identify when an index is not being used?', difficulty: 'Hard' },
  ],
  'Go': [
    { question: 'Explain Go\'s goroutine scheduler (GMP model). How does it multiplex goroutines onto OS threads, and what triggers a goroutine to be preempted?', difficulty: 'Hard' },
    { question: 'What are the rules for when a variable escapes to the heap in Go? How does escape analysis affect performance, and how do you profile it?', difficulty: 'Hard' },
    { question: 'Explain Go\'s memory model and the happens-before relationship. Write an example where a data race produces undefined behavior that is not caught by intuition.', difficulty: 'Hard' },
    { question: 'How do Go channels work internally? Explain the difference between buffered and unbuffered channels and the scenarios where each can cause a deadlock.', difficulty: 'Hard' },
    { question: 'Design a worker pool in Go with graceful shutdown, backpressure handling, and panic recovery. Walk through every concurrency decision you make.', difficulty: 'Hard' },
  ],
  'Kafka': [
    { question: 'Explain Kafka\'s log compaction. How does it work, when should you use it, and how does it interact with consumer offsets and retention policies?', difficulty: 'Hard' },
    { question: 'How does Kafka guarantee exactly-once semantics end-to-end? Explain idempotent producers, transactional APIs, and their performance trade-offs.', difficulty: 'Hard' },
    { question: 'Explain the role of ISR (In-Sync Replicas) in Kafka. What happens to availability and durability when ISR shrinks to 1 during a broker failure?', difficulty: 'Hard' },
    { question: 'How would you design a Kafka consumer that processes messages in order within a partition but maximizes parallelism across partitions?', difficulty: 'Hard' },
    { question: 'You observe consumer lag growing on a Kafka topic. Walk through your complete diagnosis and remediation strategy without simply adding consumers.', difficulty: 'Hard' },
  ],
  'Next.js': [
    { question: 'Explain the difference between SSR, SSG, ISR, and RSC in Next.js. What are the caching implications of each, and when would a wrong choice hurt your users?', difficulty: 'Hard' },
    { question: 'How does Next.js App Router differ from Pages Router in terms of data fetching, rendering, and hydration? What are the breaking migration concerns?', difficulty: 'Hard' },
    { question: 'Explain how React Server Components work in Next.js 13+. What can and cannot be done in a Server Component, and how does the server/client boundary affect bundle size?', difficulty: 'Hard' },
    { question: 'How would you implement fine-grained caching in Next.js for an e-commerce site where product prices change frequently but descriptions rarely change?', difficulty: 'Hard' },
  ],
  'Java': [
    { question: 'Explain the JVM memory model — heap generations, metaspace, stack. How does the G1 garbage collector decide when and what to collect?', difficulty: 'Hard' },
    { question: 'What is the Java Memory Model (JMM)? Explain happens-before relationships and give an example where violating them causes a subtle concurrency bug.', difficulty: 'Hard' },
    { question: 'Explain the difference between synchronized, volatile, and AtomicInteger. When is each insufficient and what would you use instead?', difficulty: 'Hard' },
    { question: 'How does Java\'s virtual threads (Project Loom) differ from platform threads? What workloads benefit and which don\'t, and what existing code breaks?', difficulty: 'Hard' },
  ],
  'Spring Boot': [
    { question: 'Explain Spring\'s bean lifecycle. What is the order of BeanPostProcessor, @PostConstruct, InitializingBean, and ApplicationListener callbacks?', difficulty: 'Hard' },
    { question: 'How does Spring\'s @Transactional work under the hood? What are the proxy limitations, and give an example where it silently does not work?', difficulty: 'Hard' },
    { question: 'Explain Spring Security\'s filter chain. How would you implement a custom JWT authentication filter and where exactly in the chain does it belong?', difficulty: 'Hard' },
    { question: 'How does Spring Boot\'s auto-configuration work? Walk through how a starter dependency configures beans without any user-written config.', difficulty: 'Hard' },
  ],
  'Terraform': [
    { question: 'Explain Terraform\'s state file. What are the risks of state drift, and how do you handle state for a team of 20 engineers without conflicts?', difficulty: 'Hard' },
    { question: 'How does Terraform plan determine what changes to make? What are the edge cases where plan output does not match apply behavior?', difficulty: 'Hard' },
    { question: 'Design a Terraform module structure for a multi-environment (dev/staging/prod) AWS deployment. How do you handle environment-specific values and secrets?', difficulty: 'Hard' },
  ],
  'MySQL': [
    { question: 'Explain InnoDB\'s MVCC implementation. How does it use the undo log to provide consistent reads, and what causes long-running transactions to bloat it?', difficulty: 'Hard' },
    { question: 'How does MySQL replication work? Explain the difference between statement-based, row-based, and mixed replication and their failure modes.', difficulty: 'Hard' },
    { question: 'Walk me through diagnosing a sudden 10x increase in query latency on a MySQL production database. What tools and queries do you run first?', difficulty: 'Hard' },
  ],
};

// Role-level system design questions
const roleQuestionBank: Record<string, Array<{ question: string; difficulty: string }>> = {
  default: [
    { question: 'Design a system that needs to handle 1 million concurrent users. Walk through your architecture decisions, bottlenecks, and trade-offs at each layer.', difficulty: 'Hard' },
    { question: 'You pushed a deployment that caused a 40% increase in p99 latency. You have 15 minutes to diagnose and roll back or fix. Walk through every step you take.', difficulty: 'Hard' },
    { question: 'Explain CAP theorem with a concrete example. Describe a situation where you had to consciously choose between consistency and availability.', difficulty: 'Hard' },
    { question: 'How would you implement a distributed rate limiter that works across 50 server instances with no single point of failure and sub-millisecond overhead?', difficulty: 'Hard' },
    { question: 'Design a real-time collaborative editing system (like Google Docs). How do you handle conflict resolution when two users edit the same section simultaneously?', difficulty: 'Hard' },
    { question: 'Walk me through designing a URL shortener that handles 100K redirects/second. Cover data model, caching, and how you prevent hotspot keys.', difficulty: 'Hard' },
  ],
  frontend: [
    { question: 'Explain the browser\'s critical rendering path. How would you optimize a page that scores 30 on Lighthouse performance? Walk through every optimization lever.', difficulty: 'Hard' },
    { question: 'How does the browser\'s layout/reflow process work? Write a JavaScript animation that avoids layout thrashing and explain why your approach works.', difficulty: 'Hard' },
    { question: 'Design a micro-frontend architecture for a large application with 10 independent teams. How do you handle shared state, routing, and versioned dependencies?', difficulty: 'Hard' },
  ],
  backend: [
    { question: 'Design a job queue system that handles 100K jobs/hour with priorities, retries with exponential backoff, dead letter queues, and exactly-once execution guarantees.', difficulty: 'Hard' },
    { question: 'How would you implement database connection pooling from scratch? What parameters matter, how do you size the pool, and how do you handle connection leaks?', difficulty: 'Hard' },
    { question: 'Design a checkout flow that cannot lose an order even if 2 of 5 downstream services are down. Explain your consistency guarantees.', difficulty: 'Hard' },
  ],
  fullstack: [
    { question: 'Design the caching strategy for a social media feed that must be fresh within 30 seconds for 99% of reads but handles 50K writes/second. Walk through every cache layer.', difficulty: 'Hard' },
    { question: 'How would you implement authentication and authorization for a multi-tenant SaaS app with SSO, per-tenant roles, and field-level permissions? Cover both frontend and backend.', difficulty: 'Hard' },
  ],
};

// Hard behavioral questions focused on technical judgment
const hardBehavioral = [
  { question: 'Tell me about a time you disagreed with a technical decision made by a senior engineer or architect. What was your argument, and what was the outcome?', difficulty: 'Hard' },
  { question: 'Describe a system you built that failed in production in an unexpected way. What was your incident response, what did the post-mortem reveal, and what changed?', difficulty: 'Hard' },
  { question: 'Tell me about a time you had to push back on a product requirement because it was technically infeasible or would create significant long-term technical debt.', difficulty: 'Hard' },
  { question: 'Describe the hardest code review you ever gave or received. What made it hard, and what was the outcome?', difficulty: 'Hard' },
  { question: 'Tell me about an architectural decision you made that you later regretted. What would you do differently today and why?', difficulty: 'Hard' },
  { question: 'Describe a time you had to optimize a system under pressure with incomplete information. How did you decide where to focus first?', difficulty: 'Hard' },
];

// ============================================================================
// QUESTION GENERATION
// ============================================================================

export const generateInterviewQuestions = async (
  role: string,
  company: string,
  skills: string[]
): Promise<Array<{ question: string; category: string; difficulty: string }>> => {

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === '') {
    console.log('✅ No Claude API key, using hard technical question bank (FREE)');
    return generateBasicQuestions(role, skills);
  }

  try {
    console.log('🤖 Generating questions using Claude...');

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Generate 10 hard technical interview questions for this position. Return ONLY a valid JSON array, no other text.

Role: ${role}
Company: ${company}
Required Skills: ${skills.join(', ')}

Format:
[
  {
    "question": "...",
    "category": "Technical",
    "difficulty": "Hard"
  }
]

Rules:
- ALL questions must be Hard difficulty
- 7 deep Technical questions specific to the skills listed (internals, edge cases, system design, debugging scenarios)
- 3 Behavioral questions about past technical failures, disagreements, or hard decisions
- NO generic HR questions like "tell me your strengths" or "where do you see yourself"
- Return ONLY the JSON array`
      }]
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '[]';
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questions = JSON.parse(cleanContent);

    console.log(`✅ Generated ${questions.length} questions via Claude`);
    return questions;

  } catch (error) {
    console.error('❌ Claude API error, falling back to hard question bank:', error);
    return generateBasicQuestions(role, skills);
  }
};

function generateBasicQuestions(role: string, skills: string[]): Array<{ question: string; category: string; difficulty: string }> {
  const questions: Array<{ question: string; category: string; difficulty: string }> = [];
  const usedQuestions = new Set<string>();

  // Filter out non-technical skills
  const nonTechSkills = new Set(['Agile', 'Scrum', 'Kanban', 'Communication', 'Leadership',
    'Problem Solving', 'Teamwork', "Bachelor's Degree", "Master's Degree", 'PhD', 'DevOps', 'TDD', 'BDD']);
  const technicalSkills = skills.filter(s => !nonTechSkills.has(s) && !/years experience/i.test(s));

  // Add 1 hard question per detected skill (up to 6)
  for (const skill of technicalSkills.slice(0, 6)) {
    const skillKey = Object.keys(skillQuestionBank).find(key =>
      skill.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(skill.toLowerCase())
    );

    if (skillKey) {
      const bank = skillQuestionBank[skillKey];
      // Pick random question not already used
      const available = bank.filter(q => !usedQuestions.has(q.question));
      if (available.length > 0) {
        const picked = available[Math.floor(Math.random() * available.length)];
        questions.push({ question: picked.question, category: 'Technical', difficulty: picked.difficulty });
        usedQuestions.add(picked.question);
      }
    } else {
      // Unknown skill — still ask a hard question about it
      const q = `You claim production experience with ${skill}. Describe the most complex bug or performance issue you encountered — root cause, your debugging process, and what you changed.`;
      if (!usedQuestions.has(q)) {
        questions.push({ question: q, category: 'Technical', difficulty: 'Hard' });
        usedQuestions.add(q);
      }
    }
  }

  // Add role-specific system design questions
  const roleLower = role.toLowerCase();
  let roleKey = 'default';
  if (roleLower.includes('frontend') || roleLower.includes('front-end') || roleLower.includes('ui')) roleKey = 'frontend';
  else if (roleLower.includes('backend') || roleLower.includes('back-end') || roleLower.includes('server')) roleKey = 'backend';
  else if (roleLower.includes('fullstack') || roleLower.includes('full-stack') || roleLower.includes('full stack')) roleKey = 'fullstack';

  const roleBank = [...(roleQuestionBank[roleKey] || []), ...roleQuestionBank.default];
  const shuffledRole = roleBank.sort(() => Math.random() - 0.5);
  for (const q of shuffledRole) {
    if (questions.length >= 7) break;
    if (!usedQuestions.has(q.question)) {
      questions.push({ question: q.question, category: 'Technical', difficulty: q.difficulty });
      usedQuestions.add(q.question);
    }
  }

  // Fill remaining slots with hard behavioral questions
  const shuffledBehavioral = [...hardBehavioral].sort(() => Math.random() - 0.5);
  for (const q of shuffledBehavioral) {
    if (questions.length >= 10) break;
    if (!usedQuestions.has(q.question)) {
      questions.push({ question: q.question, category: 'Behavioral', difficulty: q.difficulty });
      usedQuestions.add(q.question);
    }
  }

  console.log(`✅ Generated ${questions.length} hard technical questions (no API needed)`);
  return questions.slice(0, 10);
}

// ============================================================================
// ANSWER ANALYSIS
// ============================================================================

export const analyzeInterviewAnswer = async (
  question: string,
  answer: string,
  requiredSkills: string[]
): Promise<{
  contentScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}> => {

  if (!process.env.ANTHROPIC_API_KEY) {
    return analyzeAnswerBasic(answer);
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Analyze this interview answer. Return ONLY valid JSON, no other text.

Question: ${question}
Answer: ${answer}
Required Skills: ${requiredSkills.join(', ')}

Format:
{
  "contentScore": 75,
  "feedback": "...",
  "strengths": ["..."],
  "improvements": ["..."]
}

Be harsh and specific. Focus on technical depth, correctness, and completeness.`
      }]
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(cleanContent);

    return {
      contentScore: analysis.contentScore || 0,
      feedback: analysis.feedback || '',
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
    };

  } catch (error) {
    console.error('❌ Answer analysis error, using basic analysis:', error);
    return analyzeAnswerBasic(answer);
  }
};

function isGibberish(answer: string): boolean {
  const trimmed = answer.trim();

  // Empty or too short
  if (trimmed.length < 20) return true;

  // Check ratio of real English words to total tokens
  const tokens = trimmed.split(/\s+/);
  const realWordPattern = /^[a-zA-Z]{2,}$/;
  const commonWords = new Set([
    'the','a','an','is','are','was','were','be','been','have','has','had',
    'do','does','did','will','would','could','should','may','might','can',
    'i','we','you','he','she','they','it','this','that','my','your','our',
    'in','on','at','to','for','of','with','by','from','about','as','into',
    'and','or','but','so','if','when','how','what','why','where','which',
  ]);

  let realWordCount = 0;
  let gibberishCount = 0;

  for (const token of tokens) {
    const clean = token.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length === 0) continue;

    if (commonWords.has(clean)) {
      realWordCount++;
    } else if (realWordPattern.test(clean)) {
      // Check for consecutive consonants (gibberish indicator)
      const consonantRun = clean.match(/[bcdfghjklmnpqrstvwxyz]{5,}/);
      const vowelRatio = (clean.match(/[aeiou]/g) || []).length / clean.length;

      if (consonantRun || vowelRatio < 0.1) {
        gibberishCount++;
      } else {
        realWordCount++;
      }
    } else {
      gibberishCount++;
    }
  }

  const totalTokens = tokens.length;
  const gibberishRatio = gibberishCount / totalTokens;

  // If more than 40% of tokens look like gibberish, reject it
  return gibberishRatio > 0.4 || (realWordCount < 3 && totalTokens < 5);
}

function analyzeAnswerBasic(answer: string): {
  contentScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
} {
  const trimmed = answer.trim();

  // Catch empty answers
  if (!trimmed || trimmed.length < 5) {
    return {
      contentScore: 0,
      feedback: 'No answer provided.',
      strengths: [],
      improvements: ['You must provide an answer to receive a score.'],
    };
  }

  // Catch gibberish / keyboard mashing
  if (isGibberish(trimmed)) {
    return {
      contentScore: 0,
      feedback: 'Your answer does not appear to contain meaningful content.',
      strengths: [],
      improvements: [
        'Write a real answer in complete sentences.',
        'Explain your understanding of the concept or describe a relevant experience.',
        'Use technical terminology relevant to the question.',
      ],
    };
  }

  const wordCount = trimmed.split(/\s+/).length;
  const hasExamples = /for example|for instance|such as|like when/i.test(trimmed);
  const hasTechnicalTerms = /implemented|developed|designed|built|created|optimized|debugged|refactored|deployed|architected|configured/i.test(trimmed);
  const hasMetrics = /\d+%|\d+ms|\d+x|reduced|improved|increased|decreased|faster|slower|latency|throughput/i.test(trimmed);

  let score = 0; // Start at 0, earn points
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Base points for writing something coherent
  score += 20;

  if (wordCount > 30) { score += 10; }
  else { improvements.push('Write more — a strong answer needs at least 50 words'); }

  if (wordCount > 80) { score += 10; strengths.push('Detailed response'); }
  else { improvements.push('Provide significantly more detail — aim for at least 100 words'); }

  if (hasExamples) { score += 15; strengths.push('Used concrete examples'); }
  else { improvements.push('Add a specific real-world example from your experience'); }

  if (hasTechnicalTerms) { score += 20; strengths.push('Demonstrated hands-on technical work'); }
  else { improvements.push('Use technical terminology and describe implementation details'); }

  if (hasMetrics) { score += 20; strengths.push('Quantified impact with metrics'); }
  else { improvements.push('Include measurable outcomes (latency reduced by X%, handled Y requests/sec, etc.)'); }

  if (wordCount > 150) score += 5;

  return {
    contentScore: Math.min(score, 100),
    feedback: 'Automated scoring based on response depth, examples, technical terminology, and quantified impact.',
    strengths,
    improvements,
  };
}

// ============================================================================
// READINESS SCORE
// ============================================================================

export const calculateReadinessScore = async (
  userSkills: string[],
  requiredSkills: string[],
  interviewPerformance: Array<{ contentScore: number }>
): Promise<{
  score: number;
  level: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}> => {
  const matchedSkills = requiredSkills.filter(skill =>
    userSkills.some(userSkill =>
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );

  const missingSkills = requiredSkills.filter(skill => !matchedSkills.includes(skill));

  const skillMatchRate = requiredSkills.length > 0
    ? (matchedSkills.length / requiredSkills.length) * 100
    : 0;

  const avgPerformance = interviewPerformance.length > 0
    ? interviewPerformance.reduce((sum, p) => sum + p.contentScore, 0) / interviewPerformance.length
    : 0;

  const readinessScore = Math.round((skillMatchRate * 0.6) + (avgPerformance * 0.4));

  let level = 'Not Ready';
  let recommendation = '';

  if (readinessScore >= 80) {
    level = 'Ready';
    recommendation = 'Strong profile. Focus on system design questions and company-specific research.';
  } else if (readinessScore >= 60) {
    level = 'Needs Practice';
    recommendation = `Practice deep-dives on: ${missingSkills.slice(0, 3).join(', ')}. Do at least 3 more mock interviews.`;
  } else {
    level = 'Not Ready';
    recommendation = `Build deeper expertise in: ${missingSkills.slice(0, 5).join(', ')}. Complete 5+ mock interviews before applying.`;
  }

  return { score: readinessScore, level, matchedSkills, missingSkills, recommendation };
};
