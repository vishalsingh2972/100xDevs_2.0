# Cohort 3 - Additional Web2/DevOps Topics (Quick Notes)

This note adds the missing topics mentioned in issue #6.

## 1) GitOps / ArgoCD
- **GitOps**: Keep desired Kubernetes state in Git; cluster auto-syncs to that state.
- **ArgoCD**: GitOps controller for Kubernetes with sync, diff, rollback, and app health views.
- Quick start:
  - Install ArgoCD in cluster
  - Register repo/manifests
  - Enable auto-sync + prune

## 2) Redis Streams
- Log-like data structure for event ingestion and async processing.
- Core commands: `XADD`, `XREAD`, `XGROUP CREATE`, `XREADGROUP`, `XACK`.
- Useful for queueing, event pipelines, and consumer groups.

## 3) Helm
- Kubernetes package manager.
- Main concepts: **Chart**, **values.yaml**, **release**.
- Typical flow: `helm repo add` -> `helm install` -> `helm upgrade`.

## 4) IaC (Infrastructure as Code)
- Provision cloud/network/resources using code instead of manual console changes.
- Benefits: repeatability, versioning, reviewability.
- Common tools: Terraform, Pulumi, CloudFormation.

## 5) AWS ECS
- Container orchestration service on AWS.
- Two modes: **Fargate** (serverless) and **EC2** (self-managed instances).
- Key entities: cluster, task definition, service, load balancer.

## 6) Terraform
- Declarative IaC using HCL.
- Standard workflow: `terraform init` -> `terraform plan` -> `terraform apply`.
- Best practice: remote state backend + state locking.

## Suggested learning links
- ArgoCD docs: https://argo-cd.readthedocs.io/
- Redis Streams intro: https://redis.io/docs/data-types/streams/
- Helm docs: https://helm.sh/docs/
- AWS ECS docs: https://docs.aws.amazon.com/ecs/
- Terraform docs: https://developer.hashicorp.com/terraform/docs
