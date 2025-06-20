# Kubernetes Part - 1 (Contd.)

## Summarizing Previous Session

- We revised the deployment strategy using Docker and to cloud.
- In previous session, we went through the introduction to Kubernetes and its architecture.
- Using Kind, we created a cluster with 3 worker nodes.
- Today, we will learn the concepts of services and use them to deploy our cluster on cloud.

<br>

## Deployment using Docker v/s K8s

<img width="600" alt="Screenshot 2024-06-02 at 7 09 33 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/e8e32e4b-25b0-4049-890d-2f92baab1bf7">


| Docker                                       | Kubernetes                                  |
| -------------------------------------------- | ------------------------------------------- |
| can run an image in a single container       | can run multiple containers in a single pod |
| contains a single node                       | contains multiple - master and worker nodes |
| can run multiple containers in a single node | can run multiple pods in a single node      |

<br>

## Revising Cluster & Pod Creation

- Go to previous session to see the installation of 'Kind' and creating a cluster with 3 worker nodes.

    <br>

- Check the `k8s/cluster2.yml` to check the configuration of the cluster and create the cluster using the following command:

  ```bash
  kind create cluster --config cluster2.yml --name 100x-cluster2
  ```

  - Check the nodes running:

    ```bash
    kubeclt get nodes
    ```

  - Delete the cluster:

    ```bash
    kind delete cluster --name 100x-cluster2
    ```

    <br>

- To create pod with the name `nginx` using the image `nginx` and PORT `80`, run the following command:

  ```bash
  kubectl run nginx --image=nginx --port=80
  ```

  - Check the pods

    ```bash
    kubectl get pods
    ```

  - Delete the pod

    ```bash
    kubectl delete pod nginx
    ```

<br>

## Deployments

- Till now, we were the ones managing the pods and containers.

- But, can we automate the process of managing the pods?

- Yes, we can do that using `Deployments`.

- A `Deployment` is a higher-level concept that manages `Pods` and `ReplicaSets`.

- It offers the following features:

  - **Rollouts and Rollbacks**: allows you to update the pod with new images and rollback to the previous version if something goes wrong.

  - **Scaling**: helps us scale the number of pods. Eg: starting and stopping the pods based on the load.

  - **Self-Healing**: It replaces the failed pods with new ones.

<br>

### Difference b/w Pod and Deployment

| Pod                                         | Deployment                                                  |
| ------------------------------------------- | ----------------------------------------------------------- |
| Manages a single instance of an application | Manages multiple instances of an application                |
| We need to create and manage the pods       | It itselfs creates and manage the pods (using `Replicaset`) |

<br>

### Creating a Deployment

- Let's create a deployment that starts 3 pods

