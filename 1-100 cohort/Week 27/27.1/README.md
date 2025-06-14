# Kubernetes

## Container Orchestration

- **What are containers?** Isolated environments that contain everything an application needs to run. They are portable, efficient, and easy to use. Eg: Docker lets you create, deploy, and run containers.

- **Container Orchestration:** _Managing the lifecycle of containers_, especially in large, dynamic environments. It involves _deploying, scaling, and managing containers_.

- **Why do we need container orchestration?**

  - Starting up a single container requires a lot of manual work. Imagine managing a **cluster** of VMs containing multiple containers.

  - If we want to manage these clusters for us, like simply provide the scripts/instructions to someone else, and it will take care of the rest.

  - If we want to move our containers from one host to another, we need to make sure that the containers are running and the data is not lost.

  - Along with the above points, what if we can monitor the health of our containers, and if they are unhealthy, we can restart them automatically. This is also where container orchestration comes in.

## Different Architectures for deploying before K8s

- Load Balancer -> Multiple Servers (For Backend) [Right way for large applications]
  <img width="600" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/1694ffd7-1d95-4c65-a321-fe08625d620e">

- EC2 Machine (For Frontend)
  <img width="600" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/0461097b-9daf-4b76-937c-7e583c510770">
- CDN -> S3 Bucket (For Static Files)
  <img width="600" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/8876ac42-0edc-4b9b-a7d9-4d7f7166623e">

## Deploying Architecture with K8s

- In Kubernetes, if we want to start a container we don't start a container directly. We start a **Pod**.

  _**Note**: A single **Pod** can contain one or more containers._

  <br>

- A **Node** is simply a EC2 machine (VM) where we can run our containers. In Kubernetes, we divide the **Nodes** into two categories:

  - Master Nodes (Control Pane)
  - Worker Nodes

  <br>

- **Master Nodes** are responsible for managing the **Pods**. Its the master node's responsibility to:

  - deploy bunch of containers as per the requirement.
  - manage them.

  <br>

- **Worker Nodes** are the ones who actually run the containers.

  <br>

- **Kubernetes Cluster** is the collection of **Master Nodes** and **Worker Nodes**.

  <br>

  <details>
    <summary> <b>Master Node Internals</b> </summary>

    <img width="500" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/5d57f53b-d892-4d96-8f25-bf8736152f78">

    - **API Server**: its the main entry point for all requests. developer sends the request (eg: 'pls initiate and run that docker image') to this server inside master nodes.

    - **etcd**: similar to redis. but unlike redis, its a distributed key-value store that stores the cluster state (eg: if there we want to run them on different pods, then storing 'pod1': backend1, 'pod2': backend2). means key-value pairs can be shared across multiple machines.

    - **Scheduler**: it looks at the cluster state and decides where to run the container. eg: if there are 2 worker nodes, then it will decide to run the container on worker node 1 or 2.

    - **Controller Manager**: runs an infinite loop to make sure that the cluster state is as per the requirement (checks it by running other controllers). eg: if the container is down, then it will restart it.

    </details>

    <details>
    <summary> <b>Worker Node Internals</b> </summary>

    <img width="500" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/4ef57927-0998-4106-a1b5-58ec4995b6ed">

    - **container runtime**: its the place where the container actually runs. eg: docker.

    - **kubelet**: it is the agent that runs on each worker node. it is responsible for making sure that the containers are running in a pod.

    - **kube-proxy**: it is responsible for making sure that the network is properly set up. eg: if we have 2 pods, then it will make sure that they can communicate with each other.

    </details>

    <br>

- In summary, hierarchy is like this 👇

  <img width="361" alt="Screenshot 2024-06-01 at 7 35 27 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/ee9aef4f-51ef-455c-b5ef-fc394da358c6">

    <br>

## Creating a Kubernetes Cluster

We can create a Kubernetes cluster in two ways:

**Locally**:

- Minikube
- Kind (Recommended)

<br>

**Cloud**:

- GKE (Google Kubernetes Engine)

### Installing & Setting up a Cluster

