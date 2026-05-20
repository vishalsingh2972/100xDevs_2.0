# Helm

## What is Helm?

Helm is the package manager for Kubernetes. It helps you manage Kubernetes applications through Helm Charts.

### Key Concepts

- **Chart** - A package of pre-configured Kubernetes resources
- **Release** - A running instance of a chart
- **Repository** - A collection of charts

## Installation

```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Add stable repo
helm repo add stable https://charts.helm.sh/stable

# Update repos
helm repo update
```

## Basic Commands

```bash
# Search for charts
helm search repo nginx

# Install a chart
helm install my-release stable/nginx

# List releases
helm list

# Get release status
helm status my-release

# Upgrade release
helm upgrade my-release stable/nginx --set replicaCount=3

# Uninstall release
helm uninstall my-release
```

## Creating a Chart

```bash
# Create new chart
helm create my-chart

# Chart structure
my-chart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default values
├── charts/             # Dependencies
├── templates/          # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
└── templates/NOTES.txt # Post-install notes
```

## Chart.yaml Example

```yaml
apiVersion: v2
name: my-chart
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: "1.0.0"
```

## values.yaml Example

```yaml
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: "1.21"

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
```

## Template Example

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-chart.fullname" . }}
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
```

## Resources

- [Helm Documentation](https://helm.sh/docs/)
- [Helm Chart Best Practices](https://helm.sh/docs/chart_best_practices/)
- [Artifact Hub](https://artifacthub.io/)
