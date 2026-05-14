# Terraform

## What is Terraform?

Terraform is an **infrastructure-as-code tool** by HashiCorp that lets you define cloud resources in declarative configuration files (HCL) and manage their lifecycle across 100+ cloud providers.

## Installation

```bash
# macOS
brew install terraform

# Linux
wget -O- https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip | sudo unzip -d /usr/local/bin

# Windows
choco install terraform
```

## Core Workflow

```bash
terraform init      # Download providers and modules
terraform plan      # Show what will change
terraform apply     # Apply changes
terraform destroy   # Tear down everything
```

## HCL Basics

### Provider Configuration

```hcl
# providers.tf
provider "aws" {
  region = "us-east-1"
}

# With backend for remote state
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "infra/terraform.tfstate"
    region = "us-east-1"
  }
}
```

### Variables

```hcl
# variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "allowed_ports" {
  description = "Allowed ingress ports"
  type        = list(number)
  default     = [80, 443, 22]
}
```

### Resources

```hcl
# main.tf
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-public-${count.index}"
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "${var.environment}-web"
  }
}
```

### Data Sources

```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}
```

### Outputs

```hcl
# outputs.tf
output "vpc_id" {
  value = aws_vpc.main.id
}

output "instance_public_ip" {
  value = aws_instance.web.public_ip
}
```

## Modules

```hcl
module "networking" {
  source = "./modules/networking"

  vpc_cidr     = "10.0.0.0/16"
  environment  = var.environment
}

module "database" {
  source = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier        = "${var.environment}-db"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  username          = "admin"
  password          = var.db_password
  subnet_ids        = module.networking.private_subnet_ids
  vpc_security_group_ids = [module.networking.db_sg_id]
}
```

## Variable Files

```bash
# dev.tfvars
environment   = "dev"
instance_type = "t3.micro"

# prod.tfvars
environment   = "prod"
instance_type = "m5.large"
```

```bash
terraform apply -var-file="dev.tfvars"
terraform apply -var-file="prod.tfvars"
```

## State Management

### Remote State (S3)

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "project/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

### State Commands

```bash
terraform state list              # List all resources
terraform state show aws_vpc.main # Show resource details
terraform state mv aws_vpc.old aws_vpc.new  # Rename resource
terraform state rm aws_instance.old         # Remove from state (keep real resource)
terraform import aws_instance.web i-12345   # Import existing resource
```

## Common Patterns

### For_each

```hcl
resource "aws_security_group_rule" "ingress" {
  for_each = toset(var.allowed_ports)

  type              = "ingress"
  from_port         = each.value
  to_port           = each.value
  protocol          = "tcp"
  security_group_id = aws_security_group.web.id
  cidr_blocks       = ["0.0.0.0/0"]
}
```

### Dynamic Blocks

```hcl
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2021-06"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }

  dynamic "default_action" {
    for_each = var.enable_redirect ? [1] : []
    content {
      type = "redirect"
      redirect {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  }
}
```

### Locals

```hcl
locals {
  common_tags = {
    Environment = var.environment
    Project     = "my-app"
    ManagedBy   = "terraform"
  }

  name_prefix = "${var.environment}-my-app"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags       = merge(local.common_tags, { Name = "${local.name_prefix}-vpc" })
}
```

## Best Practices

1. **Use remote state** — Never commit `.tfstate` to Git
2. **Use modules** — Reuse and share infrastructure components
3. **Pin provider versions** — `version = "~> 5.0"`
4. **Use `terraform plan`** before every apply
5. **Run in CI/CD** — Plan on PR, apply on merge
6. **Use workspaces or directories** for environment separation
7. **Never edit state manually** — Use `terraform state` commands
8. **Use `lifecycle` blocks** — `prevent_destroy`, `ignore_changes`
9. **Validate and format** — `terraform validate`, `terraform fmt`
10. **Use `check` blocks** for custom validation