1. Install Kind using instructions [here](https://kind.sigs.k8s.io/docs/user/quick-start/).

<br>

2. Create a single node cluster:

   ```bash
   kind create cluster --name 100x-k8s
   ```

   <br>

3. Check the Docker containers running:

   ```bash
   docker ps
   ```

   Notice, there is a single container running (control plane). In our case, the _master node_ is acting as the _worker node_.

   <br>

4. To delete the cluster:

   ```bash
   kind delete cluster --name 100x-k8s
   ```

   <br>

5. To setup a multi-node cluster, create a `clusters.yml` file (or check the `/k8s/clusters.yml`).

  <br>

6. Go to the path where the `clusters.yml` file is located and run:

   ```bash
   kind create cluster --config clusters.yml --name 100x-k8s
   ```

7. Check the no. of nodes running (1 Master and 2 Worker Nodes).
   <img width="1382" alt="Screenshot 2024-06-01 at 8 10 56 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/8a87c9e8-e74f-4330-8a60-36b5bc6535e6">

   _You will hit the `master` node port since it is the only node that is exposed to the outside world._

  <br>

- To check the cluster info (although, will give forbidden error):

  ```bash
  kubectl cluster-info --context kind-100x-k8s
  ```

- To find the credentials, run:

  ```bash
  cat ~/.kube/config
  ```

  > This is the file that contains the credentials to access the cluster.

   <br>

8. To access the cluster, we need to install `kubectl`:

   ```bash
   brew install kubectl
   ```

   - Check if the `kubectl` is installed:

     ```bash
     kubectl version
     ```

     <br>

9. Now, we can access the cluster using `kubectl`:

   ```bash
   kubectl get nodes
   ```

   - To check the HTTP requests made by `kubectl`:

     ```bash
     kubectl get nodes -v=10
     ```

---

## Creating a Pod

- If you check the output of the below command, you will notice that there are no pods running:

  ```bash
  kubectl get pods
  ```

- Till now, we have created a cluster of 3 nodes.

- Let's create a single container from an image inside a pod.

<br>

1.  Find a good image to run. In our case, we will go with `nginx`. Check `nginx` using docker first:

    ```bash
    docker run -p 3005:80 nginx
    ```

    <br>

2.  Now, let's create a pod using `kubectl`. Press `ctrl + c` to stop the running container and run the below command to start `nginx` inside a pod:

    ```bash
    kubectl run nginx --image=nginx --port=80
    ```

    - Check the pods

      ```bash
      kubectl get pods
      ```

    - Check the logs

      ```bash
      kubectl logs nginx
      ```

    - Describe the pod

      ```bash
      kubectl describe pod nginx
      ```

      > Notice, the node where the pod is running. It will be running on one of the worker nodes.

    <br>

3.  To delete the pod:

    ```bash
    kubectl delete pod nginx
    ```

    <br>

    **Notice**: we can't yet access the pod yet, we will be able to do that once we understand the concept of services.

    <br>

### Creating a Pod using Manifest File

- Instead of running the `kubectl run` command over and over again, we can create a manifest file.

1.  Create a `pod-manifest.yml` file (or check the `/k8s/pod-manifest.yml`).

    <br>

2.  Write the below configuration in the `pod-manifest.yml` file:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
    ```

    <details>
    <summary> <b>Explaining above Configuration</b> </summary>

    - `apiVersion`: The version of the Kubernetes API we want to use

    - `kind`: The type of object we want to create. In this case, a Pod.

    - `metadata`: Data about the Pod. In this case, the name of the Pod.

    - `spec`: The specification of the Pod. This is where we define the containers that should run in the Pod.

      - `containers`: A list of containers that should run in the Pod.

        - `name`: The name of the container.

        - `image`: The image to use for the container.

        - `ports`: A list of ports that should be exposed by the container.

          - `containerPort`: The port that should be exposed by the container.

    </details>

    <br>

3.  Create the pod using the manifest file:

    ```bash
    kubectl apply -f pod-manifest.yml
    ```

    - Check the pods

      ```bash
      kubectl get pods
      ```

    <br>

4.  To delete the pod:

    ```bash
    kubectl delete pod nginx
    ```

### Checkpoint

So, now our cluster is up and running. And its current state looks like this 👇
<img width="600" alt="Screenshot_2024-06-01_at_6 13 20_AM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/02768715-7125-41ad-bb70-3d31f3f8dad2">