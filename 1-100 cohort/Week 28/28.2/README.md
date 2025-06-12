# Kubernetes Part 3

## Secrets and ConfigMaps

- Until now, we have been using environment variables (if anywhere) or `yaml` files to pass configuration to our containers. This is not a good practice, as it can expose sensitive information.

  <br>

- For eg: If we were to deploy a docker container, we never pass the environment variables or configuration data in the `Dockerfile`. We pass it as arguments to the `docker run` command. Similarly, in Kubernetes, we should not pass configuration data in the `yaml` files.

  <br>

- Kubernetes provides two resources to handle such data: Secrets and ConfigMaps.

## ConfigMap

- A ConfigMap is an API object used to store non-confidential data in key-value pairs.

  <br>

- It can be used to store configuration data, command-line arguments, environment variables, port numbers, etc.

  <br>

### Creating a ConfigMap

1. Go to `/configmap/configmp.yml` file to check the `yaml` file for creating a ConfigMap.

   <details>
    <summary><b>Explaining YAML</b></summary>

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: ecom-backend-config
   data:
     database_url: 'mysql://ecom-db:3306/shop'
     cache_size: '1000'
     payment_gateway_url: 'https://payment-gateway.example.com'
     max_cart_items: '50'
     session_timeout: '3600'
   ```

   **Explanation**:

   - `apiVersion`: The version of the Kubernetes API.
   - `kind`: The type of resource.
   - `metadata`: The metadata of the resource.
     - `name`: The name of the ConfigMap.
   - `data`: The key-value pairs of the ConfigMap.
     - `database_url`: The URL of the database.
     - `cache_size`: The size of the cache.
     - `payment_gateway_url`: The URL of the payment gateway.
     - `max_cart_items`: The maximum number of items in the cart.
     - `session_timeout`: The timeout for the session.

   </details>

   <br>

2. Go to `/configmap` dir in terminal. Apply the ConfigMap using the following command:

   ```bash
   kubectl apply -f configmp.yml
   ```

   - Check the ConfigMap using the following command:

     ```bash
     kubectl get configmap
     ```

   - Check the details of the ConfigMap using the following command:

     ```bash
     kubectl describe configmap ecom-backend-config
     ```

    <br>

### Using the ConfigMap

1. Check the `/configmap/deployment.yml` file to check the deployment configuration details.

   <details>
      <summary><b>Explaining YAML</b></summary>

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
   name: ecom-backend-deployment
   spec:
   replicas: 1
   selector:
      matchLabels:
         app: ecom-backend
   template:
      metadata:
         labels:
         app: ecom-backend
      spec:
         containers:
         - name: ecom-backend
         image: 100xdevs/env-backend
         ports:
         - containerPort: 3000
         env:
         - name: DATABASE_URL
            valueFrom:
               configMapKeyRef:
               name: ecom-backend-config
               key: database_url
         - name: CACHE_SIZE
            valueFrom:
               configMapKeyRef:
               name: ecom-backend-config
               key: cache_size
         - name: PAYMENT_GATEWAY_URL
            valueFrom:
               configMapKeyRef:
               name: ecom-backend-config
               key: payment_gateway_url
         - name: MAX_CART_ITEMS
            valueFrom:
               configMapKeyRef:
               name: ecom-backend-config
               key: max_cart_items
         - name: SESSION_TIMEOUT
            valueFrom:
               configMapKeyRef:
               name: ecom-backend-config
               key: session_timeout
   ```

   **Explanation**:

   - `image`: The image of the container. Here, we are using the `100xdevs/env-backend` image deployed on the DockerHub. The express-app code can be found in `Week 28.1/secrets/src/express-app.ts` folder.

   - `env`: The environment variables for the container.
     - `name`: The name of the environment variable. For eg: `DATABASE_URL`.
     - `valueFrom`: The source of the value. This can be a ConfigMap, Secret, etc.
       - `configMapKeyRef`: The reference to the ConfigMap we created.
         - `name`: The name of the ConfigMap. For eg: `ecom-backend-config`.
         - `key`: The key of the ConfigMap. The value of this key will be used as the value of the environment variable.

   </details>

   <br>

