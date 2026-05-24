# GitOps & ArgoCD

## What is GitOps?

GitOps is a paradigm that uses **Git as the single source of truth** for declarative infrastructure and applications. Changes to infrastructure are made by pull requests, and automated agents reconcile the desired state with the actual state.

### Core Principles

1. **Declarative** — Desired state is described declaratively (YAML, HCL)
2. **Versioned & Immutable** — Git provides versioning, audit trail, rollback
3. **Pulled Automatically** — Agents pull desired state, not pushed via CI
4. **Continuously Reconciled** — Drift is detected and corrected automatically

### GitOps vs Traditional CI/CD

```
Traditional CI/CD:
  Code Push → CI Build → CD Push → Cluster

GitOps:
  Code Push → CI Build → Update Git Manifests → ArgoCD Pulls → Cluster
```

The key difference: in GitOps, the **cluster pulls** changes rather than having changes **pushed** to it. This is more secure (no CI credentials needed for cluster access) and provides a clear audit trail.

---

## ArgoCD

ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes.

### Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Git Repo    │────▶│  ArgoCD      │────▶│  Kubernetes  │
│  (Manifests) │     │  Controller  │     │  Cluster     │
└─────────────┘     └──────────────┘     └──────────────┘
                           │
                    ┌──────┴──────┐
                    │  ArgoCD UI  │
                    │  (Web/CLI)  │
                    └─────────────┘
```

### Installation

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Install CLI
brew install argocd  # macOS
# or
curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
chmod +x argocd
sudo mv argocd /usr/local/bin/

# Login
argocd login localhost:8080
```

### Application Configuration

Create an ArgoCD Application:

```yaml
# application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/your-repo.git
    targetRevision: HEAD
    path: k8s/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated:
      prune: true        # Delete resources removed from Git
      selfHeal: true      # Revert manual changes
    syncOptions:
      - CreateNamespace=true
```

```bash
# Apply the application
kubectl apply -f application.yaml

# Or use CLI
argocd app create my-app \
  --repo https://github.com/your-org/your-repo.git \
  --path k8s/overlays/production \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace my-app \
  --sync-policy automated \
  --auto-prune \
  --self-heal
```

### Sync Strategies

```bash
# Manual sync
argocd app sync my-app

# Automatic sync (configured in spec.syncPolicy)
# ArgoCD polls every 3 minutes by default

# Force sync (respects --force flag)
argocd app sync my-app --force

# Sync specific resource
argocd app sync my-app --resource apps:Deployment:my-app
```

### Multi-Environment Setup

```
repo/
├── apps/
│   └── my-app/
│       ├── base/
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   └── kustomization.yaml
│       └── overlays/
│           ├── dev/
│           │   ├── kustomization.yaml
│           │   └── patch-replicas.yaml
│           ├── staging/
│           │   ├── kustomization.yaml
│           │   └── patch-replicas.yaml
│           └── production/
│               ├── kustomization.yaml
│               └── patch-replicas.yaml
└── argocd/
    ├── app-dev.yaml
    ├── app-staging.yaml
    └── app-production.yaml
```

### ArgoCD with Helm

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: https://charts.example.com
    chart: my-chart
    targetRevision: 1.2.3
    helm:
      values: |
        replicaCount: 3
        image:
          tag: v2.0.0
      valueFiles:
        - values-production.yaml
```

### Notifications

```yaml
# Install notifications
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/notifications_catalog/install.yaml

# Configure Slack notifications
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
data:
  service.slack: |
    token: $slack-token
  template.app-sync-succeeded: |
    message: |
      Application {{.app.metadata.name}} sync succeeded.
  trigger.on-sync-succeeded: |
    - when: app.status.operationState.phase in ['Succeeded']
      send: [app-sync-succeeded]
```

---

## Hands-On Exercise

1. Install ArgoCD on a local Kubernetes cluster (minikube/kind)
2. Create a simple app with Kubernetes manifests in a Git repo
3. Configure ArgoCD to watch the repo and auto-sync
4. Make a change to the manifest, push, and watch ArgoCD reconcile
5. Try kustomize overlays for dev/staging/production

## Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [GitOps Principles](https://opengitops.dev/)
- [ArgoCD Best Practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)
