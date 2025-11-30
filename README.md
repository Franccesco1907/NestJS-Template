# Backend Challenge - IP Blocklist Service

## The Problem

We need a service that helps protect our applications from malicious IP addresses. These IPs might be used for DDoS attacks, brute force attempts, or other harmful activities. The goal is to create a service that can quickly tell us if an IP address should be blocked.

## Your Challenge

Design and implement a solution that addresses this problem. Think about:

1. How would you store and query IP addresses efficiently?
2. How would you keep the blocklist up to date?
3. How would you ensure the service is reliable and performant?
4. What additional features would make this service more useful?


## Solution Overview

This service is built using **NestJS** and follows a **hexagonal architecture**, separating the core application logic from infrastructure concerns. It leverages **Redis** for efficient storage and retrieval of IP addresses, ensuring high performance for checking against the blocklist.

The service exposes a REST API for interacting with the blocklist:

-   **`POST /blocklist`**: Adds a new IP address to the blocklist.
-   **`DELETE /blocklist/:ipAddress`**: Removes an IP address from the blocklist.
-   **`GET /:ipAddress`**: Checks if a given IP address is present in the blocklist.

The service also includes a scheduled task to periodically fetch and update the blocklist from the provided public list ([https://github.com/stamparm/ipsum](https://github.com/stamparm/ipsum)).


## Key Features

-   **Efficient IP Address Storage and Querying**: Utilizes Redis, an in-memory data store, for fast lookups using Redis Sets.
-   **Up-to-date Blocklist**: Implements a scheduled job to fetch and update the blocklist daily from the specified external source.
-   **Reliable and Performant**: Designed with performance in mind, leveraging Redis for low-latency checks. The hexagonal architecture promotes maintainability and testability, contributing to reliability.
-   **Comprehensive API**: Provides endpoints for adding, removing, and checking IP addresses.
-   **Automated Testing**: Includes 100% unit test coverage, ensuring the reliability and correctness of the core logic.
-   **Containerized Deployment**: Uses Docker for easy deployment and consistency across different environments.
-   **Configuration Management**: Leverages NestJS's configuration module for managing environment-specific settings.
-   **Logging and Monitoring**: Includes logging using NestJS interceptors for request/response tracking. (Further monitoring aspects are discussed below).
-   **Health Checks**: Includes health API for health checking

## Getting Started

### Prerequisites

-   Docker
-   Docker Compose

### Running the Service Locally

1.  Clone the repository (if you haven't already).
2.  Navigate to the project directory and change `.env.example` to `.env`.
3.  Run the following command to build and start the service and its dependencies (Redis):

    ```bash
    docker-compose -f docker-compose.local.yml up -d --build
    ```

4.  The service will be accessible at `http://localhost:3000/api/v1`.
5.  The Swagger documentation will be available at `http://localhost:3000/docs`.


### Running the Service in Production Mode

1.  Clone the repository (if you haven't already).
2.  Navigate to the project directory and change `.env.example` to `.env`.
3.  Run the following command to build and start the service and its dependencies (Redis):

    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

4.  The service will be accessible at `http://localhost:3000/api/v1`.
5.  The Swagger documentation will be available at `http://localhost:3000/docs`.


### Using the Service

You can interact with the service using the Swagger documentation interface (available at `http://localhost:3000/docs`) or tools like Postman.

For developers who wish to explore, modify, or debug the service, you can also leverage **Development Containers (Dev Containers)**. This setup provides a consistent and isolated development environment within the Docker containers defined in this project. Using tools that support Dev Containers (such as VS Code with the Remote - Containers extension), you can directly connect to the running service container and work on the codebase with all necessary dependencies and configurations already set up.


## Some Questions to Consider

- **How would you handle millions of IP addresses?**

   - **Redis Sets**: The solution utilizes Redis Sets to store the blocked IP addresses. Redis Sets are highly efficient for checking the existence of an element (IP address in this case) due to their underlying hash table implementation. This allows for lookups with an average time complexity of O(1), even with millions of entries.

   - **Memory Efficiency**: While storing millions of IPs in memory requires careful consideration, Redis is known for its memory efficiency. For IPv4 addresses, storing them directly as strings.

   - **Scalability**:
      - **Redis**: Redis can be scaled horizontally using techniques like clustering or partitioning if the number of IP addresses grows extremely large or if read/write throughput becomes a bottleneck.
      
      - **Node.js Application**: The backend application, built with Node.js and NestJS, is inherently well-suited for horizontal scaling. Node.js's non-blocking, event-driven architecture allows it to handle a large number of concurrent requests efficiently. By running multiple instances of the application behind a load balancer, you can distribute traffic and increase the service's capacity to handle a growing number of requests. This stateless nature of the application tier makes horizontal scaling straightforward.

- **What happens if the service goes down?**

   - **Redis Persistence (Consideration for Production)**: For production deployments, it's crucial to configure Redis with persistence mechanisms such as RDB snapshots (saving the dataset at specific intervals) or AOF logs (logging every write operation). These features ensure that the blocklist can be saved to disk and reloaded upon restarting Redis, minimizing potential downtime and data loss.

   - **Redundancy**: For critical production environments, deploying Redis in a highly available configuration (e.g., using Redis Sentinel or Redis Cluster) would provide redundancy. If one Redis instance fails, another can take over, ensuring the blocklist service remains operational.

   - **Stateless Application**: The NestJS application itself should ideally be stateless. This allows for easy scaling and replacement of instances without losing critical data, as the state (the blocklist) resides in Redis. Load balancers can distribute traffic across multiple instances of the NestJS application.

- **How would you know if your solution is working well?**

   - **Automated Tests**: The existing 100% unit test coverage ensures that the individual components of the service function as expected. Integration tests can be added to verify the interaction between different parts of the system (e.g., the API endpoints and the Redis integration).

   - **Monitoring**: Implementing comprehensive monitoring is crucial. This includes:

   - **API Response Times**: Tracking the latency of the Check IP Address endpoint is critical to ensure the service is performing efficiently. High latency could indicate issues with Redis or the application logic.

   - **Error Rates**: Monitoring the number of errors (e.g., HTTP 5xx errors) from the API endpoints can indicate problems with the service's stability.

   - **Redis Metrics**: Monitoring Redis performance, such as memory usage, CPU utilization, connection count, and cache hit rate, is essential for identifying potential bottlenecks or issues with the data store.

   - **Scheduled Task Success/Failure**: Tracking the success and failure rate of the daily IP list update job is important to ensure the blocklist remains current.

   - **Resource Utilization**: Monitoring the CPU and memory usage of the application containers can help identify resource constraints.

   - **Health Checks**: Implementing a health check endpoint (e.g., /health) that reports the status of the application and its dependencies (like Redis) allows for automated monitoring by orchestration tools and load balancers.

   - **Logging**: Structured logging provides valuable insights into the application's behavior and can help in debugging issues.


- **What metrics would you track?**

   Based on the above, key metrics to track include:

   - API Latency (P50, P95, P99) for /check/:ipAddress
   - HTTP Error Rates (4xx and 5xx)
   - Redis Memory Usage
   - Redis CPU Utilization
   - Redis Connection Count
   - Redis Cache Hit Rate (for other potential caching mechanisms)
   - Success/Failure Rate of the IP List Update Job
   - Application CPU Usage
   - Application Memory Usage
   - Number of Blocked IP Checks per Minute/Second
   - These metrics can be visualized using monitoring tools like Prometheus, Grafana, or cloud-specific monitoring services.


- **How would you deploy and scale this service?**

   - **Deployment**:
      - **Containerization**: The use of Docker already provides a consistent and portable deployment unit.
      
      - **Orchestration**: For production deployments, container orchestration platforms like Kubernetes or Docker Swarm would be ideal. These platforms automate the deployment, scaling, and management of containerized applications.
      
      - **Cloud Providers**: Deploying to cloud platforms like AWS (ECS, EKS), Google Cloud (Cloud Run, GKE), or Azure (ACI, AKS) provides managed infrastructure and scaling capabilities.

   - **Scaling**:
      - **Horizontal Scaling (Application)**: The stateless nature of the NestJS application allows for easy horizontal scaling by increasing the number of container instances. A load balancer (e.g., Nginx, HAProxy, cloud load balancers) would distribute traffic across these instances.
      
      - **Scaling Redis**: Depending on the workload and data size, Redis can be scaled:
         - **Read Replicas**: For read-heavy workloads (primarily the Check endpoint), adding read replicas can distribute the read load.
         - **Clustering/Partitioning**: For very large datasets or high write throughput (adding/removing IPs), Redis Cluster allows for distributing data across multiple nodes.
      
      - **Database Considerations**: If you were to introduce a relational database for other purposes, you would need to consider its scaling capabilities as well.


## What We're Looking For

We want to see how you approach problems and make technical decisions. Consider:

- **How you think about system design**

   My approach to system design involves:

   - **Understanding the Core Problem**: Clearly defining the requirements and constraints of the problem (e.g., the need for fast IP lookups, handling millions of IPs, keeping the list updated).

   - **Identifying Key Components**: Breaking down the system into logical components (API, data storage, background tasks).

   - **Choosing the Right Technologies**: Selecting technologies that are well-suited for the specific tasks and performance requirements (e.g., Redis for fast lookups, NestJS for building a scalable backend, updated libraries, etc.).

   - **Prioritizing Performance and Scalability**: Designing the system with the potential for high traffic and large datasets in mind. This often involves considering data structures, caching strategies, and horizontal scaling.

   - **Ensuring Reliability**: Implementing mechanisms for data persistence, redundancy, and monitoring to minimize downtime and ensure the system operates correctly.

   - **Considering Maintainability and Testability**: Architecting the system in a modular way that is easy to understand, test, and evolve (as demonstrated by the hexagonal architecture).

   - **Iterative Approach**: Recognizing that system design is often an iterative process. Starting with a core solution and then adding features and optimizations based on needs and feedback.


- **Your understanding of performance and scalability**

   Performance and scalability are critical considerations in this design:

   - **Performance**: The choice of Redis as the primary data store directly addresses the performance requirement for fast IP address checks. The O(1) lookup time complexity of Redis Sets ensures low latency even with a large number of blocked IPs. Efficient data structures and minimizing network calls are key to achieving good performance.
   
   - **Scalability**: The design considers both vertical and horizontal scaling. Redis can be scaled vertically (increasing resources on a single machine) and horizontally (clustering). The stateless nature of the application allows for horizontal scaling by adding more instances behind a load balancer. Asynchronous operations and efficient resource management within the application also contribute to scalability.


- **Your approach to reliability and monitoring**

   Reliability and monitoring are addressed through:

   - **Data Persistence (Redis)**: Ensuring the blocklist survives service restarts.
   - **Redundancy (Potential Redis Setup)**: Minimizing single points of failure in the data store.
   - **Automated Testing**: Verifying the correctness of the application logic.
   - **Health Checks**: Allowing for automated detection of unhealthy instances.
   - **Comprehensive Monitoring**: Tracking key metrics to identify performance bottlenecks, errors, and the overall health of the system.
   - **Logging**: Providing detailed information for debugging and auditing.


- **How you make trade-offs between different solutions**

   When making technical decisions, I consider various trade-offs:

   - **Performance vs. Complexity**: Sometimes, highly performant solutions can be more complex to implement and maintain. For example, using more intricate data structures or caching mechanisms might offer marginal performance gains at the cost of increased complexity.

   - **Memory Usage vs. Performance**: In-memory data stores like Redis offer excellent performance but require careful management of memory usage, especially with large datasets. Trade-offs might involve data compression or more sophisticated memory management techniques.

   - **Development Speed vs. Long-Term Maintainability**: Choosing simpler, well-understood technologies might lead to faster development but could potentially limit scalability or maintainability in the long run. Conversely, more complex architectures might take longer to implement but offer better long-term benefits.

   - **Cost vs. Scalability/Reliability**: Highly scalable and reliable solutions often come with increased infrastructure costs. Balancing these costs with the required level of scalability and reliability is crucial.
   In the context of this challenge, the choice of Redis strikes a good balance between performance, scalability, and relative ease of use. The hexagonal architecture promotes maintainability and testability, which are important for long-term reliability.


## Potential Improvements

   While the current solution is well-structured, here are some potential improvements to consider:

   - **Rate Limiting**: Implement rate limiting on the API endpoints to prevent abuse.

   - **Caching in the Application Layer**: For frequently checked IPs (especially those not on the blocklist), consider adding a local cache in the application layer to reduce the load on Redis.

   - **More Granular Blocklist Management**: Allow for blocking IP ranges (CIDR notation) instead of just individual IPs. This would require updating the storage and checking logic.

   - **Admin Interface**: Develop a user interface for managing the blocklist (adding, removing, searching).

   - **Audit Logging**: Implement more detailed audit logging for changes to the blocklist.

   - **Integration with Security Tools**: Explore integration with other security tools and platforms for sharing and consuming threat intelligence.

   - **Advanced Monitoring and Alerting**: Set up alerts based on the tracked metrics to proactively identify and address issues.

   - **IP Geolocation**: Consider adding IP geolocation information for blocked IPs for enhanced analysis.
   
   
## Final Note
   This solution provides a robust foundation for an IP blocklist service, emphasizing performance, scalability, and reliability. The hexagonal architecture and comprehensive testing contribute to a maintainable and dependable system. The detailed answers to your questions further illustrate the design considerations and potential for future enhancements.
   
   Thank you for the opportunity to analyze and extend this excellent piece of work!