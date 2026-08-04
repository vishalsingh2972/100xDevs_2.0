# Helm

Kubernetes package manager.

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release bitnami/nginx
helm list
helm upgrade my-release bitnami/nginx
helm rollback my-release 1
```

Chart: Chart.yaml + values.yaml + templates/
