# IaC (Infrastructure as Code)

## What is IaC?

Infrastructure as Code (IaC) means **managing and provisioning infrastructure through code** instead of manual processes. You write configuration files that define your servers, networks, databases, and other resources.

### Why IaC?

- **Reproducibility** — Same config → same infrastructure, every time
- **Version Control** — Track changes, rollback with Git
- **Automation** — No manual clicking through AWS/GCP consoles
- **Documentation** — The code IS the documentation
- **Scalability** — Spin up 100 servers as easily as 1

## Approaches

| Approach | Description | Tools |
|----------|-------------|-------|
| **Declarative** | Describe *what* you want | Terraform, CloudFormation, Pulumi |
| **Imperative** | Describe *how* to get there | Ansible, Chef, Puppet, shell scripts |

### Declarative vs Imperative

**Declarative (Terraform):**
```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}
```
→ "I want an EC2 instance with these specs. Figure out how to create it."

**Imperative (Shell):**
```bash
aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type t3.micro
```
→ "Run this exact command to create the instance."

## Popular IaC Tools

### 1. Terraform (HashiCorp)
- **Cloud-agnostic** — Works with AWS, GCP, Azure, and 100+ providers
- **Declarative HCL** language
- **State management** — Tracks what's deployed
- **Plan & Apply** workflow

### 2. AWS CloudFormation
- **AWS-native** — Best AWS integration
- **YAML/JSON** templates
- **StackSets** for multi-account/multi-region

### 3. Pulumi
- **Real programming languages** — TypeScript, Python, Go
- **Cloud-agnostic**
- Great for developers who prefer code over HCL/YAML

### 4. Ansible
- **Agentless** — Uses SSH
- **Imperative/Declarative hybrid**
- Great for **configuration management** (installing packages, setting up services)

### 5. Crossplane
- **Kubernetes-native** — Uses K8s CRDs for infrastructure
- **GitOps-friendly** — Works with ArgoCD

## IaC Project Structure

```
infrastructure/
├── main.tf           # Root module
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── providers.tf      # Provider configuration
├── backend.tf        # State backend (S3, etc.)
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── compute/
│   └── database/
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
└── .terraform.lock.hcl
```

## IaC Best Practices

1. **Use modules** — Reusable, shareable building blocks
2. **Separate environments** — Different state files for dev/staging/prod
3. **Store state remotely** — S3+DynamoDB (AWS), GCS (GCP), etc.
4. **Lock state** — Prevent concurrent modifications
5. **Use variables** — Parameterize everything environment-specific
6. **CI/CD pipeline** — Auto-plan on PR, auto-apply on merge
7. **Secrets management** — Never hardcode; use Vault, AWS Secrets Manager, etc.
8. **Tag everything** — Cost tracking, ownership, environment
9. **Pin provider versions** — Avoid breaking changes
10. **Test infrastructure** — Use `terraform plan`, policy tools (OPA, Checkov)

## IaC Pipeline (GitOps Flow)

```
Developer pushes code → CI runs terraform plan → PR review → Merge → CD runs terraform apply
```

## State Management

State is the **most critical** part of IaC. It maps your code to real resources.

| Storage | Pros | Cons |
|---------|------|------|
| Local file | Simple | Can't collaborate, no locking |
| S3 + DynamoDB | Remote, locked, versioned | AWS-specific setup |
| Terraform Cloud | Managed, free tier | Vendor lock-in |
| Git (not recommended) | Versioned | No locking, slow |

## When to Use What

- **Terraform** → Provisioning (create VPCs, EC2, RDS, etc.)
- **Ansible** → Configuration (install packages, configure services)
- **Helm + ArgoCD** → Kubernetes application deployments
- **Pulumi** → When your team prefers real programming languages
- **CloudFormation** → AWS-only shops wanting native integration
