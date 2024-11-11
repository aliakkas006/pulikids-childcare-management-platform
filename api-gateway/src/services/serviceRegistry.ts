import Consul from 'consul';
import { ServiceInfo } from '@/types';

/**
 * ServiceRegistry is responsible for managing service registration and discovery
 * with Consul. It keeps track of available services, watches for updates,
 * and provides healthy service instances for clients.
 */
class ServiceRegistry {
  private consul: Consul;
  private services: Map<string, ServiceInfo[]>;

  constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST || 'localhost',
      port: parseInt(process.env.CONSUL_PORT || '8500'),
    });

    this.services = new Map();
    this.init(); // Start service watching and updating
  }

  /**
   * Initializes the service registry by starting to watch and periodically update services.
   * Sets an interval to refresh the service data every 30 seconds.
   */
  private async init() {
    await this.watchServices(); // Initial load of services
    setInterval(() => this.updateServices(), 30000); // Schedule service updates every 30 seconds
  }

  /**
   * Watches services registered with Consul and populates the service registry with them.
   * Called on initialization to load available services.
   */
  private async watchServices() {
    try {
      // Fetch all services from Consul agent
      const services = await this.consul.agent.services();

      // Iterate through each registered service and add it to the service map
      Object.values(services).forEach((service) => {
        const serviceInfo: ServiceInfo = {
          id: service.ID,
          name: service.Service,
          address: service.Address,
          port: service.Port,
          tags: service.Tags || [],
          status: 'healthy',
        };

        // Add the service to the list of instances, creating a new list if necessary
        const serviceInstances = this.services.get(service.Service) || [];
        serviceInstances.push(serviceInfo);
        this.services.set(service.Service, serviceInstances);
      });
    } catch (error) {
      console.error('Error watching services:', error);
    }
  }

  /**
   * Periodically updates the status of all services based on their health checks.
   * Uses Consul's health API to get current health status and updates registry accordingly.
   */
  private async updateServices() {
    try {
      // Fetch health status for all services
      const healthChecks = await this.consul.health.service('*');

      // Update the status of each instance based on the health checks
      healthChecks.forEach((check) => {
        const serviceInstances = this.services.get(check.Service.Service);
        if (serviceInstances) {
          const instance = serviceInstances.find(
            (s) => s.id === check.Service.ID
          );
          if (instance) {
            // Set status to 'healthy' if all checks pass, otherwise 'unhealthy'
            instance.status = check.Checks.every((c) => c.Status === 'passing')
              ? 'healthy'
              : 'unhealthy';
          }
        }
      });
    } catch (error) {
      console.error('Error updating services:', error);
    }
  }

  /**
   * Retrieves a list of healthy instances for a given service name.
   * @param serviceName - The name of the service to retrieve
   * @returns A list of healthy service instances or an empty list if none are found
   */
  public getService(serviceName: string): ServiceInfo[] {
    return (
      this.services.get(serviceName)?.filter((s) => s.status === 'healthy') ||
      []
    );
  }

  /**
   * Registers a new service instance with Consul.
   * @param serviceInfo - The information about the service instance to register
   */
  public async registerService(serviceInfo: Omit<ServiceInfo, 'status'>) {
    try {
      // Register the service with Consul agent using provided information
      await this.consul.agent.service.register({
        id: serviceInfo.id,
        name: serviceInfo.name,
        address: serviceInfo.address,
        port: serviceInfo.port,
        tags: serviceInfo.tags,
      });
      console.log(`Service registered: ${serviceInfo.name}`);
    } catch (error) {
      console.error('Error registering service:', error);
      throw error;
    }
  }

  /**
   * Deregisters a service instance from Consul by ID.
   * @param serviceId - The unique ID of the service instance to deregister
   */
  public async deregisterService(serviceId: string) {
    try {
      // Remove the service from Consul
      await this.consul.agent.service.deregister(serviceId);
      console.log(`Service deregistered: ${serviceId}`);
    } catch (error) {
      console.error('Error deregistering service:', error);
      throw error;
    }
  }
}

export default new ServiceRegistry();
