# Infrastructure as Code (IaC)

## What is Infrastructure as Code?

Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure through **machine-readable configuration files** rather than manual processes.

### Key Benefits

- **Reproducibility** — Spin up identical environments
- **Version Control** — Track infrastructure changes in Git
- **Automation** — No manual clicking in cloud consoles
- **Documentation** — Code IS the documentation
- **Cost Control** — Easy to tear down unused resources

### IaC Tools Comparison

| Tool | Language | State Management | Cloud Support |
|------|----------|------------------|---------------|
| Terraform | HCL | Remote/Local state | All major clouds |
| Pulumi | TS/Python/Go/ | Managed/Self-hosted | All major clouds |
| AWS CDK | TS/Python/Java | CloudFormation | AWS only |
| CloudFormation | YAML/JSON | AWS managed | AWS only |
| Ansible | YAML | No state | All + on-prem |

---

## Terraform (Detailed section below)

See [Terraform](./terraform.md) for comprehensive coverage.

### Quick Example

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "HelloWorld"
  }
}

output "instance_ip" {
  value = aws_instance.web.public_ip
}
```

---

## Pulumi

Pulumi lets you define infrastructure using **general-purpose programming languages**.

### Installation

```bash
# Install Pulumi
curl -fsSL https://get.pulumi.com | sh

# Login (free tier)
pulumi login

# Create new project
mkdir my-infra && cd my-infra
pulumi new aws-typescript
```

### TypeScript Example

```typescript
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Create a VPC
const vpc = new aws.ec2.Vpc("main", {
  cidrBlock: "10.0.0.0/16",
  enableDnsHostnames: true,
  tags: { Name: "main-vpc" },
});

// Create a subnet
const subnet = new aws.ec2.Subnet("public", {
  vpcId: vpc.id,
  cidrBlock: "10.0.1.0/24",
  mapPublicIpOnLaunch: true,
  tags: { Name: "public-subnet" },
});

// Create a security group
const sg = new aws.ec2.SecurityGroup("web-sg", {
  vpcId: vpc.id,
  ingress: [
    { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
    { protocol: "tcp", fromPort: 443, toPort: 443, cidrBlocks: ["0.0.0.0/0"] },
  ],
  egress: [
    { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] },
  ],
});

// Create an EC2 instance
const server = new aws.ec2.Instance("web-server", {
  instanceType: "t3.micro",
  ami: "ami-0c55b159cbfafe1f0",
  subnetId: subnet.id,
  vpcSecurityGroupIds: [sg.id],
  tags: { Name: "web-server" },
});

// Export outputs
export const publicIp = server.publicIp;
export const publicDns = server.publicDns;
```

### Deploy

```bash
# Preview changes
pulumi preview

# Deploy
pulumi up

# Destroy
pulumi destroy

# View stack
pulumi stack output
```

---

## AWS CDK

AWS Cloud Development Kit defines infrastructure using familiar programming languages.

### Installation

```bash
npm install -g aws-cdk
cdk init app --language typescript
```

### TypeScript Example

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2,
    });

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc,
    });

    // Create Fargate Service with ALB
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MyService', {
      cluster: cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('my-app:latest'),
        containerPort: 3000,
      },
      publicLoadBalancer: true,
    });
  }
}
```

### Deploy

```bash
# Synthesize CloudFormation template
cdk synth

# Deploy
cdk deploy

# Destroy
cdk destroy
```

---

## Best Practices

### 1. State Management

```hcl
# Terraform remote state
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt = true
  }
}
```

### 2. Module Organization

```
infrastructure/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ecs/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── rds/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       └── terraform.tfvars
└── backend.tf
```

### 3. Variable Validation

```hcl
variable "environment" {
  type        = string
  description = "Deployment environment"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.micro"
  
  validation {
    condition     = can(regex("^t3\\.", var.instance_type))
    error_message = "Only t3 instances are allowed."
  }
}
```

### 4. Secrets Management

```typescript
// AWS Secrets Manager with Pulumi
import * as aws from "@pulumi/aws";

const secret = new aws.secretsmanager.Secret("db-password", {
  description: "Database password",
});

const secretVersion = new aws.secretsmanager.SecretVersion("db-password-version", {
  secretId: secret.id,
  secretString: "my-secure-password",
});

// Reference in ECS task definition
const taskDef = new aws.ecs.TaskDefinition("app", {
  containerDefinitions: JSON.stringify([{
    name: "app",
    image: "my-app:latest",
    secrets: [{
      name: "DB_PASSWORD",
      valueFrom: secretVersion.arn,
    }],
  }],
});
```

---

## CI/CD Integration

### GitHub Actions with Terraform

```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
      
      - name: Terraform Init
        run: terraform init
      
      - name: Terraform Plan
        run: terraform plan -out=tfplan
      
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve tfplan
```

---

## Resources

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Infrastructure as Code Patterns](https://www.terraform-best-practices.com/)
