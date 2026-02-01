# Helm - The Kubernetes Package Manager

- In this section, we will learn about:

  - [What is Helm?](#what-is-helm)
  - [Why do we need Helm?](#why-do-we-need-helm)
  - [Helm Architecture](#helm-architecture)
  - [Installing Helm](#installing-helm)
  - [Helm Charts](#helm-charts)
  - [Using Helm Charts](#using-helm-charts)
  - [Creating Your Own Helm Chart](#creating-your-own-helm-chart)
  - [Helm Values and Templating](#helm-values-and-templating)
  - [Helm Repositories](#helm-repositories)
  - [Common Helm Commands](#common-helm-commands)

## What is Helm?

- Helm is a **package manager for Kubernetes**, similar to how `apt` works for Ubuntu or `npm` works for Node.js.

    <br>

- It helps you:
  - **Package** multiple Kubernetes manifests together
  - **Version** your deployments
  - **Share** configurations across teams
  - **Rollback** to previous versions easily

    <br>

- A Helm **Chart** is a collection of files that describe a related set of Kubernetes resources.

## Why do we need Helm?

- Without Helm, deploying a complex application to Kubernetes requires:

  1. Writing multiple YAML files (Deployment, Service, ConfigMap, Secret, etc.)
  2. Managing them separately
  3. Manually updating each file for different environments
  4. No easy way to version or rollback

    <br>

- **Example Problem:**

  ```
  Imagine deploying a WordPress site. You need:
  - WordPress Deployment
  - WordPress Service
  - MySQL Deployment
  - MySQL Service
  - PersistentVolumeClaim for MySQL
  - Secrets for passwords
  - ConfigMaps for configuration
  ```

  That's at least 7+ YAML files to manage!

    <br>

- **With Helm:**

  ```bash
  helm install my-wordpress bitnami/wordpress
  ```

  One command deploys everything! 🚀

## Helm Architecture

- Helm has a simple architecture:

  <br>

  ```
  ┌─────────────────────────────────────────────────┐
  │                  Helm CLI                       │
  │         (runs on your local machine)            │
  └─────────────────────┬───────────────────────────┘
                        │
                        ▼
  ┌─────────────────────────────────────────────────┐
  │              Chart Repository                   │
  │     (Stores packaged charts - like npm)         │
  └─────────────────────┬───────────────────────────┘
                        │
                        ▼
  ┌─────────────────────────────────────────────────┐
  │             Kubernetes Cluster                  │
  │    (Where your applications get deployed)       │
  └─────────────────────────────────────────────────┘
  ```

    <br>

- **Key Components:**

  1. **Helm CLI**: Command-line tool you use to interact with Helm
  2. **Charts**: Packages containing Kubernetes manifest templates
  3. **Releases**: Instances of charts deployed to a cluster
  4. **Repositories**: Where charts are stored and shared

## Installing Helm

- **On macOS:**

  ```bash
  brew install helm
  ```

- **On Ubuntu/Debian:**

  ```bash
  curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
  sudo apt-get install apt-transport-https --yes
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
  sudo apt-get update
  sudo apt-get install helm
  ```

- **Using Script (Any OS):**

  ```bash
  curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  ```

- **Verify Installation:**

  ```bash
  helm version
  ```

## Helm Charts

- A Helm Chart has the following structure:

  ```
  mychart/
  ├── Chart.yaml          # Metadata about the chart
  ├── values.yaml         # Default configuration values
  ├── charts/             # Dependencies (other charts)
  ├── templates/          # Kubernetes manifest templates
  │   ├── deployment.yaml
  │   ├── service.yaml
  │   ├── _helpers.tpl    # Template helpers
  │   └── NOTES.txt       # Post-install notes
  └── README.md           # Documentation
  ```

    <br>

- **Chart.yaml Example:**

  ```yaml
  apiVersion: v2
  name: my-app
  description: A simple web application
  type: application
  version: 0.1.0        # Chart version
  appVersion: "1.0.0"   # Application version
  ```

    <br>

- **values.yaml Example:**

  ```yaml
  replicaCount: 2
  
  image:
    repository: nginx
    tag: "1.21"
    pullPolicy: IfNotPresent
  
  service:
    type: ClusterIP
    port: 80
  
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
  ```

## Using Helm Charts

### Adding a Repository

```bash
# Add the Bitnami repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
helm repo update

# List repositories
helm repo list
```

### Searching for Charts

```bash
# Search in added repositories
helm search repo nginx

# Search in Artifact Hub (public charts)
helm search hub wordpress
```

### Installing a Chart

```bash
# Basic installation
helm install my-release bitnami/nginx

# With custom values
helm install my-release bitnami/nginx --set replicaCount=3

# With a values file
helm install my-release bitnami/nginx -f my-values.yaml

# Dry run (preview without installing)
helm install my-release bitnami/nginx --dry-run
```

### Managing Releases

```bash
# List all releases
helm list

# Get status of a release
helm status my-release

# Upgrade a release
helm upgrade my-release bitnami/nginx --set replicaCount=5

# Rollback to previous version
helm rollback my-release 1

# Uninstall a release
helm uninstall my-release
```

## Creating Your Own Helm Chart

1. **Create a new chart:**

   ```bash
   helm create my-app
   ```

   This creates the chart structure with sample files.

    <br>

2. **Edit `templates/deployment.yaml`:**

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: {{ include "my-app.fullname" . }}
     labels:
       {{- include "my-app.labels" . | nindent 4 }}
   spec:
     replicas: {{ .Values.replicaCount }}
     selector:
       matchLabels:
         {{- include "my-app.selectorLabels" . | nindent 6 }}
     template:
       metadata:
         labels:
           {{- include "my-app.selectorLabels" . | nindent 8 }}
       spec:
         containers:
           - name: {{ .Chart.Name }}
             image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
             ports:
               - containerPort: {{ .Values.service.port }}
   ```

    <br>

3. **Lint your chart:**

   ```bash
   helm lint my-app
   ```

    <br>

4. **Package the chart:**

   ```bash
   helm package my-app
   ```

    <br>

5. **Install your chart:**

   ```bash
   helm install my-release ./my-app
   ```

## Helm Values and Templating

- Helm uses **Go templating** to make manifests dynamic.

    <br>

- **Common Template Functions:**

  | Function | Description | Example |
  |----------|-------------|---------|
  | `{{ .Values.key }}` | Access values | `{{ .Values.replicaCount }}` |
  | `{{ .Release.Name }}` | Release name | Used in resource names |
  | `{{ .Chart.Name }}` | Chart name | Used in labels |
  | `{{ include "name" . }}` | Include template | Reusable snippets |
  | `{{ if }}...{{ end }}` | Conditional | Enable/disable features |
  | `{{ range }}...{{ end }}` | Loop | Iterate over lists |

    <br>

- **Example with Conditionals:**

  ```yaml
  {{- if .Values.ingress.enabled }}
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: {{ include "my-app.fullname" . }}
  spec:
    rules:
      - host: {{ .Values.ingress.host }}
        http:
          paths:
            - path: /
              pathType: Prefix
              backend:
                service:
                  name: {{ include "my-app.fullname" . }}
                  port:
                    number: {{ .Values.service.port }}
  {{- end }}
  ```

    <br>

- **Overriding Values:**

  ```bash
  # Using --set flag
  helm install my-app ./my-chart --set image.tag=v2.0.0
  
  # Using values file
  helm install my-app ./my-chart -f production-values.yaml
  
  # Multiple values files (later files override earlier ones)
  helm install my-app ./my-chart -f values.yaml -f production.yaml
  ```

## Helm Repositories

- **Popular Chart Repositories:**

  | Repository | URL | Description |
  |------------|-----|-------------|
  | Bitnami | `https://charts.bitnami.com/bitnami` | Popular applications |
  | Prometheus | `https://prometheus-community.github.io/helm-charts` | Monitoring |
  | Grafana | `https://grafana.github.io/helm-charts` | Visualization |
  | Ingress-NGINX | `https://kubernetes.github.io/ingress-nginx` | Ingress controller |

    <br>

- **Managing Repositories:**

  ```bash
  # Add repository
  helm repo add prometheus https://prometheus-community.github.io/helm-charts
  
  # Update all repositories
  helm repo update
  
  # Remove repository
  helm repo remove prometheus
  ```

## Common Helm Commands

| Command | Description |
|---------|-------------|
| `helm create <name>` | Create a new chart |
| `helm install <release> <chart>` | Install a chart |
| `helm upgrade <release> <chart>` | Upgrade a release |
| `helm rollback <release> <revision>` | Rollback to previous version |
| `helm uninstall <release>` | Remove a release |
| `helm list` | List all releases |
| `helm status <release>` | Show release status |
| `helm history <release>` | Show revision history |
| `helm repo add <name> <url>` | Add chart repository |
| `helm repo update` | Update repositories |
| `helm search repo <keyword>` | Search for charts |
| `helm show values <chart>` | Show default values |
| `helm template <chart>` | Render templates locally |
| `helm lint <chart>` | Check chart for issues |
| `helm package <chart>` | Package chart into archive |

---

## Real-World Example: Deploying a Full Stack App

Let's deploy a complete application with frontend, backend, and database using Helm:

```bash
# Add required repositories
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Deploy PostgreSQL database
helm install my-db bitnami/postgresql \
  --set auth.postgresPassword=secretpass \
  --set auth.database=myapp

# Deploy Redis for caching
helm install my-cache bitnami/redis \
  --set auth.password=redispass

# Check all releases
helm list

# View what was deployed
kubectl get pods
kubectl get services
```

---

## Summary

- **Helm** is the package manager for Kubernetes
- **Charts** are packages containing Kubernetes manifests
- **Releases** are deployed instances of charts
- **Values** allow customization without modifying templates
- **Repositories** store and distribute charts

Helm makes Kubernetes deployments:
- ✅ Repeatable
- ✅ Versionable
- ✅ Shareable
- ✅ Easy to rollback

---

*This note is part of the 100xDevs DevOps series. For more DevOps topics, check out GitOps/ArgoCD, Terraform, and AWS ECS notes.*
