# Kubernetes Part 4

In today's session, we will be looking at the following topics:

- [Horizontal Pod AutoScaler](#horizontal-pod-autoscaler)
- [Node AutoScaler](#cluster-autoscaling)
- [Resource Management](#resource-requests-and-limits)

## Horizontal Pod AutoScaler

![image](https://github.com/user-attachments/assets/90f32b83-3302-4cc6-8300-e602258d2530)

- Horizontal Pod Autoscaler automatically scales the number of pods in a replication controller, deployment, replica set or stateful set **based on observed CPU utilization** (or, with custom metrics support, on some other application-provided metrics).

    <br>

- While the upscaling should be based on CPU utilization, downscaling should not be immediate. This is because the CPU utilization can fluctuate and we don't want to keep scaling up and down. To avoid this, we can set a cooldown period.

    <br>

### Architecture

- If we were to revise on the architecture of Kubernetes -> it consisted of the following components:

  - **Master Node**:

    - API Server (the entry point for REST commands)
    - Controller Manager (for maintaining the desired state)
    - Scheduler (for scheduling the pods)
    - etcd (for storing the configuration data)

  - **Worker Node**:

    - Kubelet (for managing the pods)
    - Kube Proxy (for managing the networking)
    - Container Runtime (for running the containers)

    <br>

- In the Master Node, just like Controller Manager, we also have a **Horizontal Pod Autoscaler Controller** which is responsible for scaling the pods.

    <br>

- The Horizontal Pod Autoscaler Controller queries the **Metrics Server** which is responsible for collecting the metrics from the pods.

    <br>

### Installing a Metrics Server

1. Create a Kubernetes Cluster on Vultrr (recommended) or any other cloud provider.
   <img width="660" alt="Screenshot 2024-06-16 at 7 27 40 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/72f4421f-c15e-4c21-9b65-8d40ef3eb840">


<br>

2. Download the config file and replace your `~/.kube/config` file with the downloaded config file.
   <img width="660" alt="Screenshot 2024-06-16 at 7 30 08 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/40fccdc1-10a7-4add-b3f7-6c685f95c36a">

   <br>

4. Install the Metrics Server from the repository:

   ```bash
   kubectl apply -f https://github.com/100xdevs-cohort-2/week-28-manifests/blob/main/components.yml
   ```

   <br>

5. Check if the Metrics Server is running:

   ```bash
   kubectl top pod -n kube-system
   kubectl top nodes -n kube-system
   ```

    <br>

- The Metrics Server should now be installed and running.
  <img width="453" alt="Screenshot 2024-06-16 at 7 32 53 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/67e86997-c0f6-4617-99f7-75251fb054e1">


---

<br>

- Now that we have the Metrics Server installed, we can proceed to create a deployment for our application.

    <br>

- We will use a cpu intensive sample nodejs application deployed on dockerhub [here](https://hub.docker.com/r/100xdevs/week-28) to test the Horizontal Pod Autoscaler.

      <br>

### Creating a Deployment

1.  Check the `hpa/deployment.yaml` file to see the deployment configuration.

    ```bash
    kubectl apply -f hpa/deployment.yaml
    ```

    <details>
    <summary><b>Explaining deployment.yaml</b></summary>

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
    name: cpu-deployment
    spec:
        replicas: 2
        selector:
            matchLabels:
            app: cpu-app
        template:
            metadata:
            labels:
                app: cpu-app
            spec:
            containers:
                - name: cpu-app
                image: 100xdevs/week-28:latest
                ports:
                    - containerPort: 3000
    ```

    **Explanation**:

    - We are creating a deployment with 2 replicas.

    - `spec`:

      - `containers`: The container configuration.

        - `name`: The name of the container.

        - `image`: The image to be used. In our case, we will use the `100xdevs/week-28:latest` which is a cpu intensive nodejs application.

        - `ports`: The ports to be exposed.

    </details>

    <br>

2.  Next, we will expose the deployment using a service.

    ```bash
    kubectl apply -f hpa/service.yaml
    ```

    <details>
    <summary><b>Explaining service.yaml</b></summary>

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
    name: cpu-service
    spec:
    selector:
        app: cpu-app
    ports:
        - protocol: TCP
        port: 80
        targetPort: 3000
    type: LoadBalancer
    ```

    **Explanation**:

    - We are creating a service to expose the deployment.

    - `spec`:

      - `selector`: The selector to select the pods. In our case, we will select the pods with the label `app: cpu-app`.

      - `ports`: The ports to be exposed.

      - `type`: The type of service. In our case, we will use `LoadBalancer`.

    </details>

    ![image](https://github.com/user-attachments/assets/417d96cd-a83d-472c-b2e3-814ee205e9f1)

---

- Now that we have the deployment and service created, we can proceed to create the Horizontal Pod Autoscaler.

    <br>

- The only change we need to make in the deployment is to add the the min-max replicas and the target CPU utilization.

    <br>

### Creating a Horizontal Pod Autoscaler

1. Check `hpa/horizontal_pod_autoscaler.yaml` file to see the configuration.

   ```bash
   kubectl apply -f hpa/horizontal_pod_autoscaler.yaml
   ```

   <details>
   <summary><b>Explaining horizontal_pod_autoscaler.yaml</b></summary>

   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
   name: cpu-hpa
   spec:
   scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: cpu-deployment
   minReplicas: 2
   maxReplicas: 5
   metrics:
       - type: Resource
       resource:
           name: cpu
           target:
           type: Utilization
           averageUtilization: 50
   ```

   **Explanation**:

   - We are creating a Horizontal Pod Autoscaler for the deployment `cpu-deployment`.

   - `spec`:

     - `scaleTargetRef`: The reference to the deployment.

     - `minReplicas`: The minimum number of replicas. In our case, we will use `2`.

     - `maxReplicas`: The maximum number of replicas. In our case, we will use `5`.

     - `metrics`: The metrics to be used for scaling.

       - `type`: The type of metric. In our case, we will use `Resource`.

       - `resource`: The resource to be used. In our case, we will use `cpu` with a target average utilization of `50`.

   </details>

   <br>

2. Check the status of the Horizontal Pod Autoscaler.

   ```bash
   kubectl get hpa
   ```

   - **Note**: If we would have installed the metrics from official repo, it should not able to get the CPU percentage. This is because an issue related to Metrics Server not being able to get the metrics from the pods.

   - To fix this, we have installed the metrics server from our customized repo fixing the issue [here](https://github.com/100xdevs-cohort-2/week-28-manifests/blob/main/components.yml). Reapply the hpa and check the status.
     
     <img width="407" alt="Screenshot 2024-06-16 at 7 56 29 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/e8932a0a-0262-4d49-b717-3681a8307865">
     
     <img width="407" alt="Screenshot 2024-06-16 at 7 57 51 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/486e37df-4a99-4b37-bd51-d886ba1e52e1">


   - The above fix adds resource requests and limits to the pods which is necessary for the metrics server to get the metrics.

   <br>

3. Also, check the distribution of load over the pods.

   ```bash
   kubectl get pods
   ```
   
   <br>

4. Try hitting the service endpoint you created earlier using the browser and check the cpu utilization of the pods:

   ```bash
   kubectl get hpa
   kubectl get pods
   ```
   <img width="443" alt="Screenshot 2024-06-16 at 7 55 29 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/7661a4cf-1eac-4905-8047-309ff9532ec5">
   <img width="443" alt="Screenshot 2024-06-16 at 7 58 15 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/5f2d5cff-34be-47d3-9234-61bca38eeb87">

   **Note**: Since, we had a cluster with only 4 nodes, the autoscaler will not be able to scale the pods beyond 4.

---

### Formula for scaling up

<img width="500" alt="Screenshot 2024-06-16 at 7 58 16 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/e63ca786-597f-4a83-9394-a965896af76d">
<img width="500" alt="Screenshot 2024-06-16 at 7 58 16 PM" src="https://github.com/user-attachments/assets/77987be1-0a3b-4e8f-9f97-5a4128b0c07d">

- The formula for scaling up is:

  ```
  desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
  ```

  - `currentReplicas`: The current number of replicas.

  - `currentMetricValue`: The current metric value.

  - `desiredMetricValue`: The desired metric value.


---

## Resource requests and limits

- Resource requests and limits are the mechanism to control the amount of resources that a container can use.

    <br>

- The `requests` are the amount of resources that the container is guaranteed to get.

    <br>

- The `limits` are the maximum amount of resources that the container can use.

    <br>

### Diff b/w requests and limits

| Resource | Requests   | Limits  |
| -------- | ---------- | ------- |
| CPU      | Guaranteed | Maximum |
| Memory   | Guaranteed | Maximum |
| Storage  | -          | Maximum |
| Network  | -          | Maximum |
| GPU      | -          | Maximum |

<br>

### Experiments

1. Check the `resource-management/manifest1.yml` file to see the changes made to previous deployment configuration.

   ```bash
   kubectl apply -f resource-management/manifest1.yml
   ```

   <details>
   <summary><b>Explaining manifest1.yml</b></summary>

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
   name: cpu-deployment
   spec:
   replicas: 2
   selector:
       matchLabels:
       app: cpu-app
   template:
       metadata:
       labels:
           app: cpu-app
       spec:
       containers:
       - name: cpu-app
           image: 100xdevs/week-28:latest
           ports:
           - containerPort: 3000
           resources:
           requests:
               cpu: "100m"
           limits:
               cpu: "300m"
   ```

   **Explanation**:

   - The above configuration will ensure that the container gets at least `100m` of CPU and can use up to `300m` of CPU.

   - We are adding the `resources` field to the container configuration.

   - `requests`: The amount of resources that the container is guaranteed to get.

   - `limits`: The maximum amount of resources that the container can use.

   - `cpu`: The amount of CPU to be used. In our case, we will use `100m` as the request and `300m` as the limit.

   - `m`: The unit of CPU. `m` stands for milliCPU.

    </details>

   <br>

2. Check the `resource-management/manifest2.yml` to check the changes made to the previous deployment configuration.

   ```bash
   kubectl apply -f resource-management/manifest2.yml
   ```

   <details>
   <summary><b>Explaining manifest2.yml</b></summary>

   ```yaml
   apiVersion: apps/v1
    kind: Deployment
    metadata:
    name: cpu-deployment
    spec:
    replicas: 10
    selector:
        matchLabels:
        app: cpu-app
    template:
        metadata:
        labels:
            app: cpu-app
        spec:
        containers:
        - name: cpu-app
            image: 100xdevs/week-28:latest
            ports:
            - containerPort: 3000
            resources:
            requests:
                cpu: "1000m"
            limits:
                cpu: "1000m"
   ```

   **Explanation**:

   - We are increasing the number of replicas to `10`.

   - We are increasing the `requests` and `limits` to `1000m`.

   - But, since our cluster has only 4 nodes, the autoscaler will not be able to scale the pods beyond 4.

    </details>

    <br>

## Cluster Autoscaling

- Cluster Autoscaler automatically adjusts the size of the Kubernetes cluster when pods are unschedulable due to resource constraints.

    <br>

- is also responsible for adding and removing nodes from the cluster.

    <br>

- For eg: In our previous experiment, we had a cluster with only 4 nodes. If we try to scale the pods beyond 4, the pods will be unschedulable.

    <br>

- To fix this, we can enable the Cluster Autoscaler.

    <br>

- We can adjust the minimum and maximum number of nodes in the cluster by going to the `Node Pools` section in the cloud provider's console.

    <br>

- Restart the previous example deployment manifest and check the status of the pods:

  ```bash
  kubectl delete deployment cpu-deployment
  kubectl apply -f resource-management/manifest2.yaml
  ```

    <br>

- The Cluster Autoscaler will automatically add nodes to the cluster to schedule the pods.

  <img width="500" alt="Screenshot 2024-06-16 at 7 58 17 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/05892bc4-1f27-4be9-81cd-828e03985fe7">
