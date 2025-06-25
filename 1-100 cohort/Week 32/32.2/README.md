# Docker Swarm

Docker Swarm is a container orchestration system, very similar to Kubernetes.
It’s not used as often anymore, as Kubernetes has become more popular.

## Core Concepts
- Services
- Tasks
- Containers

## Advantages
- Easy to understand
- Manual autoscaling
- Works with the Docker CLI

# Manager Node
Manager nodes handle cluster management tasks:
- Maintaining cluster state
- Scheduling services

# Worker Node
Worker nodes are also instances of Docker Engine whose sole purpose is to execute containers.

# Services, Tasks, Containers
To deploy an application image when Docker Engine is in Swarm mode, you create a service.
Frequently, a service is the image for a microservice within the context of some larger application (e.g., HTTP server).

- **Service**: A service is the definition of how you want to run your application in the swarm. It specifies the desired state, including the number of replicas, the image to use, the command to run, and other configurations such as networks and volumes.
- **Task**: A task is a single instance of a service running on a node. Each task represents one container and its associated metadata. When you create a service with multiple replicas, Docker Swarm creates a task for each replica.
- **Container**: A container is a running instance of a Docker image. Each task maps to one container. The swarm orchestrator ensures the tasks (and thus the containers) are distributed across the nodes in the swarm according to the defined service specifications.

# Create a 2-Node Swarm
- Create two EC2 machines and install Docker on both of them.
- Initialize the swarm on the first machine:
```bash
docker swarm init
```

- Make the other server join the manager (replace the token and IP from the first command):
```bash
docker swarm join --token <token> <manager_ip>:2377
```

- Make sure port 2377 is open on the machine.

- Confirm the node status:
```bash
docker node ls
```

# Deploying a Service
- Deploy the nginx service:
```bash
docker service create --replicas 3 --name helloworld -p 3000:80 nginx
```

- Check the service status:
```bash
docker service ls
```

- Go to the machine URL on port 3000 and ensure you see it running:
```bash
your_machine_ip:3000
```

- Try deleting a few containers and see if they come back up.

- Delete the service:
```bash
docker service rm helloworld
```