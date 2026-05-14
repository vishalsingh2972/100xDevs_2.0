# GitOps / ArgoCD

## What is GitOps?

GitOps is a modern approach to continuous deployment where **Git is the single source of truth** for your infrastructure and application configuration. Changes are made via pull requests, and an automated process ensures the actual state matches the desired state in Git.

### Core Principles

1. **Declarative** - All configuration is described declaratively in Git (YAML, JSON, etc.)
2. **Versioned & Immutable** - Git history provides full audit trail and rollback capability
3. **Pulled Automatically** - Software agents automatically pull changes from Git
4. **Continuously Reconciled** - Agents continuously compare actual vs desired state and fix drift

### GitOps Workflow

```
Developer → Git Push → CI Pipeline → Docker Image → Git (manifest update) → ArgoCD detects change → ArgoCD syncs to K8s
```

## What is ArgoCD?

ArgoCD is a **declarative, GitOps continuous delivery tool for Kubernetes**. It watches your Git repository and automatically syncs Kubernetes manifests to your cluster.

### Key Features

- **Automated Sync** - Detects drift between Git and cluster, auto-syncs
- **Web UI** - Visual dashboard showing app health and sync status
- **Multi-cluster** - Deploy to multiple K8s clusters from a single ArgoCD instance
- **SSO Integration** - Works with OIDC, OAuth2, LDAP
- **RBAC** - Fine-grained access control
- **Rollback** - One-click rollback to any previous Git commit

### Installing ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Port-forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### Getting the Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Creating an Application

**Via CLI:**
```bash
argocd app create my-app \
  --repo https://github.com/myorg/my-manifests.git \
  --path k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default
```

**Via YAML (Application Manifest):**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/my-manifests.git
    targetRevision: HEAD
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Sync Policies

- **Manual Sync** - Requires user to click "Sync"
- **Auto Sync** - ArgoCD automatically applies changes from Git
- **Self-Heal** - ArgoCD reverts manual cluster changes back to Git state
- **Prune** - ArgoCD removes resources that no longer exist in Git

### App of Apps Pattern

For managing multiple applications, use the "App of Apps" pattern — a single ArgoCD Application that points to a folder of Application manifests:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: apps
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/myorg/argocd-apps.git
    path: apps
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
```

### ArgoCD vs Traditional CI/CD

| Aspect | Traditional CI/CD | GitOps (ArgoCD) |
|--------|-------------------|-----------------|
| Deployment | Push-based (CI pushes to cluster) | Pull-based (agent pulls from Git) |
| Access | Needs kubeconfig in CI pipeline | No cluster access needed in CI |
| Audit | Scattered across tools | Git history = full audit trail |
| Rollback | Redeploy previous image | `git revert` + auto-sync |
| Drift Detection | Manual | Automatic |

## Best Practices

1. **Separate app code and manifest repos** (or use different branches)
2. **Use Kustomize or Helm** for environment-specific overrides
3. **Enable auto-sync with self-heal** for production
4. **Use ApplicationSets** for multi-environment deployments
5. **Set up notifications** (Slack, Discord) for sync failures
6. **Use `syncOptions: CreateNamespace=true`** to auto-create namespaces
