# Helm

## What is Helm?

Helm is the **package manager for Kubernetes**. It uses "charts" to define, install, and upgrade complex Kubernetes applications.

### Key Concepts

- **Chart** — A package of pre-configured Kubernetes resources
- **Release** — A running instance of a chart
- **Repository** — A collection of charts
- **Values** — Configuration that overrides chart defaults

### Helm vs Kustomize

| Feature | Helm | Kustomize |
|---------|------|-----------|
| Templating | Go templates | Patch overlays |
| Package Management | Yes (charts) | No |
| Rollback | Built-in | Manual |
| Secret Management | Yes (with plugins) | Base64 only |
| Community Charts | Extensive | Limited |

---

## Installation

```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Windows
choco install kubernetes-helm

# Verify installation
helm version
```

## Chart Structure

```
mychart/
├── Chart.yaml          # Chart metadata
├── Chart.lock          # Dependency lock file
├── values.yaml         # Default configuration values
├── values.schema.json  # JSON Schema for values
├── templates/          # Kubernetes manifest templates
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── serviceaccount.yaml
│   ├── _helpers.tpl    # Template helpers
│   └── tests/
│       └── test-connection.yaml
├── charts/             # Dependent charts
├── crds/               # Custom Resource Definitions
└── README.md
```

---

## Creating a Chart

```bash
# Create new chart
helm create myapp

# Lint chart
helm lint myapp

# Template (render locally)
helm template myapp ./myapp

# Dry run
helm install myapp ./myapp --dry-run
```

### Chart.yaml

```yaml
apiVersion: v2
name: myapp
description: A Helm chart for my application
type: application
version: 0.1.0      # Chart version
appVersion: "1.0.0"  # Application version
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
  - name: redis
    version: "17.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: redis.enabled
```

### values.yaml

```yaml
replicaCount: 1

image:
  repository: myapp
  pullPolicy: IfNotPresent
  tag: ""

imagePullSecrets: []
nameOverride: ""
fullnameOverride: ""

serviceAccount:
  create: true
  annotations: {}
  name: ""

podAnnotations: {}
podSecurityContext: {}
securityContext: {}

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  className: ""
  annotations: {}
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: []

resources:
  limits:
    cpu: 500m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80

nodeSelector: {}
tolerations: []
affinity: {}

# Environment variables
env:
  DATABASE_URL: ""
  REDIS_URL: ""

# Secrets
secrets:
  API_KEY: ""
```

---

## Template Syntax

### Deployment Template

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "myapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
      labels:
        {{- include "myapp.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "myapp.serviceAccountName" . }}
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          {{- with .Values.env }}
          env:
            {{- range $key, $value := . }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          {{- end }}
```

### Helper Template

```yaml
# templates/_helpers.tpl
{{/*
Expand the name of the chart.
*/}}
{{- define "myapp.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "myapp.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "myapp.labels" -}}
helm.sh/chart: {{ include "myapp.chart" . }}
{{ include "myapp.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "myapp.selectorLabels" -}}
app.kubernetes.io/name: {{ include "myapp.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

---

## Common Commands

```bash
# Install chart
helm install myrelease ./mychart

# Install with custom values
helm install myrelease ./mychart -f values-production.yaml

# Install with inline values
helm install myrelease ./chart --set replicaCount=3 --set image.tag=v2.0

# Upgrade release
helm upgrade myrelease ./mychart -f values.yaml

# Upgrade or install
helm upgrade --install myrelease ./mychart

# Rollback
helm rollback myrelease 1  # Rollback to revision 1

# List releases
helm list

# Get release values
helm get values myrelease

# Get all release info
helm get all myrelease

# Uninstall
helm uninstall myrelease

# Search repositories
helm search repo bitnami

# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

---

## Environment-Specific Values

### Directory Structure

```
myapp/
├── values.yaml              # Default values
├── values-dev.yaml          # Development overrides
├── values-staging.yaml      # Staging overrides
└── values-production.yaml   # Production overrides
```

### values-production.yaml

```yaml
replicaCount: 3

image:
  tag: "v2.1.0"

resources:
  limits:
    cpu: 1000m
    memory: 512Mi
  requests:
    cpu: 500m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: myapp-tls
      hosts:
        - myapp.example.com
```

### Install per environment

```bash
# Development
helm install myapp-dev ./myapp -f values-dev.yaml -n dev

# Staging
helm install myapp-staging ./myapp -f values-staging.yaml -n staging

# Production
helm install myapp-prod ./myapp -f values-production.yaml -n production
```

---

## Hands-On Exercise

1. Install Helm and add the Bitnami repository
2. Create a chart with `helm create myapp`
3. Customize the deployment template with environment variables
4. Install the chart with custom values
5. Upgrade the release and observe rolling updates
6. Rollback to a previous revision

## Resources

- [Helm Documentation](https://helm.sh/docs/)
- [Artifact Hub (chart repository)](https://artifacthub.io/)
- [Helm Chart Best Practices](https://helm.sh/docs/chart_best_practices/)
