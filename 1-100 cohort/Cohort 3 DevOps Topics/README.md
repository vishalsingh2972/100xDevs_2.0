# Cohort 3 DevOps and Web2 Add-on Notes

These notes cover the missing Cohort 3 topics requested in issue #6. They are written as quick revision notes for students who already know the Cohort 2 backend and DevOps basics.

## GitOps and Argo CD

GitOps means the desired production state lives in Git. A deployment tool watches the repository and continuously reconciles the cluster to match the manifests in Git.

Argo CD is a GitOps controller for Kubernetes:

- Application code is built into an image by CI.
- Kubernetes manifests or Helm charts are updated with the new image tag.
- Argo CD detects the Git change and syncs the cluster.
- Rollback is a Git revert instead of an SSH session on a server.

Minimal flow:

```text
Developer push -> CI builds image -> Git manifest changes -> Argo CD syncs Kubernetes
```

Use GitOps when multiple developers need an auditable deployment history. Avoid manual `kubectl apply` in production because it creates cluster state that is not reviewed in Git.

## Redis Streams

Redis Streams are append-only logs stored in Redis. They are useful when normal queues are not enough and consumers need to track which messages were processed.

Core commands:

```bash
XADD events * type user.created userId 123
XREAD COUNT 10 STREAMS events 0
XGROUP CREATE events workers 0 MKSTREAM
XREADGROUP GROUP workers worker-1 COUNT 10 STREAMS events >
XACK events workers 1700000000000-0
```

Use cases:

- Background job pipelines
- Event-driven notifications
- Chat or activity feeds
- Reliable processing with consumer groups

Key idea: a consumer group lets many workers share work while Redis remembers pending entries until they are acknowledged.

## Helm

Helm packages Kubernetes YAML into reusable charts. A chart contains templates, defaults, and release metadata.

Common files:

```text
Chart.yaml
values.yaml
templates/deployment.yaml
templates/service.yaml
templates/ingress.yaml
```

Useful commands:

```bash
helm create api
helm lint ./api
helm template api ./api -f values.prod.yaml
helm upgrade --install api ./api -n production
helm rollback api 1
```

Use Helm when the same application needs different configuration across development, staging, and production. Keep secrets out of `values.yaml`; use Kubernetes Secrets, External Secrets, or a cloud secret manager.

## Infrastructure as Code

Infrastructure as Code stores cloud infrastructure definitions in version-controlled files instead of creating resources manually from a dashboard.

Benefits:

- Pull requests review infrastructure changes.
- Environments can be recreated.
- Drift is easier to detect.
- Rollbacks are documented.

Typical resources include VPCs, subnets, security groups, load balancers, Kubernetes clusters, databases, and IAM roles.

IaC does not remove the need to understand cloud services. It makes changes repeatable and reviewable.

## AWS ECS

AWS ECS runs Docker containers without managing Kubernetes. It is a good stepping stone between single-server deployments and a full Kubernetes setup.

Important pieces:

- Cluster: logical group of compute capacity.
- Task definition: container image, CPU, memory, environment, ports.
- Service: keeps a desired number of tasks running.
- Fargate: serverless compute mode for ECS tasks.
- Application Load Balancer: routes HTTP traffic to running tasks.

Simple deployment flow:

```text
Build Docker image -> Push to ECR -> Register task definition -> Update ECS service
```

ECS is practical for Node.js APIs, workers, and cron-like services when the team wants managed container orchestration without Kubernetes complexity.

## Terraform

Terraform is a popular IaC tool. It compares declared infrastructure with real infrastructure and creates a plan before applying changes.

Basic workflow:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Example shape:

```hcl
resource "aws_s3_bucket" "uploads" {
  bucket = "my-app-uploads"
}
```

Best practices:

- Store state remotely, such as S3 plus DynamoDB locking on AWS.
- Review `terraform plan` in pull requests.
- Use modules for repeated infrastructure.
- Pin provider versions.
- Never commit secrets into `.tf` files or state.

## How These Topics Connect

For a production-ready full-stack app:

1. Terraform creates the cloud foundation.
2. ECS or Kubernetes runs containers.
3. Helm packages Kubernetes apps when Kubernetes is used.
4. GitOps with Argo CD keeps Kubernetes deployments synced from Git.
5. Redis Streams powers async jobs and event-driven processing.

Together, these tools move a project from "it runs locally" to "it can be deployed, reviewed, scaled, and operated by a team."
