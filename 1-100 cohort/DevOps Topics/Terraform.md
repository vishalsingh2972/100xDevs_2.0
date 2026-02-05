# Terraform

## What is Terraform?

Terraform is an open-source Infrastructure as Code (IaC) tool by HashiCorp that allows you to define and provision infrastructure using a declarative configuration language (HCL).

## Key Features

- **Multi-cloud** - AWS, Azure, GCP, and 3000+ providers
- **Declarative** - Describe desired state, Terraform figures out how
- **State Management** - Tracks resources to enable updates/deletes
- **Plan/Apply** - Preview changes before applying
- **Modules** - Reusable infrastructure components

## Installation

### macOS
```bash
brew install terraform
```

### Linux
```bash
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

### Verify
```bash
terraform version
```

## Basic Workflow

```bash
terraform init     # Initialize, download providers
terraform plan     # Preview changes
terraform apply    # Execute changes
terraform destroy  # Remove all resources
```

## Core Concepts

### Providers
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
```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  
  tags = {
    Name = "web-server"
  }
}
```

### Variables
```hcl
# variables.tf
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# Usage
resource "aws_instance" "web" {
  instance_type = var.instance_type
}
```

### Outputs
```hcl
output "instance_ip" {
  description = "Public IP of the instance"
  value       = aws_instance.web.public_ip
}

output "instance_id" {
  value     = aws_instance.web.id
  sensitive = true  # Hide in logs
}
```

### Data Sources
```hcl
# Query existing resources
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "web" {
  ami = data.aws_ami.amazon_linux.id
}
```

## Project Structure

```
project/
├── main.tf           # Main resources
├── variables.tf      # Variable declarations
├── outputs.tf        # Output declarations
├── terraform.tfvars  # Variable values
├── providers.tf      # Provider configuration
├── backend.tf        # State backend config
└── modules/
    └── vpc/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

## Complete Example: Web Server with VPC

```hcl
# providers.tf
terraform {
  required_version = ">= 1.0"
  
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

# variables.tf
variable "region" {
  default = "us-east-1"
}

variable "environment" {
  default = "dev"
}

# main.tf
# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  
  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

# Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.region}a"
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "<h1>Hello from Terraform!</h1>" > /var/www/html/index.html
              EOF

  tags = {
    Name = "${var.environment}-web-server"
  }
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# outputs.tf
output "web_url" {
  value = "http://${aws_instance.web.public_ip}"
}
```

## Remote State

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### Create S3 Backend
```hcl
# Run this first with local backend
resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
}
```

## Modules

### Using Modules
```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
  
  name = "my-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway = true
}
```

### Creating Modules
```hcl
# modules/ec2/main.tf
resource "aws_instance" "this" {
  ami           = var.ami_id
  instance_type = var.instance_type
  
  tags = {
    Name = var.name
  }
}

# modules/ec2/variables.tf
variable "ami_id" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "name" {
  type = string
}

# modules/ec2/outputs.tf
output "instance_id" {
  value = aws_instance.this.id
}

# Usage
module "web_server" {
  source = "./modules/ec2"
  
  ami_id        = "ami-xxx"
  instance_type = "t3.small"
  name          = "web"
}
```

## Loops and Conditionals

### Count
```hcl
resource "aws_instance" "web" {
  count         = 3
  ami           = "ami-xxx"
  instance_type = "t3.micro"
  
  tags = {
    Name = "web-${count.index}"
  }
}
```

### For Each
```hcl
variable "instances" {
  default = {
    web  = "t3.micro"
    api  = "t3.small"
    db   = "t3.medium"
  }
}

resource "aws_instance" "servers" {
  for_each      = var.instances
  ami           = "ami-xxx"
  instance_type = each.value
  
  tags = {
    Name = each.key
  }
}
```

### Conditionals
```hcl
resource "aws_instance" "web" {
  ami           = "ami-xxx"
  instance_type = var.environment == "prod" ? "t3.large" : "t3.micro"
}

# Conditional resource creation
resource "aws_eip" "web" {
  count    = var.create_eip ? 1 : 0
  instance = aws_instance.web.id
}
```

## Useful Commands

```bash
# Format code
terraform fmt

# Validate configuration
terraform validate

# Show current state
terraform show

# List resources in state
terraform state list

# Import existing resource
terraform import aws_instance.web i-1234567890abcdef0

# Remove resource from state
terraform state rm aws_instance.web

# Refresh state
terraform refresh

# Target specific resource
terraform apply -target=aws_instance.web
```

## Best Practices

1. **Always use remote state** - Never commit `.tfstate`
2. **Lock versions** - Pin provider and module versions
3. **Use variables** - Avoid hardcoded values
4. **Format code** - Run `terraform fmt`
5. **Use modules** - Don't repeat yourself
6. **Review plans** - Always check before applying
7. **Use workspaces** - Or directories for environments
8. **Secure secrets** - Use Vault, SSM, or environment variables

## Resources

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Terraform Registry](https://registry.terraform.io/)
- [AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
