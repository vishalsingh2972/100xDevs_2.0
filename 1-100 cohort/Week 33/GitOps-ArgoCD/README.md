# GitOps & ArgoCD

## What is GitOps?

GitOps is a way to do Kubernetes cluster management and application delivery. It works by using Git as a single source of truth for declarative infrastructure and applications.

### Key Principles

1. **Declarative Configuration** - Everything described declaratively
2. **Version Controlled** - Git as single source of truth
3. **Automated Delivery** - Changes automatically applied
4. **Continuous Reconciliation** - Software agents correct drift

## ArgoCD

ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes.

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
```

### Basic Usage

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
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### CLI Commands

```bash
# Login
argocd login localhost:8080

# Create app
argocd app create my-app \
  --repo https://github.com/your-org/your-repo.git \
  --path k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace my-app

# Sync app
argocd app sync my-app

# Get app status
argocd app get my-app
```

## Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [GitOps Principles](https://opengitops.dev/)
- [ArgoCD Best Practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)
