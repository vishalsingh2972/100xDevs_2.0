# Helm - The Kubernetes Package Manager

## What is Helm?

Helm is the package manager for Kubernetes. It helps you define, install, and upgrade even the most complex Kubernetes applications using **Charts** — templated, versioned packages of Kubernetes resources.

Think of it like `npm` for Node.js or `apt` for Ubuntu, but for Kubernetes.

### Why Helm?

- **Templating**: One chart, many environments (dev/staging/prod) with different values.
- **Versioning**: Track releases, rollback easily.
- **Sharing**: Publish charts to registries (Artifact Hub, ChartMuseum).
- **Dependency management**: Charts can depend on other charts.
- **Simplify complexity**: Bundle dozens of YAML files into one installable unit.

---

## Core Concepts

### Chart

A Helm chart is a collection of files that describe Kubernetes resources:

```
my-chart/
├── Chart.yaml          # Chart metadata (name, version, deps)
├── values.yaml         # Default configuration values
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── _helpers.tpl    # Reusable template helpers
│   └── NOTES.txt       # Post-install instructions
├── charts/             # Dependency charts
└── .helmignore         # Files to ignore
```

### Release

A **release** is one installation of a chart. Each time you `helm install`, a new release is created with a specific version.

### Values

Values (in `values.yaml`) are the configuration that gets injected into templates:

```yaml
# values.yaml
replicaCount: 2

image:
  repository: myregistry/my-app
  pullPolicy: IfNotPresent
  tag: "1.0.0"

service:
  type: ClusterIP
  port: 80

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi
```

---

## Chart.yaml

```yaml
apiVersion: v2
name: my-app
description: A Helm chart for my Node.js application
type: application
version: 0.1.0          # Chart version (changes when you edit the chart)
appVersion: "1.0.0"     # App version (the actual software version)
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
```

---

## Templates

Templates use Go templating with Sprig functions:

### Deployment Template

```yaml
# templates/deployment.yaml
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
      {{- if .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml .Values.imagePullSecrets | nindent 8 }}
      {{- end }}
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: 3000
          {{- if .Values.env }}
          env:
            {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          {{- end }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 15
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
```

### Service Template

```yaml
# templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "my-chart.fullname" . }}
  labels:
    {{- include "my-chart.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: 3000
      protocol: TCP
      name: http
  selector:
    {{- include "my-chart.selectorLabels" . | nindent 4 }}
```

### Helpers

```yaml
# templates/_helpers.tpl
{{- define "my-chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "my-chart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- .Release.Name }}
{{- end }}
{{- end }}

{{- define "my-chart.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{ include "my-chart.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}

{{- define "my-chart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "my-chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

---

## Environment-Specific Values

Override defaults per environment:

```yaml
# values-staging.yaml
replicaCount: 1
image:
  tag: "staging-latest"
resources:
  requests:
    cpu: 50m
    memory: 64Mi
```

```yaml
# values-production.yaml
replicaCount: 3
image:
  tag: "v2.1.0"
  pullPolicy: Always
resources:
  requests:
    cpu: 200m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 512Mi
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

---

## Common Workflows

```bash
# Create a new chart scaffold
helm create my-chart

# Lint the chart (check for errors)
helm lint my-chart

# Render templates locally (debug)
helm template my-release my-chart

# Install with default values
helm install my-release my-chart/

# Install with custom values
helm install my-release my-chart/ -f values-production.yaml

# Install with inline override
helm install my-release my-chart/ --set replicaCount=5

# Upgrade an existing release
helm upgrade my-release my-chart/ -f values-production.yaml

# Install or upgrade (idempotent)
helm upgrade --install my-release my-chart/ -f values-production.yaml

# List releases
helm list

# Check release status
helm status my-release

# View release history
helm history my-release

# Rollback to previous version
helm rollback my-release 1

# Uninstall
helm uninstall my-release

# Dry-run to see what would be deployed
helm install my-release my-chart/ --dry-run --debug

# Package chart into .tgz
helm package my-chart/

# Add a chart repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search for charts
helm search repo nginx
```

---

## Complete Example: Deploying with PostgreSQL Dependency

```yaml
# Chart.yaml
apiVersion: v2
name: todo-app
description: A full-stack Todo application
version: 1.0.0
appVersion: "2.0.0"
dependencies:
  - name: postgresql
    version: "12.12.10"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
```

```yaml
# values.yaml
replicaCount: 2

image:
  repository: myregistry/todo-app
  tag: "2.0.0"

service:
  type: LoadBalancer
  port: 80

env:
  NODE_ENV: production
  DB_HOST: "{{ .Release.Name }}-postgresql"

postgresql:
  enabled: true
  auth:
    username: todo
    database: todo_db
  primary:
    persistence:
      size: 10Gi
```

```bash
# Install with dependency resolution
helm dependency update todo-app/
helm install todo-prod todo-app/ -f values.yaml
```

---

## Helm with ArgoCD / GitOps

Helm charts work natively with ArgoCD:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: todo-app
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/myorg/gitops.git
    path: charts/todo-app        # Path to Helm chart
    helm:
      valueFiles:
        - values.yaml
        - values-production.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

## Helm vs Kustomize

| Feature | Helm | Kustomize |
|---------|------|-----------|
| Templating | Go templates | Overlays/patches (no templates) |
| Packaging | .tgz charts | Directory-based |
| Dependencies | Built-in | None |
| Learning curve | Moderate | Low |
| Versioning | Chart versioning | Git-based |
| Use with ArgoCD | ✅ Native | ✅ Native |

---

## Best Practices

1. **Use `helm lint`** — Always lint before packaging/installing.
2. **Pin dependency versions** — Lock chart dependencies to specific versions.
3. **Use `upgrade --install`** — Idempotent deploys for CI/CD.
4. **Don't hardcode values** — Use `values.yaml` for everything configurable.
5. **Namespace your releases** — Use `--namespace` flag consistently.
6. **Test with `--dry-run`** — Preview changes before applying.
7. **Version your charts** — Bump `version` in `Chart.yaml` on every change.

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `helm create NAME` | Create a new chart |
| `helm install RELEASE CHART` | Install a chart |
| `helm upgrade RELEASE CHART` | Upgrade a release |
| `helm rollback RELEASE [REVISION]` | Rollback a release |
| `helm uninstall RELEASE` | Uninstall a release |
| `helm list` | List releases |
| `helm template CHART` | Render templates locally |
| `helm lint CHART` | Validate a chart |
| `helm package CHART` | Package chart into .tgz |
| `helm repo add NAME URL` | Add a chart repository |
| `helm search REPO KEYWORD` | Search for charts |
| `helm dependency update` | Update chart dependencies |
