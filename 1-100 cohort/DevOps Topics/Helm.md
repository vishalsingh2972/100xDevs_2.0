# Helm - The Kubernetes Package Manager

## What is Helm?

Helm is the package manager for Kubernetes. It allows you to define, install, and upgrade complex Kubernetes applications using packages called "charts".

### Key Concepts

- **Chart** - A Helm package containing Kubernetes resource definitions
- **Release** - An instance of a chart running in a cluster
- **Repository** - A place where charts are stored and shared
- **Values** - Configuration that customizes chart behavior

## Installation

### macOS
```bash
brew install helm
```

### Linux
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### Windows (Chocolatey)
```bash
choco install kubernetes-helm
```

### Verify
```bash
helm version
```

## Basic Commands

### Repository Management
```bash
# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
helm repo update

# List repositories
helm repo list

# Search for charts
helm search repo nginx
helm search hub wordpress
```

### Installing Charts
```bash
# Basic install
helm install my-release bitnami/nginx

# Install with custom values
helm install my-release bitnami/nginx --values values.yaml

# Install with set flags
helm install my-release bitnami/nginx \
  --set replicaCount=3 \
  --set service.type=LoadBalancer

# Install in specific namespace
helm install my-release bitnami/nginx -n production --create-namespace

# Dry run (preview)
helm install my-release bitnami/nginx --dry-run
```

### Managing Releases
```bash
# List releases
helm list
helm list -A  # All namespaces

# Get release status
helm status my-release

# Upgrade release
helm upgrade my-release bitnami/nginx --set replicaCount=5

# Rollback
helm rollback my-release 1  # revision number

# Uninstall
helm uninstall my-release
```

## Creating Your Own Chart

### Generate Chart Scaffold
```bash
helm create my-chart
```

### Chart Structure
```
my-chart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration
├── charts/             # Chart dependencies
├── templates/          # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── _helpers.tpl    # Template helpers
│   ├── NOTES.txt       # Post-install notes
│   └── tests/
│       └── test-connection.yaml
└── .helmignore
```

### Chart.yaml
```yaml
apiVersion: v2
name: my-chart
description: A Helm chart for my application
type: application
version: 0.1.0        # Chart version
appVersion: "1.0.0"   # App version
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
```

### values.yaml
```yaml
replicaCount: 1

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  className: ""
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

### templates/deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-chart.fullname" . }}
  labels:
    {{- include "my-chart.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
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
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /
              port: http
          readinessProbe:
            httpGet:
              path: /
              port: http
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
```

### templates/_helpers.tpl
```yaml
{{/*
Expand the name of the chart.
*/}}
{{- define "my-chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "my-chart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "my-chart.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{ include "my-chart.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "my-chart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "my-chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

## Template Functions

### Common Functions
```yaml
# String manipulation
{{ .Values.name | upper }}
{{ .Values.name | lower }}
{{ .Values.name | quote }}
{{ .Values.name | default "default-value" }}
{{ .Values.name | trunc 63 }}

# Conditionals
{{- if .Values.ingress.enabled }}
# ingress resources
{{- end }}

# Loops
{{- range .Values.hosts }}
- host: {{ . }}
{{- end }}

# Include templates
{{ include "my-chart.fullname" . }}

# toYaml
resources:
{{ toYaml .Values.resources | indent 2 }}
```

## Dependencies

### Add Dependencies
```yaml
# Chart.yaml
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
```

### Update Dependencies
```bash
helm dependency update my-chart/
helm dependency build my-chart/
```

## Packaging & Distribution

```bash
# Package chart
helm package my-chart/

# Lint chart
helm lint my-chart/

# Template (render locally)
helm template my-release my-chart/

# Push to OCI registry
helm push my-chart-0.1.0.tgz oci://registry.example.com/charts
```

## Best Practices

1. **Use Semantic Versioning** - For chart versions
2. **Document values.yaml** - Add comments explaining each value
3. **Provide NOTES.txt** - Show users how to access their app
4. **Add Tests** - Include connection tests
5. **Use _helpers.tpl** - DRY principle for templates
6. **Set Resource Limits** - Always define limits and requests
7. **Use labels consistently** - For easy filtering

## Resources

- [Helm Documentation](https://helm.sh/docs/)
- [Artifact Hub](https://artifacthub.io/) - Find charts
- [Chart Best Practices](https://helm.sh/docs/chart_best_practices/)
