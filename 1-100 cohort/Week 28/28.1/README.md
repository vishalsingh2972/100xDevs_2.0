# Kubernetes Part 2

## Quick Recap

1. **Cluster**: a small group of servers that work together to provide a service. Todo: Create a cluster with 2 nodes on (Vultr)[https://www.vultr.com/].

2. **Node**: a single server within a cluster.

3. **Pods**: the smallest deployable units in Kubernetes. A Pod encapsulates an application's container (or, in some cases, multiple containers), storage resources, a unique network IP, and options that govern how the container(s) should run.

4. **ReplicaSet**: ensures that a specified number of pod replicas are running at any given time.

5. **Deployment**: provides declarative updates to Pods and ReplicaSets. In short, a Deployment helps you manage Pods and ReplicaSets.

   <br>

   **Difference b/w Deployment & ReplicaSet**: Deployment lets you do rolling updates and rollbacks using ReplicaSets.

   <br>

6. **Service**: an abstract way to expose an application running on a set of Pods as a network service.

---

## Summarizing Steps

_**Note**: If you have a cluster, it will automatically create the nodes. If you have a deployment, it will automatically create replicasets and pods._

So, the steps to start a complete Kubernetes service are:

1. Start a cluster.
2. Create a deployment.
3. Create a service.

### Starting a Cluster

**Locally**

1. Check `/k8s/cluster.yml` for the cluster configuration.

2. Open the `/k8s` folder in terminal. Run the following command to start the cluster:

   ```bash
   kind create cluster --config cluster.yml --name k8s-cluster
   ```

<p align="center">------or------</p>

**Cloud Provider**

1. Create a cluster on a cloud provider (for eg: Vultr).

2. Download the configuration file and replace `~/.kube/config` with it.

### Starting the Deployment

1. Check the `/k8s/deployment.yml` file for the deployment configuration.

2. Open the `/k8s` folder in terminal. Run the following command to start the deployment:

   ```bash
   kubectl apply -f deployment.yml
   ```

3. Check if the deployment is running:

   ```bash
   kubectl get deployments
   ```

### Starting the Service

1. Check the `/k8s/service.yml` file for the service configuration.

  <br>

2. Open the `/k8s` folder in terminal. Run the following command to start the service:

   ```bash
   kubectl apply -f service.yml
   ```

  <br>

3. Go to `http://localhost:30007` to see the service running.
   <img width="500" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/cfad1539-6c34-4999-ad7d-235d8a822fc5">


- To export the service using an external LoadBalancer ip, Follow the Cloud Provider step to create the cluster, replace the type of service to LoadBalancer in the service.yml file and restart it.

  <br>

- Copy the external ip and go to `http://<external-ip>:<port>` to see the service running.

  <br>

**Additional Comments**

- To delete the deployment, run:

  ```bash
  kubectl delete deployment <deployment-name>
  ```

- To delete the service, run:

  ```bash
  kubectl delete service <service-name>
  ```

- To delete the cluster, run:

  ```bash
    kind delete cluster --name k8s-cluster
  ```

  **Note**: The above steps are a quick recap of the previous week's learnings. For a detailed explanation, please refer to the previous week's README.

     <br>

---

## Downsides of Services

- **Scaling to multiple apps**:

  - If you have multiple apps, you need to create multiple services.
  - There also limits to how many load balancers you can create.

- **Multiple Certificates for every route**:

  - If you have load balancers, you need to have certificates for every route.

- **No Centralized Control to rate limitting**:

  - You need to manage every service separately.

  <br>

  When our app comes into the above scenarios, we need an **Ingress Controller**.

---

## Ingress & Ingress Controller

![image](https://github.com/user-attachments/assets/8af252bb-3578-4dc7-8292-fbf7de14a454)

- _Ingress is an API object that manages external access to services in a cluster, typically HTTP._

  <br>

- It will provide a single load balancer which will act as a gateway to all the services.

  <br>

- We connect this load balancer with our ingress resource point which routes the traffic to the respective services.

  <br>

- We can't use ingress without an ingress controller. Some of the popular ones can be found [here](https://kubernetes.io/docs/concepts/services-networking/ingress/).

  <br>

- The overall architecture and process looks something like this:
  <img width="500" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/2d742963-6b98-479e-bc67-0ad2167f60ee">

  <img width="500" alt="Screenshot 2024-06-08 at 7 59 22 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/7c67694b-4f2f-436b-8db6-e4067f204692">


  **Note**: We only create the `ingress`, not the `ingress controller` (just like we can create a `deployment`, but not a `deployment controller`).

  <br>

- Before that, we need to understand the concept of `Namespaces`.

---

## Namespaces

- **It is a way to divide cluster resources between multiple users.**

  <br>

- Try running the below command to see the namespaces:

  ```bash
  kubectl get namespaces
  ```

  <br>

- By default, all the resources are created in the `default` namespace.

  <br>

- To see all pods running **including the internal ones**:

  ```bash
  kubectl get pods --all-namespaces
  ```

  <br>

- You can use it to structure your pods and services better.

  For eg: If you want to seperate your `backend` pods from the rest of pods running. **Just add `namespace: backend` just after the `name` tag under `metadata` and re-apply the deployment**:

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: nginx-deployment
    namespace: backend-team
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

  <br>

- Now, If you want to see everything for a particular namespace (for eg: `backend-team`), you can set a default context for the namespace:

  ```bash
  kubectl config set-context --current --namespace=backend-team
  ```

  - Check the pods for the namespace:

    ```bash
    kubectl get pods
    ```

  <br>

- To switch back to the default namespace:

  ```bash
  kubectl config set-context --current --namespace=default
  ```

---

## Starting with Ingress Controller

- We will use the `nginx-ingress-controller` for this.

  <br>

- When we start the ingress controller, we will be needing to provide a big configuration file to it.

  <br>

- Instead, we can use `helm` to pass this configuration file to the ingress controller.

  <br>

  - Install `helm` following the instructions [here](https://helm.sh/docs/intro/install/).

  <br>

  - Add the `ingress-nginx` repository to `helm`:

    ```bash
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
    ```

    <br>

    - Check if the ingress controller is running:

      ```bash
      kubectl get pods -n ingress-nginx
      ```

    <br>

    - Now, after the above commands are run, you will see a load balancer created in the cloud provider. You can check it by running:

      ```bash
      kubectl get svc -n ingress-nginx
      ```

    <br>

- Till now, we have managed to create the `ingress` managed load balancer along with the first pod which will be the gateway to all the services.
  <img width="643" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/d4520808-3135-48c0-a88f-58babe0531d0">


  <br>

- Now, we need to _create an `ingress` object_ to **route the traffic to the services**.

---

## Creating Ingress Object

   <p align="center"><img width="500" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/137349a5-0d8a-4024-a8f8-0ee94c50feae"></p>

1. Now, we will be performing the action to route the traffic to individual services (for eg: `nginx` and `apache` in this case).

  <br>

2. Before that, delete all the previous deployments and services under the `default` namespace:

   ```bash
   kubectl delete deployment --all
   kubectl delete service --all
   ```

  <br>

3. Create the `deployment` and `service` for `nginx` and `apache`:

   ```bash
   kubectl apply -f nginx-deployment-service.yml
   kubectl apply -f apache-deployment-service.yml
   ```

   > Note: Here, we have written the configuration for `deployment` and `service` in the same file each for `nginx` and `apache`.

  <br>

4. Next, we create the `ingress` resource to route the traffic to the services. Check the `ingress/ingress.yml` file for the configuration. Open the `/ingress` folder in terminal and run the following command to start the ingress:

   ```bash
   kubectl apply -f ingress.yml
   ```

   <details> <summary><b>ingress.yml</b></summary>

   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
   name: web-apps-ingress
   namespace: default
   annotations:
     nginx.ingress.kubernetes.io/rewrite-target: /
   spec:
   ingressClassName: nginx
   rules:
     - host: your-domain.com
       http:
         paths:
           - path: /nginx
             pathType: Prefix
             backend:
               service:
                 name: nginx-service
                 port:
                   number: 80
           - path: /apache
             pathType: Prefix
             backend:
               service:
                 name: apache-service
                 port:
                   number: 80
   ```

   **Explanation**:

   - `metadata`: contains the name of the ingress object and the namespace in which it is created.

     - `annotations`: contains the annotation `nginx.ingress.kubernetes.io/rewrite-target: /` which is used to rewrite the URL. This is used to remove the `/nginx` and `/apache` from the URL and route the traffic to the respective services. This is because the ingress controller will route the traffic to the services based on the path. For eg: if the URL is `your-domain.com/nginx`, the traffic will be routed to the `nginx-service` and if the URL is `your-domain.com/apache`, the traffic will be routed to the `apache-service`.

   - `spec`:

     - `ingressClassName`: specifies the class name of the ingress controller. Here, we are using the `nginx` ingress controller.

     - `rules`: contains the rules to route the traffic to the services based on the path.

       - `host`: specifies the domain name. Here, we are using `your-domain.com`.

       - `http`: contains the paths to route the traffic to the services.

         - `path`: specifies the path. Here, we are using `/nginx` and `/apache`.

         - `pathType`: specifies the type of path. Here, we are using `Prefix`.

         - `backend`: contains the service to which the traffic is routed.

           - `service`: specifies the name of the service. Here, we are using `nginx-service` and `apache-service`.

           - `port`: specifies the port number. Here, we are using `80`.

     </details>

<p align="center">-----or-----</p>

3. You can skip steps 3 & 4. Just use the combined manifest file `ingress/combined-ingress.yml` to create the deployment, service and ingress objects at once:

   ```bash
   kubectl apply -f combined-ingress.yml
   ```

   <br>

- To test it, we can use the hack of spoofing any doman name for our machine. Add the below line to the `/etc/hosts` file:

  ```bash
  [YOUR_LOAD_BALANCER_IP] [DOMAIN_NAME_YOU_WANT_TO_SPOOF]
  ```

    <br>

  - Check if we are seeing the correct response, then :

    ```bash
    ping [DOMAIN_NAME_YOU_WANT_TO_SPOOF]
    ```

    <br>

  - After it's done, try going to `http://[DOMAIN_NAME_YOU_WANT_TO_SPOOF]/nginx` and `http://[DOMAIN_NAME_YOU_WANT_TO_SPOOF]/apache` to see the services running.
 
    <img width="296" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/24855af7-669b-49f6-815b-704506232bfe"> &ensp; <img width="325" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/16407a0b-b076-449c-8162-2087709deb22">



---

## Exploring alternative controllers: Traefik

- Traefik is another popular ingress controller.
- More Info on setting it up [here](https://projects.100xdevs.com/tracks/kubernetes-part-2/Kubernetes-Part-2-12).

---

## Secrets & ConfigMaps

- Kubernetes provides `Secrets` and `ConfigMaps` to manage sensitive information and configuration data.

- There are some common practices to be followed:

  - We should always create a deployment rather than a pod.
  - We should always create config files using `yaml` rather than `json`.
  - In real-world scenarios, we generally use CI/CD pipelines like Github to run the manifest files on the cloud.

- A `secret` is an object that contains a small amount of sensitive data such as a password, a token, or a key.

- A `configMap` is an API object used to store non-sensitive data in key-value pairs.

### Difference b/w `Secrets` & `ConfigMaps`

| Secrets                                                                   | ConfigMaps                                                                                    |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Used to store sensitive information like passwords, tokens, SSH keys etc. | Used to store configuration data (non-sensitive information) like environment variables, etc. |
| Encoded in base64 format                                                  | Data stored in plain text                                                                     |
| Kubernetes provides integration with external secret management systems   | No such integration provided by Kubernetes                                                    |

- What a Secret config file looks like:

  ```yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: mysecret
  type: Opaque
  data:
    username: YWRtaW4=
    password: MWYyZDFlMmU2N2Rm
  ```

- What a config file looks like:

  ```yaml
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: myconfig
  data:
    username: admin
    password: 1f2d1e2e67df
  ```

  <br>

- Till now, if we were to pass environment variables (secrets) to the docker container, we would inject it when running the container.

  <br>

  - For eg: check the `secrets/src/express-app.ts` code to see how we read through the environment variables present in the directory.

  <br>

  - To see it's working, dockerize this app, deploy to Dockerhub and run it while passing some enviornment variables:

    ```bash
    # Build the image
    docker build -t [DOCKERHUB_USERNAME]/week28-2 .

    # Push the image to Dockerhub
    docker push [DOCKERHUB_USERNAME]/week28-2

    # Run the image while passing the environment variables
    docker run -e  -p 3003:3000 -e DATABASE_URL=asd [DOCKERHUB_USERNAME]/express-app
    ```

  <br>
  
  - Check it's working by going to `localhost:3003` of your machine and see the environment variables passed to the container getting displayed:

    <img width="686" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3739af1e-85b6-4002-987e-2a1ca39a6c0c">

  <br>

- Similarly, we can pass the secrets and configMaps to the kubernetes pods.
