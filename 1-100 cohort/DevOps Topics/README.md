# DevOps Topics - Cohort 3 Additions

This section covers additional DevOps topics introduced in Cohort 3 that complement the existing curriculum.

## Topics Covered

| Topic | Description | Difficulty |
|-------|-------------|------------|
| [GitOps & ArgoCD](./GitOps-ArgoCD.md) | Declarative GitOps continuous delivery | Intermediate |
| [Redis Streams](./Redis-Streams.md) | Event streaming with Redis | Intermediate |
| [Helm](./Helm.md) | Kubernetes package manager | Intermediate |
| [Infrastructure as Code (IaC)](./IaC.md) | Managing infrastructure through code | Intermediate |
| [AWS ECS](./AWS-ECS.md) | Container orchestration on AWS | Intermediate |
| [Terraform](./Terraform.md) | Multi-cloud infrastructure provisioning | Intermediate |

## Prerequisites

Before diving into these topics, ensure you have:
- Basic understanding of Docker and containers
- Familiarity with Kubernetes concepts
- AWS account (for ECS and Terraform AWS examples)
- Git knowledge

## Learning Path

1. **Start with IaC concepts** - Understand the philosophy
2. **Learn Terraform** - The foundation of modern IaC
3. **Master Helm** - Package your Kubernetes apps
4. **Implement GitOps with ArgoCD** - Automate deployments
5. **Explore AWS ECS** - AWS-native container orchestration
6. **Add Redis Streams** - Event-driven architectures

## Quick Reference Commands

```bash
# Terraform
terraform init
terraform plan
terraform apply

# Helm
helm install <release> <chart>
helm upgrade <release> <chart>
helm list

# ArgoCD
argocd app create
argocd app sync
argocd app get

# AWS ECS CLI
aws ecs create-cluster --cluster-name my-cluster
aws ecs create-service --cluster my-cluster --service-name my-service
```
