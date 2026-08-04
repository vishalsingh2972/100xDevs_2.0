# Terraform

IaC by HashiCorp. Define resources in HCL.

```hcl
provider "aws" { region = "us-east-1" }
resource "aws_instance" "web" {
  ami = "ami-xxx"
  instance_type = "t2.micro"
}
```

```bash
terraform init && terraform plan && terraform apply
```