1. First, we need a deployment configuration file. Check the `k8s/deployment-class.yml` file:

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
    name: nginx-deployment
   spec:
    replicas: 3
    selector:
        matchLabels:
        app: nginx
    template:
        metadata:
        labels:
            app: nginx
        spec:
            containers:
            - name: nginx
                image: nginx:latest
                ports:
                - containerPort: 80
   ```

    <details>
    <summary>Explaining above configuration</summary>

   - `apiVersion`: The version of the Kubernetes API that we are using.

   - `kind`: The type of resource that we are creating. In this case, it is a `Deployment`.

   - `metadata`: The metadata of the deployment. contains the name of the deployment.

   - `spec`: specification of the deployment. contains the following fields:

     - `replicas`: The number of pods that we want to create.

     - `selector`: labels that the deployment uses to select the pods that it manages. tells how to find the pods that the deployment want to manage. In this case, the deployment selects the pods that matches the label `app: nginx`.

     - `template`: The template for the pods that the deployment creates. It contains the following fields:

     - `metadata`: The metadata of the pods. It contains the labels that the deployment uses to select the pods.

     - `spec`: The specification of the pods. contains the following fields (Notice, this remains the same as the configuration of the pod):

       - `containers`: containers that the pods run. In this case, we have one container that runs the `nginx` image.

       - `name`: name of the container.

       - `image`: image that the container runs.

       - `ports`: ports that the container exposes. In this case, the container exposes port `80`.

    </details>

    <br>

2. Go to `/k8s` folder. Create the deployment using the following command:

   ```bash
   kubectl apply -f deployment-class.yml
   ```

   - Check the deployments:

     ```bash
     kubectl get deployments
     ```

   **Notice**: we didn't create the pods ourselves. The deployment created the pods for us.

   **Fun Testing**: Try deleting a pod below command and see if the deployment creates a new pod:

   ```bash
    kubectl delete pod <pod-name>
   ```

   <br>

3. To delete the deployment, run the following command:

   ```bash
   kubectl delete deployment nginx-deployment
   ```

<br>

## ReplicaSets

- In the above deployment, we saw that the deployment created the pods for us.

- But, it was not actually the deployment that created the pods. It was the `ReplicaSet` that created the pods.

- A `ReplicaSet` is a lower-level concept that manages the number of pods that are running.

  - also ensures that a specified number of pod replicas are running at any given time.

- Let's create a `ReplicaSet` that starts 3 pods 👇

1. Check the `k8s/rs.yml` file:

   ```yaml
   apiVersion: apps/v1
   kind: ReplicaSet
   metadata:
   name: nginx-replicaset
   spec:
   replicas: 3
   selector:
       matchLabels:
       app: nginx
   template:
       metadata:
       labels:
           app: nginx
       spec:
       containers:
           - name: nginx
           image: nginx:latest
           ports:
               - containerPort: 80

   ```

2. Go to `/k8s`. Create the ReplicaSet using the following command:

   ```bash
   kubectl apply -f rs.yml
   ```

   - Check the ReplicaSets:

     ```bash
     kubectl get replicaset
     ```

3. To delete the ReplicaSet, run the following command:

   ```bash
   kubectl delete replicaset nginx-replicaset
   ```

<br>

### Why do we even need a Deployment?

- As we saw above, a deployment was only creating the ReplicaSet.

    <br>

- It was the ReplicaSet that was creating and managing the pods.

    <br>

- So, why do we even need a deployment?

<br>

- **The answer is `Rollouts and Rollbacks`.**

<br>

**Understanding with a situation**

<img width="583" alt="Screenshot 2024-06-02 at 7 52 26 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3713af67-bccd-44f1-ba0d-81e0e32ceaf0">

- Assume we have a deployment that runs a replicaset created that starts 3 pods.

- Now, we by mistake push a new image to the deployment that has a bug.

- Then, the deployment will **create a new replicaset** with the new image.

  - It will check if the new pods are running successfully.

  - If yes, it will **delete the old replicaset**.

  - If no, it will **rollback to the previous version**.
 
<br>

## Services

- Till now, we were able to create pods and manage them using deployments and replicaset.

- But, we still can't access the pods.

- In Docker, it was easy to access the container using the container's IP address.

- But, in Kubernetes, the pods are ephemeral. They can be created and deleted anytime.

- So, we need a way to access the pods even if they are deleted and recreated.

- This is where `Services` come into play.

  <img width="417" alt="Screenshot 2024-06-02 at 8 10 52 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/56acbe08-e2a2-45a9-a985-81507793f4f5">

- A `Service` is an abstraction that defines a logical set of pods and a policy by which to access them. So we need to give 2 things to the services file ~ `which all pods it can access` and `how it can access them`

- It is a stable endpoint that exposes the pods to the outside world.

- There are 4 types of services:

  - **ClusterIP**: Exposes the service on a cluster-internal IP. This type makes the service only reachable from within the cluster.

  - **NodePort**: Exposes the service on each Node's IP at a static port. This type makes the service reachable from outside the cluster using `<NodeIP>:<NodePort>`.

  - **LoadBalancer**: Exposes the service externally using a cloud provider's load balancer.

  - **ExternalName**: Maps the service to the contents of the `externalName` field.

  <br>

- Let's create a service that exposes the pods created by the deployment 👇

<br>

### Creating a NodePort Service

1. Check the `k8s/service.yml` file:

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
   name: nginx-service
   spec:
   selector:
       app: nginx
   ports:
       - protocol: TCP
       port: 80
       targetPort: 80
       nodePort: 30007 # This port can be any valid port within the NodePort range
   type: NodePort
   ```

    <details>
    <summary>Explaining configuration file</summary>

   - `apiVersion`: The version of the Kubernetes API that we are using.

   - `kind`: The type of resource that we are creating. In this case, it is a `Service`.

   - `metadata`: The metadata of the service. contains the name of the service.

   - `spec`: specification of the service. contains the following fields:

     - `selector`: labels that the service uses to select the pods that it exposes. tells how to find the pods that the service exposes. In this case, the service selects the pods that matches the label `app: nginx`.

     - `ports`: ports that the service exposes. contains the following fields:

       - `protocol`: protocol that the service uses. In this case, it is `TCP`.

       - `port`: port that the service listens on.

       - `targetPort`: port that the service forwards the traffic to. In this case, it is `80`.

       - `nodePort`: The port that the service listens on the nodes. This port can be any valid port within the NodePort range.

     - `type`: The type of the service. In this case, it is `NodePort`. This type exposes the service on a port on each node in the cluster.

    </details>

    <br>

