import ServiceRegistry from './serviceRegistry';

/**
 * LoadBalancer is responsible for handling load balancing across instances of a specific service.
 * It uses a round-robin strategy to distribute requests evenly.
 */
class LoadBalancer {
  private roundRobinCounters: Map<string, number>;

  constructor() {
    this.roundRobinCounters = new Map();
  }

  /**
   * Retrieves the next available instance of a service using round-robin selection.
   * If no healthy instances are found, it throws an error.
   * @param serviceName - The name of the service to load balance
   * @returns The next available service instance for the specified service
   */
  public getNextInstance(serviceName: string) {
    // Get healthy instances of the service
    const instances = ServiceRegistry.getService(serviceName);

    if (!instances || instances.length === 0) {
      throw new Error(`No healthy instances found for service: ${serviceName}`);
    }

    let counter = this.roundRobinCounters.get(serviceName) || 0;
    counter = (counter + 1) % instances.length;

    // Store the updated counter value back in the map
    this.roundRobinCounters.set(serviceName, counter);

    // Return the next instance of the service based on the updated counter
    return instances[counter];
  }
}

export default new LoadBalancer();
