# Terraform - Infrastructure as Code

## What is Terraform?

Terraform is an open-source Infrastructure as Code (IaC) tool created by HashiCorp. It lets you define cloud and on-prem resources in human-readable configuration files that you can version, reuse, and share.

### Why Terraform?

- **Declarative**: You describe *what* you want, Terraform figures out *how* to get there.
- **Cloud-agnostic**: Works with AWS, GCP, Azure, and hundreds of other providers.
- **State management**: Tracks real-world resources in a state file, enabling incremental changes.
- **Plan before apply**: `terraform plan` shows exactly what will change before you commit.

---

## Core Concepts

### Providers

Providers are plugins that interact with APIs (AWS, Azure, GCP, etc.):

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
```

### Resources

Resources are the actual infrastructure objects:

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
  }
}
```

### Variables

Variables make configurations reusable:

```hcl
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "allowed_ports" {
  description = "List of allowed ingress ports"
  type        = list(number)
  default     = [80, 443, 22]
}

# Usage in a resource:
resource "aws_instance" "web" {
  instance_type = var.instance_type
}
```

### Outputs

Outputs expose values after apply:

```hcl
output "instance_ip" {
  description = "Public IP of the web server"
  value       = aws_instance.web.public_ip
}
```

### Data Sources

Read existing resources (not managed by Terraform):

```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}
```

---

## State Management

Terraform stores the state of your infrastructure in a `terraform.tfstate` file. This is critical — it maps your config to real-world resources.

### Remote State with S3

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "infra/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

> **Important**: Always use remote state in production with locking (DynamoDB for S3) to prevent concurrent modifications.

---

## Modules

Modules are reusable packages of Terraform configs:

```
modules/
└── ec2/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

```hcl
# modules/ec2/main.tf
resource "aws_instance" "this" {
  ami           = var.ami
  instance_type = var.instance_type
  tags          = var.tags
}
```

```hcl
# Using the module
module "web_server" {
  source        = "./modules/ec2"
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.small"
  tags = {
    Name = "WebServer"
    Env  = "production"
  }
}
```

---

## Complete Example: VPC + EC2

```hcl
# main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# --- VPC ---
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project}-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.region}a"

  tags = {
    Name = "${var.project}-public-subnet"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project}-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# --- Security Group ---
resource "aws_security_group" "web" {
  name        = "${var.project}-web-sg"
  description = "Allow HTTP and SSH"
  vpc_id      = aws_vpc.main.id

  dynamic "ingress" {
    for_each = var.allowed_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- EC2 ---
resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  tags = {
    Name = "${var.project}-web"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# --- Variables ---
variable "region" {
  default = "us-east-1"
}

variable "project" {
  default = "100xdevs"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "allowed_ports" {
  default = [22, 80, 443]
}

# --- Outputs ---
output "instance_public_ip" {
  value = aws_instance.web.public_ip
}

output "vpc_id" {
  value = aws_vpc.main.id
}
```

---

## Workflows

```bash
# Initialize (download providers, modules)
terraform init

# Format code
terraform fmt

# Validate syntax
terraform validate

# See what will change
terraform plan

# Apply changes
terraform apply           # interactive
terraform apply -auto-approve  # non-interactive

# Destroy everything
terraform destroy

# Import existing resource into state
terraform import aws_instance.web i-1234567890abcdef0
```

---

## Terraform vs Other IaC Tools

| Feature | Terraform | CloudFormation | Pulumi |
|---------|-----------|----------------|--------|
| Language | HCL | YAML/JSON | Python/Go/TS |
| Multi-cloud | ✅ | ❌ (AWS only) | ✅ |
| State mgmt | Built-in | Automatic | Built-in |
| Open source | ✅ | ❌ | ✅ |
| Learning curve | Moderate | Low | High |

---

## Best Practices

1. **Use remote state** — Never commit `terraform.tfstate` to git.
2. **Lock provider versions** — Pin versions to avoid breaking changes.
3. **Use modules** — Organize code into reusable components.
4. **Use `terraform plan`** — Always review changes before applying.
5. **Separate environments** — Use separate state files for dev/staging/prod.
6. **Use variables files** — `terraform.tfvars` for environment-specific values.
7. **Backend locking** — Enable state locking to prevent corruption.

---

## Common Commands Cheat Sheet

| Command | Description |
|---------|-------------|
| `terraform init` | Initialize working directory |
| `terraform plan` | Show execution plan |
| `terraform apply` | Apply changes |
| `terraform destroy` | Destroy infrastructure |
| `terraform output` | Show output values |
| `terraform state list` | List resources in state |
| `terraform import` | Import existing resource |
| `terraform taint` | Force recreation of resource |
| `terraform workspace list` | List workspaces |