2. Go to `/configmap/` dir in terminal. Apply the deployment using the following command:

   ```bash
   kubectl apply -f deployment.yml
   ```

   - Check the deployment using the following command:

     ```bash
     kubectl get deployment
     ```

   <br>

3. Next, we create a service to expose our app. Check the `/configmap/service.yml` file to see the configuration details. Go to `/configmap` dir in terminal. Apply the service using the following command:

   ```bash
   kubectl apply -f service.yml
   ```

   - Check the service using the following command:

     ```bash
     kubectl get service
     ```

  <br>

4. Go to `localhost:30007` in the browser to see the app running.

   <img width="1582" alt="Screenshot 2024-06-09 at 7 47 19 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/291312b8-af39-4c2d-b4ff-74d72269898d">


  <br>

- To delete the deployment and service, use the following commands:

  ```bash
  kubectl delete -f service.yml
  kubectl delete -f deployment.yml
  ```

---

## Secrets

- A Secret is an API object used to store **sensitive data** in key-value pairs.

  <br>

- Used for storing sensitive information like passwords, tokens, etc which can then be used by the containers (in format of environment variables).

  <br>

- Here, the data is stored in base64 encoded format.

   <details><summary><b>What is Base64 encoding?</b></summary>

  - Base64 encoding is a way to encode binary data into an ASCII string.
  - For eg: The string `hello` in base64 encoding is `aGVsbG8=`.
  - **Why use?** to store binary data (or special characters) in a text format.
  </details>

  <br>

### Creating a Secret

- Lets try to store the database password in a Secret now.

1. Check the `/secret/secret.yml` file to see the configuration details for creating a Secret.

   <details>
      <summary><b>Explaining YAML</b></summary>

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: ecom-backend-secret
   type: Opaque
   data:
     database_password: cGFzc3dvcmQ=
     payment_gateway_token: dG9rZW4=
   ```

   **Explanation**:

   - `apiVersion`: The version of the Kubernetes API.
   - `kind`: The type of resource.
   - `metadata`: The metadata of the resource.
     - `name`: The name of the Secret.
   - `type`: The type of the Secret. `Opaque` is the default type.
   - `data`: The key-value pairs of the Secret.
     - `database_password`: The password of the database in base64 encoded format.

   </details>

   <br>

2. Go to `/secrets/` folder in terminal. Apply the Secret using the following command:

   ```bash
   kubectl apply -f secret.yml
   ```

   - Check the Secret using the following command:

     ```bash
     kubectl get secret
     ```

   - Check the details of the Secret using the following command:

     ```bash
     kubectl describe secret ecom-backend-secret
     ```

    <br>

3. Check the `/secret/deployment.yml` file to see the configuration details for using the Secret in the deployment.

   <details>
      <summary><b>Explaining YAML</b></summary>

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: ecom-backend-deployment
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: ecom-backend
     template:
       metadata:
         labels:
           app: ecom-backend
       spec:
         containers:
           - name: ecom-backend
             image: 100xdevs/env-backend
             ports:
               - containerPort: 3000
             env:
               - name: DATABASE_PASSWORD
                 valueFrom:
                   secretKeyRef:
                     name: ecom-backend-secret
                     key: database_password
               ...
   ```

   **Explanation**:

   - `env`: The environment variables for the container.
     - `name`: The name of the environment variable. For eg: `DATABASE_PASSWORD`.
     - `valueFrom`: The source of the value. This can be a ConfigMap, Secret, etc.
       - **`secretKeyRef`**: The reference to the Secret we created.
         - `name`: The name of the Secret from which we are taking the secret. For eg: `ecom-backend-secret`.
         - `key`: The key of the Secret. The value of this key will be used as the value of the environment variable.

   </details>

   <br>

4. Apply the deployment using the following command:

   ```bash
   kubectl apply -f deployment.yml
   ```

   - Check the deployment using the following command:

     ```bash
     kubectl get deployment
     ```

  <br>

5. Apply the service using the following command:

   ```bash
   kubectl apply -f service.yml
   ```

   - Check the service using the following command:

     ```bash
     kubectl get service
     ```

  <br>

