# Terraform

## What is Terraform?

Terraform is an infrastructure as code tool that lets you define, preview, and deploy cloud infrastructure.

### Key Features

- **Cloud Agnostic** - Works with any cloud provider
- **Declarative Syntax** - Describe desired state
- **State Management** - Track infrastructure state
- **Plan & Apply** - Preview changes before applying
- **Modular** - Reusable infrastructure modules

## Installation

```bash
# Linux
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# macOS
brew install terraform

# Verify
terraform version
```

## Basic Workflow

```bash
# Initialize
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy resources
terraform destroy
```

## HCL Syntax

```hcl
# Variables
variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# Resources
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
  }
}

# Outputs
output "instance_ip" {
  value = aws_instance.web.public_ip
}
```

## State Management

```bash
# List resources
terraform state list

# Show resource
terraform state show aws_instance.web

# Remove resource from state
terraform state rm aws_instance.web

# Import existing resource
terraform import aws_instance.web i-1234567890abcdef0
```

## Modules

```hcl
# modules/vpc/main.tf
variable "cidr_block" {
  type = string
}

resource "aws_vpc" "main" {
  cidr_block = var.cidr_block
}

output "vpc_id" {
  value = aws_vpc.main.id
}

# main.tf
module "vpc" {
  source     = "./modules/vpc"
  cidr_block = "10.0.0.0/16"
}
```

## Best Practices

1. **Use Remote State** - Store state in S3, GCS, or Terraform Cloud
2. **Use Workspaces** - Separate environments
3. **Lock State** - Use DynamoDB for state locking
4. **Use Modules** - Reuse infrastructure code
5. **Version Pin** - Pin provider versions
6. **Use Variables** - Parameterize configurations
7. **Document** - Add descriptions to variables and outputs

## Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [Terraform Registry](https://registry.terraform.io/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
