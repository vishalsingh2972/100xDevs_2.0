# Infrastructure as Code (IaC)

## What is Infrastructure as Code?

Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure through machine-readable configuration files rather than physical hardware configuration or interactive configuration tools.

## Why IaC?

### Problems with Manual Infrastructure
- **Inconsistency** - Different environments drift apart
- **Slow** - Manual provisioning takes time
- **Error-prone** - Human errors are common
- **Undocumented** - Hard to track what exists
- **Hard to replicate** - Difficult to create identical environments

### Benefits of IaC
- **Version Control** - Track changes over time
- **Consistency** - Same config = same infrastructure
- **Speed** - Provision in minutes
- **Documentation** - Code is documentation
- **Collaboration** - Teams can review changes
- **Disaster Recovery** - Rebuild quickly
- **Cost Management** - Easy to tear down unused resources

## IaC Approaches

### Declarative vs Imperative

| Declarative | Imperative |
|-------------|------------|
| Describe desired state | Describe steps to reach state |
| Tool figures out how | You define the how |
| Terraform, CloudFormation | Ansible playbooks, scripts |

### Mutable vs Immutable

| Mutable | Immutable |
|---------|-----------|
| Update existing servers | Replace servers entirely |
| Configuration drift risk | Consistent deployments |
| Ansible, Chef | Terraform, Packer |

## Popular IaC Tools

### Provisioning Tools
| Tool | Type | Cloud Support |
|------|------|---------------|
| **Terraform** | Declarative | Multi-cloud |
| **CloudFormation** | Declarative | AWS only |
| **Pulumi** | Declarative | Multi-cloud |
| **CDK** | Declarative | AWS (multi via CDKTF) |

### Configuration Management
| Tool | Type | Use Case |
|------|------|----------|
| **Ansible** | Both | Server config, app deployment |
| **Chef** | Imperative | Server configuration |
| **Puppet** | Declarative | Server configuration |
| **SaltStack** | Both | Config management, orchestration |

### Container/Kubernetes
| Tool | Use Case |
|------|----------|
| **Helm** | K8s package management |
| **Kustomize** | K8s configuration |
| **ArgoCD** | GitOps deployments |

## Core Concepts

### State Management
```
Your Code    →    State File    →    Real Infrastructure
(desired)        (tracking)          (actual)
```

- **State** tracks what infrastructure exists
- State enables plan/diff operations
- Must be stored securely (S3, Terraform Cloud)

### Idempotency
Running the same code multiple times produces the same result:
```bash
# Run 1: Creates 3 servers
# Run 2: No changes (already exists)
# Run 3: No changes (already exists)
```

### Modules/Reusability
```
modules/
├── vpc/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── ec2/
└── rds/

environments/
├── dev/
│   └── main.tf    # uses modules
├── staging/
│   └── main.tf    # uses modules
└── production/
    └── main.tf    # uses modules
```

## IaC Workflow

```
1. Write Code
     ↓
2. Version Control (Git)
     ↓
3. Code Review (PR)
     ↓
4. Plan (preview changes)
     ↓
5. Apply (execute changes)
     ↓
6. State Updated
```

## Example: Simple Web App Infrastructure

### Directory Structure
```
infrastructure/
├── main.tf
├── variables.tf
├── outputs.tf
├── terraform.tfvars
└── modules/
    ├── networking/
    ├── compute/
    └── database/
```

### main.tf (simplified)
```hcl
provider "aws" {
  region = var.region
}

module "networking" {
  source = "./modules/networking"
  
  vpc_cidr     = var.vpc_cidr
  environment  = var.environment
}

module "compute" {
  source = "./modules/compute"
  
  instance_type = var.instance_type
  subnet_id     = module.networking.public_subnet_id
  environment   = var.environment
}

module "database" {
  source = "./modules/database"
  
  instance_class = var.db_instance_class
  subnet_ids     = module.networking.private_subnet_ids
  environment    = var.environment
}
```

## Best Practices

### 1. Use Version Control
```bash
# .gitignore
*.tfstate
*.tfstate.*
.terraform/
*.tfvars  # if contains secrets
```

### 2. Use Remote State
```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
    dynamodb_table = "terraform-locks"
  }
}
```

### 3. Use Workspaces or Directories for Environments
```bash
# Option 1: Workspaces
terraform workspace new staging
terraform workspace new production

# Option 2: Separate directories
environments/
├── dev/
├── staging/
└── production/
```

### 4. Lock Versions
```hcl
terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

### 5. Use Modules
- Don't repeat yourself
- Create reusable components
- Share across teams

### 6. Implement CI/CD
```yaml
# .github/workflows/terraform.yml
name: Terraform
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: hashicorp/setup-terraform@v2
      
      - name: Terraform Init
        run: terraform init
        
      - name: Terraform Plan
        run: terraform plan
        if: github.event_name == 'pull_request'
        
      - name: Terraform Apply
        run: terraform apply -auto-approve
        if: github.ref == 'refs/heads/main'
```

### 7. Security
- Never commit secrets
- Use secret management (Vault, AWS Secrets Manager)
- Encrypt state files
- Use least privilege IAM roles

## Tools Comparison

| Feature | Terraform | CloudFormation | Pulumi |
|---------|-----------|----------------|--------|
| Language | HCL | YAML/JSON | Python/TS/Go |
| Multi-cloud | ✅ | ❌ | ✅ |
| State | External | Managed | External/Cloud |
| Learning Curve | Medium | Medium | Low (if know lang) |
| Community | Large | AWS-focused | Growing |

## Resources

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [AWS CloudFormation](https://docs.aws.amazon.com/cloudformation/)
- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [IaC Best Practices](https://www.hashicorp.com/resources/terraform-best-practices)
