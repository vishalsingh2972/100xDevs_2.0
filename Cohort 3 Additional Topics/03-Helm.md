# Helm - The Kubernetes Package Manager

## What is Helm?

Helm is the **package manager for Kubernetes**. It helps you define, install, and upgrade complex Kubernetes applications using reusable templates called **Charts**.

### Why Helm?

- **Templating** - One chart, many environments (dev/staging/prod)
- **Versioning** - Track releases, rollback easily
- **Sharing** - Publish charts to registries (Artifact Hub)
- **Dependency Management** - Charts can depend on other charts

## Installation

```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Windows
choco install kubernetes-helm
```

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Chart** | A Helm package (templates + values) |
| **Release** | An instance of a chart running in a cluster |
| **Repository** | A collection of shared charts |
| **Values** | Configuration that overrides template defaults |

## Basic Commands

```bash
# Add a repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search for charts
helm search repo nginx
helm search hub redis

# Install a chart
helm install my-nginx bitnami/nginx

# Install with custom values
helm install my-nginx bitnami/nginx -f values.yaml

# Install into a specific namespace
helm install my-nginx bitnami/nginx -n production --create-namespace

# List releases
helm list
helm list -A  # all namespaces

# Upgrade a release
helm upgrade my-nginx bitnami/nginx -f values.yaml

# Install or upgrade (idempotent)
helm upgrade --install my-nginx bitnami/nginx -f values.yaml

# Rollback
helm rollback my-nginx 1

# Uninstall
helm uninstall my-nginx

# View release history
helm history my-nginx

# Show chart values
helm show values bitnami/nginx
```

## Creating a Chart

```bash
helm create my-chart
```

### Chart Structure

```
my-chart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration
├── charts/             # Dependencies
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── _helpers.tpl    # Reusable template helpers
│   └── NOTES.txt       # Post-install instructions
└── .helmignore
```

### Chart.yaml

```yaml
apiVersion: v2
name: my-app
description: A Helm chart for my application
type: application
version: 0.1.0          # Chart version
appVersion: "1.0.0"     # Application version
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: "https://charts.bitnami.com/bitnami"
```

### values.yaml

```yaml
replicaCount: 2

image:
  repository: myapp
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

# Environment-specific overrides
env:
  NODE_ENV: production
```

### Template Example (deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-chart.fullname" . }}
  labels:
    {{- include "my-chart.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "my-chart.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "my-chart.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          ports:
            - containerPort: {{ .Values.service.port }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          env:
            {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
```

## Environment Overrides

```bash
# Dev environment
helm upgrade --install my-app ./my-chart -f values.yaml -f values-dev.yaml

# Production
helm upgrade --install my-app ./my-chart -f values.yaml -f values-prod.yaml
```

**values-prod.yaml:**
```yaml
replicaCount: 5
resources:
  limits:
    cpu: 2000m
    memory: 2Gi
```

## Useful Tips

1. **Dry-run to debug templates** — `helm install --dry-run --debug my-app ./my-chart`
2. **Use `helm template`** to render locally without installing — `helm template ./my-chart`
3. **Lint your charts** — `helm lint ./my-chart`
4. **Use `helm diff`** plugin to see changes before upgrading — `helm plugin install https://github.com/databus23/helm-diff`
5. **Pin chart versions** in production — `helm install my-app bitnami/nginx --version 15.0.0`
6. **Use `lookup` function** to read existing cluster resources during templating