6. Go to `localhost:30007` in the browser to see the app running with secrets coming from `secret.yml` file.

---

## Volumes and Persistent Volumes

- Till now, we have been storing all our secrets and configmaps in the Kubernetes API server. This is **not a good practice**, as it can expose sensitive information.

  <br>

- Kubernetes provides a way to store data in a more secure way using Volumes and Persistent Volumes.

  <br>

- A Volume is a directory that is accessible to all containers in a pod.

  <br>

- A Persistent Volume is a piece of storage in the cluster that has been provisioned by an administrator.

  <br>

- We can store the secrets in a file and mount that file as a volume (or in simple words: a folder) in the container. For eg: We can store the database password in the .env file and mount that file as a volume in the container.
  
  <img width="466" alt="Screenshot 2024-06-09 at 8 12 49 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/d4bba1ea-ca0c-412d-a8ce-1acc309b8101">

## Storing Secrets using Volume

1. Check the `/volume/secret.yml` file to see the configuration details for creating a Secret.

   <details>
      <summary><b>Explaining YAML</b></summary>

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: ecom-backend-secret
   data:
     .env: [YOUR_PASSWORD_IN_BASE64]
   ```

   **Explanation**:

   - `apiVersion`: The version of the Kubernetes API.
   - `kind`: The type of resource.
   - `metadata`: The metadata of the resource.
     - `name`: The name of the Secret.
   - `type`: The type of the Secret. `Opaque` is the default type.
   - `data`: The key-value pairs of the Secret.
     - `.env`: The secret in base64 encoded format.

   </details>

  <br>

2. Go to `/volume/` folder in terminal. Apply the Secret using the following command:

   ```bash
   kubectl apply -f secret.yml
   ```

   <br>

3. Next, check the `/volume/deployment.yml` file to see the configuration details for using the Secret in the deployment.

   <details>
      <summary><b>Explaining YAML</b></summary>

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: ecom-backend-deployment
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: ecom-backend
     template:
       metadata:
         labels:
           app: ecom-backend
       spec:
         containers:
           - name: ecom-backend
             image: 100xdevs/env-backend
             ports:
               - containerPort: 3000
             volumeMounts:
               - name: secret-volume
                 mountPath: /etc/secrets
                 readOnly: true
     volumes:
       - name: secret-volume
         secret:
           secretName: ecom-backend-secret
   ```

   **Explanation**:

   - **`volumeMounts`**: The volumes that should be mounted in the container. This volume is defined at the container level.

     - `name`: The name of the volume. This should match the name of the volume in the `volumes` section.
     - `mountPath`: The path where the volume should be mounted in the container. In our case, we are mounting the volume at `/etc/secrets`.
     - `readOnly`: Whether the volume should be read-only or not.

     <br>

   - **`volumes`**: The volumes that should be mounted in the container. This volume is defined at the pod level.

      <br>

     _**Note**: Container can access the volume mounted at the pod level. But, the volume mounted at the container level will be accessible only to that container._

      <br>

     - `name`: The name of the volume.
     - `secret`: The type of volume. Here, we are using a Secret.
       - `secretName`: The name of the Secret.

   </details>

   <br>

4. Delete all the previous deployments and services using the following commands:

   ```bash
   kubectl delete deployment --all
   kubectl delete service --all
   ```

   <br>

5. Go to `/volume` folder in terminal. Apply the deployment and service again using following commands:

   ```bash
   kubectl apply -f deployment.yml
   kubectl apply -f service.yml
   ```

   <br>

6. Now, your secrets will come from the `.env` file mounted at `/etc/secrets` in the container.

- If you want to check the secrets, you can exec into the container and check the contents of the `.env` file.

  ```bash
  kubectl exec -it <POD_NAME> -- /bin/sh
  cat /etc/secrets/.env
  ```

  <br>

  **Note**: If you want to update the .env file, we can update it using the following command:

  ```bash
  echo "DATABASE_PASSWORD=your_password" > /etc/secrets/.env
  ```

  <br>

- To delete the deployment and service, use the following commands:

  ```bash
  kubectl delete -f service.yml
  kubectl delete -f deployment.yml
  ```