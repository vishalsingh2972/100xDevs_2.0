# GitOps and ArgoCD

## What is GitOps?

GitOps is a set of practices for managing infrastructure and application deployments using **Git as the single source of truth**. The core idea:

1. **Declare** your entire system (infrastructure + apps) in Git.
2. **Git commits** trigger automatic deployments.
3. **Agents** continuously reconcile the actual state with the desired state in Git.

### Why GitOps?

- **Audit trail**: Every change is a Git commit with history.
- **Rollback**: `git revert` is your rollback mechanism.
- **Security**: No one needs direct cluster access — only Git write access.
- **Developer-friendly**: Developers already know Git workflows (PRs, reviews).
- **Continuous reconciliation**: Drift is automatically corrected.

---

## GitOps vs Traditional CI/CD

| Aspect | Traditional CI/CD | GitOps |
|--------|-------------------|--------|
| Deployment trigger | CI pipeline pushes | Git commit triggers pull |
| Access model | CI needs cluster credentials | Agent in cluster pulls changes |
| State source | CI pipeline state | Git repository |
| Rollback | Re-run pipeline | `git revert` |
| Drift detection | Manual | Automatic reconciliation |

---

## ArgoCD Overview

ArgoCD is a **declarative GitOps continuous delivery tool** for Kubernetes. It runs inside your cluster and watches your Git repo for changes, automatically deploying them.

### How ArgoCD Works

```
Git Repo (Desired State)
    │
    ▼
ArgoCD Controller (in cluster)
    │
    ├─ Detects drift ──► Syncs automatically
    │
    └─ No drift ──► Does nothing (healthy)
    
Kubernetes Cluster (Actual State)
```

1. You push Kubernetes manifests (or Helm/Kustomize configs) to Git.
2. ArgoCD detects the change.
3. ArgoCD applies the manifests to the cluster.
4. ArgoCD continuously monitors for drift and auto-heals.

---

## Installation

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Check pods
kubectl get pods -n argocd

# Port-forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

---

## Core Concepts

### Applications

An ArgoCD **Application** defines the relationship between a Git path and a Kubernetes cluster:

```yaml
# argocd-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/my-app-manifests.git
    targetRevision: main
    path: overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true      # Delete resources not in Git
      selfHeal: true    # Auto-fix drift
    syncOptions:
      - CreateNamespace=true
```

### Projects

Projects group applications and enforce policies (which clusters, repos, namespaces are allowed):

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: my-project
  namespace: argocd
spec:
  description: "My team's project"
  sourceRepos:
    - "https://github.com/myorg/*"
  destinations:
    - namespace: "production"
      server: https://kubernetes.default.svc
  clusterResourceWhitelist:
    - group: ""
      kind: Namespace
```

### Sync Policies

- **Manual**: Sync triggered by clicking "Sync" in UI or CLI.
- **Automated**: ArgoCD syncs whenever it detects a difference.
  - `prune: true` — removes resources that are no longer in Git.
  - `selfHeal: true` — auto-corrects manual changes made to the cluster.

---

## Complete Example: Deploy a Node.js App via GitOps

### Directory Structure

```
my-app-gitops/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
├── overlays/
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   └── patch-replicas.yaml
│   └── production/
│       ├── kustomization.yaml
│       └── patch-replicas.yaml
└── argocd/
    ├── staging-app.yaml
    └── production-app.yaml
```

### Base Manifests

```yaml
# base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: myregistry/my-app:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
```

```yaml
# base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

```yaml
# base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployment.yaml
  - service.yaml
```

### Overlay: Production

```yaml
# overlays/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../base
patches:
  - path: patch-replicas.yaml
```

```yaml
# overlays/production/patch-replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: my-app
          image: myregistry/my-app:v1.2.3
```

### ArgoCD Application Definition

```yaml
# argocd/production-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app-production
  namespace: argocd
  labels:
    env: production
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/my-app-gitops.git
    targetRevision: main
    path: overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### CI/CD Pipeline Integration

Your CI pipeline (GitHub Actions) only needs to:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build and push image
        run: |
          docker build -t myregistry/my-app:${{ github.sha }} .
          docker push myregistry/my-app:${{ github.sha }}

      - name: Update manifest
        run: |
          # Clone the gitops repo and update the image tag
          git clone https://github.com/myorg/my-app-gitops.git
          cd my-app-gitops
          sed -i "s|myregistry/my-app:.*|myregistry/my-app:${{ github.sha }}|" \
            overlays/production/patch-replicas.yaml
          git commit -am "Update image to ${{ github.sha }}"
          git push
          # ArgoCD will detect this change and auto-deploy!
```

---

## ArgoCD CLI

```bash
# Install
brew install argocd

# Login
argocd login localhost:8080 --username admin --password <password>

# List applications
argocd app list

# Sync an app manually
argocd app sync my-app-production

# Get app status
argocd app get my-app-production

# Check diff
argocd app diff my-app-production
```

---

## Monitoring & Health

ArgoCD provides health status for every resource:

| Status | Meaning |
|--------|---------|
| 🟢 Healthy | Resource is running correctly |
| 🟡 Progressing | Still deploying / starting up |
| 🔴 Degraded | CrashLoop, failed, or unhealthy |
| ⚪ Unknown | ArgoCD can't determine status |

### Integrate with Prometheus

```yaml
# ArgoCD exposes metrics on port 8082
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: argocd-metrics
  namespace: argocd
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: argocd-metrics
  endpoints:
    - port: metrics
```

---

## Best Practices

1. **Separate app code from manifests** — Use two repos (app repo + gitops repo).
2. **Use Kustomize overlays** — Manage environment differences cleanly.
3. **Enable self-heal** — Automatic drift correction is the whole point.
4. **Use App of Apps pattern** — One "root" Application that manages other Applications.
5. **RBAC** — Restrict who can modify which Applications via ArgoCD RBAC.
6. **Secret management** — Use Sealed Secrets, External Secrets, or SOPS (never commit raw secrets).
7. **Progressive delivery** — Pair with Argo Rollouts for canary/blue-green deployments.

---

## App of Apps Pattern

Manage many ArgoCD Applications through a single parent:

```yaml
# argocd/apps/root-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-app
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/myorg/gitops.git
    path: argocd/apps
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

All YAML files in `argocd/apps/` will be automatically applied as ArgoCD Applications.

---

## Summary

| Concept | Description |
|---------|-------------|
| GitOps | Git is the single source of truth for infrastructure |
| ArgoCD | GitOps controller for Kubernetes |
| Application | ArgoCD resource linking Git path → K8s cluster |
| Sync Policy | How/when ArgoCD applies changes |
| Self-heal | Auto-correct drift from desired state |
| App of Apps | Pattern to manage multiple apps declaratively |
