# Infrastructure as Code (IaC)

## What is IaC?

Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure through machine-readable configuration files.

### Benefits

1. **Version Control** - Track infrastructure changes
2. **Reproducibility** - Create identical environments
3. **Automation** - Reduce manual errors
4. **Collaboration** - Team can review and approve changes
5. **Documentation** - Infrastructure is self-documenting

## IaC Tools

### Terraform
- Cloud-agnostic
- Declarative syntax
- State management
- Large provider ecosystem

### AWS CloudFormation
- AWS-native
- JSON/YAML templates
- Tight AWS integration
- No additional cost

### Pulumi
- Programming languages (Python, TypeScript, Go)
- Real code constructs
- Strong typing
- Reusable components

### Ansible
- Configuration management
- Agentless
- YAML playbooks
- Large module library

## Best Practices

1. **Use Version Control** - Store all IaC in Git
2. **Modularize** - Break into reusable modules
3. **Use Variables** - Parameterize configurations
4. **Test Changes** - Validate before applying
5. **Document** - Add comments and README
6. **Review** - Peer review all changes
7. **Backup State** - Store state securely

## Example: Terraform

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
  }
}
```

## Example: CloudFormation

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t2.micro
      Tags:
        - Key: Name
          Value: WebServer
```

## Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Ansible Documentation](https://docs.ansible.com/)
