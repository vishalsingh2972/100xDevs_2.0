# GitOps & ArgoCD

GitOps uses Git as single source of truth for declarative infrastructure.

## ArgoCD
Declarative GitOps CD tool for Kubernetes.

```bash
argocd app create myapp --repo URL --path ./k8s
argocd app sync myapp
```
