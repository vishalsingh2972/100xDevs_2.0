# GitOps & ArgoCD

## What is GitOps?

GitOps is a declarative approach to continuous delivery that uses Git as the single source of truth for infrastructure and application definitions.

### Core Principles

1. **Declarative** - System desired state expressed declaratively
2. **Versioned** - Desired state stored in Git (versioned, immutable)
3. **Automated** - Approved changes auto-applied to the system
4. **Reconciled** - Software agents ensure correctness and alert on drift

## ArgoCD Overview

ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes.

### Key Features
- Automated deployment of applications to specified target environments
- Support for multiple config management tools (Kustomize, Helm, Jsonnet, plain YAML)
- SSO Integration (OIDC, OAuth2, LDAP, SAML 2.0)
- Multi-tenancy and RBAC policies
- Rollback/Roll-forward to any application state in Git
- Health assessment of application resources
- Automated drift detection and visualization

## Installation

### Quick Install
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Access the UI
```bash
# Port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Install ArgoCD CLI
```bash
# macOS
brew install argocd

# Linux
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
```

## Creating Your First Application

### Application Manifest
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
    path: kubernetes/
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

### Deploy
```bash
kubectl apply -f application.yaml
```

### Using CLI
```bash
argocd app create my-app \
  --repo https://github.com/your-org/your-repo.git \
  --path kubernetes/ \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace my-app
```

## Sync Strategies

### Manual Sync
```bash
argocd app sync my-app
```

### Auto-Sync
```yaml
syncPolicy:
  automated:
    prune: true      # Delete resources removed from Git
    selfHeal: true   # Revert manual changes
```

## Working with Helm Charts

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nginx-app
spec:
  source:
    repoURL: https://charts.bitnami.com/bitnami
    chart: nginx
    targetRevision: 13.2.23
    helm:
      values: |
        replicaCount: 2
        service:
          type: LoadBalancer
```

## Project Structure Example

```
├── apps/
│   ├── production/
│   │   ├── app1.yaml
│   │   └── app2.yaml
│   └── staging/
│       ├── app1.yaml
│       └── app2.yaml
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
└── overlays/
    ├── production/
    │   └── kustomization.yaml
    └── staging/
        └── kustomization.yaml
```

## Best Practices

1. **Separate Config from Code** - Keep Kubernetes manifests in a separate repo
2. **Use Branches/Directories for Environments** - staging/, production/
3. **Implement Sealed Secrets** - Never commit plain secrets
4. **Use App of Apps Pattern** - Manage multiple apps declaratively
5. **Enable Health Checks** - Add readiness/liveness probes
6. **Set Resource Limits** - Always define CPU/memory limits

## Useful Commands

```bash
# List applications
argocd app list

# Get app details
argocd app get my-app

# View app history
argocd app history my-app

# Rollback
argocd app rollback my-app <revision>

# Delete app
argocd app delete my-app
```

## Troubleshooting

```bash
# Check sync status
argocd app get my-app --hard-refresh

# View logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller

# Force sync
argocd app sync my-app --force
```

## Resources

- [Official ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [GitOps Principles](https://opengitops.dev/)
- [ArgoCD GitHub](https://github.com/argoproj/argo-cd)