2. Go to `/k8s`. Create the service using the following command:

   ```bash
   kubectl apply -f service.yml
   ```

   - Check the services:

     ```bash
     kubectl get services
     ```

     <br>

     ![image](https://github.com/user-attachments/assets/fc204bbe-4748-41d6-9cf7-f1f91f2119ac)
     `Note: You can send traffic to any node’s IP:NodePort, and Kubernetes will internally load-balance and route the request to the right pod — even if that pod lives on a different node.`

3. Note the `NodePort` of the service. Although, we will not be able to access the service using the `NodePort` as we are using `Kind`.

    <img width="660" alt="Screenshot 2024-06-02 at 8 25 12 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/e8e9e631-9acf-427d-8c3d-86ee6eca31be">

<br>

4. To access the service, we need to port-map the `NodePort` to the `ClusterIP` of the service. So, in short, we restart the clusters with the port mapping configured. Before that, delete the old cluster using the following command:

   ```bash
   kind delete cluster --name 100x-cluster2
   ```

5. Create the clusters with the port configuration file `k8s/kind-port-map.yml`:

   ```yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
   - role: control-plane
   extraPortMappings:
   - containerPort: 30007
      hostPort: 30007

   - role: worker
   extraPortMappings:
   - containerPort: 30007
      hostPort: 30008
      
   - role: worker
   extraPortMappings:
      - containerPort: 30007
         hostPort: 30009
   ```
   ![image](https://github.com/user-attachments/assets/04eda87e-1259-4058-90be-3023419ff9b1)

6. Restart the cluster using the above configuration file:

   `Note: before starting this new cluster using kind-port-map.yml remember to delete the previous cluster that we created using "kind create cluster --config cluster2.yml --name 100x-cluster2" that follows the cluster2.yml configuration without services by using "kind delete cluster --name 100x-cluster2"`

   ```bash
   kind create cluster --config kind-port-map.yml --name 100x-cluster2
   ```
   `so our new cluster 100x-cluster2 now has services in it so we can talk to pods directly from the browser and it follows the kind-port-map.yml`

7. Delete the previous service and the deployment:

   ```bash
   kubectl delete service <service-name>
   kubectl delete deployment <deployment-name>
   ```

8. Create the deployment and the service again:

   ```bash
   kubectl apply -f deployment-class.yml
   kubectl apply -f service.yml
   ```

9. Now, you can access the service at `http://localhost:30007`.

   `NodePort Service representation` ![image](https://github.com/user-attachments/assets/43b358e0-56dd-4dab-899b-a8402af408ac)

**Disadvantages of NodePort Service**

- The `NodePort` service exposes the service on a port on each node in the cluster.

- This means that the service is accessible from outside the cluster using the `<NodeIP>:<NodePort>`.

- But, this is not a good way to expose the service to the outside world. ❌

<br>

### Creating a LoadBalancer Service

**Advantages of LoadBalancer Service**
<img width="879" alt="Screenshot 2024-06-02 at 8 34 23 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/7138ba87-4229-46a3-b9cc-4e8d7f792c13">

- The `LoadBalancer` service exposes the service externally using a cloud provider's load balancer.

- This means that the service is accessible from outside the cluster using the `LoadBalancer` IP.

- This is a better way to expose the service to the outside world. ✅

- But, we can't use the `LoadBalancer` service with `Kind`.

- So, we will use `Vultr` to create a cluster and expose the service using the `LoadBalancer` service 👇

1. Create a new account on Vultr.
   <br>
2. Click on `Kubernetes` Tab and then click on `Create Cluster`.
   <img width="1037" alt="Screenshot 2024-06-02 at 8 41 04 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/710b531a-01b1-49a9-9a16-edce45d97130">
   <br>
4. After its created, download its configuration.
   <br>
5. Replace your `~/.kube/config` file with the downloaded configuration file.
   <br>
6. Change the `type` of the service to `LoadBalancer` in the `k8s/service.yml` file:

   ```yaml
   ---
   type: LoadBalancer
   ```

   <br>

7. Create the deployment and the service again:

   ```bash
   kubectl apply -f deployment-class.yml
   kubectl apply -f service.yml
   ```

   <br>

8. Check the services:

   ```bash
   kubectl get services
   ```

   <br>

9. Access the service using the `LoadBalancer` IP.
