
# Additional Topics - 100xDevs Cohort 3

This document covers additional Web2 and DevOps topics introduced in Cohort 3.

## GitOps / ArgoCD

GitOps is a way of implementing Continuous Deployment for cloud native applications.

### Key Concepts
- Declarative infrastructure: Everything defined in Git as source of truth
- ArgoCD: A declarative GitOps tool for Kubernetes
- Sync strategies: Automatic vs manual sync

### ArgoCD Workflow
1. Define application state in Git repository
2. ArgoCD monitors the repo for changes
3. When changes detected, ArgoCD syncs the cluster to match desired state
4. Rollback is as simple as reverting the Git commit

### Benefits
- Single source of truth (Git)
- Easy rollbacks via Git revert
- Audit trail through Git history
- Increased security (no direct cluster access)

---

## Redis Streams

Redis Streams is a data structure for high-speed streaming data processing.

### Key Concepts
- Streams as append-only log data structures
- Consumer groups for message distribution
- Message IDs and ranges

### Use Cases
- Event sourcing systems
- Real-time data pipelines
- Message queuing with persistence

### Basic Commands
```
XADD mystream * field1 value1 field2 value2
XREAD COUNT 2 STREAMS mystream 0
XGROUP CREATE mystream mygroup $
XREADGROUP GROUP mygroup consumer1 COUNT 1 STREAMS mystream >
```

---

## Helm

Helm is the package manager for Kubernetes.

### Key Concepts
- Charts: Packages of pre-configured Kubernetes resources
- Releases: Instances of charts running in a cluster
- Repositories: Places where charts are stored and shared
- Values: Configuration that can be overridden per deployment

### Common Commands
```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release bitnami/nginx
helm upgrade my-release bitnami/nginx --set service.type=NodePort
helm rollback my-release 1
helm uninstall my-release
```

---

## Infrastructure as Code (IaC)

IaC is the practice of managing infrastructure through machine-readable definition files.

### Key Tools
- **Terraform**: Multi-cloud infrastructure provisioning
- **Pulumi**: IaC using general-purpose programming languages
- **Ansible**: Configuration management and automation
- **CloudFormation**: AWS-specific IaC

### Benefits
- Version control for infrastructure
- Reproducible environments
- Automated provisioning
- Reduced human error

---

## AWS ECS

Amazon Elastic Container Service is a fully managed container orchestration service.

### Key Concepts
- Task Definitions: Blueprint for your application (JSON)
- Services: Ensure desired number of tasks running
- Clusters: Logical grouping of tasks/services
- Fargate vs EC2 launch types

### ECS Workflow
1. Create a task definition (container image, CPU, memory, port mappings)
2. Create a cluster
3. Create a service with desired task count
4. ECS automatically maintains the desired state

---

## Terraform

Terraform by HashiCorp is an open-source infrastructure as code tool.

### Key Concepts
- Provider: Plugin for interacting with cloud APIs (AWS, GCP, Azure)
- Resource: Infrastructure component (EC2, S3, VPC)
- State: Mapping between resources and real-world infrastructure
- Module: Reusable Terraform configuration

### Basic Example
```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "example-instance"
  }
}
```

### Commands
```
terraform init    # Initialize working directory
terraform plan    # Preview changes
terraform apply   # Apply changes
terraform destroy # Remove all resources
```

---

*Documentation contributed via D3 GiMax (Bounty Hunter)*
