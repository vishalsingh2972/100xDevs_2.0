# 100xDevs DevOps Bootcamp - Comprehensive Guide

This guide covers essential DevOps tools and practices that every modern developer should understand. These technologies form the backbone of modern cloud-native applications and infrastructure management.

## Table of Contents
1. [GitOps / ArgoCD](#1-gitops--argocd)
2. [Redis Streams](#2-redis-streams)
3. [Helm](#3-helm)
4. [Infrastructure as Code (IaC)](#4-infrastructure-as-code-iac)
5. [AWS ECS](#5-aws-ecs)
6. [Terraform](#6-terraform)

---

## 1. GitOps / ArgoCD

### Overview and Why It Matters
GitOps is a paradigm that uses Git repositories as the single source of truth for infrastructure and application configuration. ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes that automatically syncs your Git repository with your cluster state.

**Benefits:**
- **Declarative**: Entire system described declaratively
- **Versioned and Immutable**: Git provides version control and audit trails
- **Pulled Automatically**: Software agents pull changes rather than push
- **Continuously Reconciled**: Desired state is continuously applied

### Key Concepts

- **Application**: A group of Kubernetes resources as defined by a manifest
- **Repository**: Git repository containing application manifests
- **Target State**: Desired state of an application as represented by files in Git
- **Live State**: Live state of an application in the Kubernetes cluster
- **Sync Status**: Whether live state matches target state
- **Refresh**: Compare latest code in Git with live state
- **Sync**: Transition live state to match target state

### Getting Started / Installation

#### Install ArgoCD on Kubernetes

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

#### Install ArgoCD CLI

```bash
# Linux/macOS
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd

# Login via CLI
argocd login localhost:8080
```

### Basic Usage Examples

#### 1. Application Manifest Example

```yaml
# application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/username/my-app-config
    targetRevision: HEAD
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

#### 2. Deploy Application

```bash
# Apply application manifest
kubectl apply -f application.yaml

# Or create via CLI
argocd app create my-app \
  --repo https://github.com/username/my-app-config \
  --path k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace my-app
```

#### 3. Repository Structure Example

```
my-app-config/
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── configmap.yaml
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── README.md
```

### Best Practices

1. **Repository Structure**
   - Separate application code from configuration
   - Use environment-specific directories
   - Keep manifests in dedicated config repositories

2. **Security**
   - Use RBAC for access control
   - Enable audit logging
   - Use sealed secrets or external secret management

3. **Application Management**
   - Use Projects to group applications
   - Implement proper sync policies
   - Monitor sync status and health

4. **Git Workflow**
   - Use pull requests for configuration changes
   - Implement proper branching strategy
   - Tag releases for rollback capability

### Common Use Cases

- **Continuous Deployment**: Automatically deploy applications when Git changes
- **Multi-Environment Management**: Manage dev/staging/prod environments
- **Configuration Drift Detection**: Detect and correct configuration drift
- **Disaster Recovery**: Restore applications from Git state
- **Multi-Cluster Management**: Manage applications across multiple clusters

### Useful Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [GitOps Principles](https://opengitops.dev/)
- [ArgoCD Best Practices](https://argoproj.github.io/argo-cd/user-guide/best_practices/)

---

## 2. Redis Streams

### Overview and Why It Matters

Redis Streams is a data structure that acts like an append-only log, providing powerful stream processing capabilities. It's designed for high-throughput message streaming, event sourcing, and real-time analytics.

**Benefits:**
- **High Throughput**: Handles millions of messages per second
- **Persistence**: Messages are stored persistently
- **Consumer Groups**: Multiple consumers can process messages
- **Message Acknowledgment**: Reliable message processing
- **Time-based Queries**: Query messages by time range

### Key Concepts

- **Stream**: An append-only log of messages
- **Entry**: Individual message in a stream with unique ID
- **Consumer Group**: Group of consumers processing messages
- **Consumer**: Individual processor within a consumer group
- **PEL (Pending Entry List)**: List of messages delivered but not acknowledged
- **Message ID**: Unique identifier for each message (timestamp-sequence)

### Getting Started / Installation

#### Install Redis

```bash
# Docker
docker run -d -p 6379:6379 redis:latest

# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# macOS
brew install redis
redis-server
```

#### Connect to Redis

```bash
# Redis CLI
redis-cli

# Test connection
127.0.0.1:6379> ping
PONG
```

### Basic Usage Examples

#### 1. Adding Messages to Stream

```bash
# Add message with auto-generated ID
XADD mystream * user_id 123 action login timestamp 1640995200

# Add message with specific ID
XADD mystream 1640995200000-0 user_id 456 action logout

# Add multiple fields
XADD events * type purchase user_id 789 product_id 101 amount 99.99
```

#### 2. Reading Messages

```bash
# Read all messages
XREAD COUNT 10 STREAMS mystream 0

# Read new messages (blocking)
XREAD BLOCK 0 STREAMS mystream $

# Read from specific ID
XREAD COUNT 5 STREAMS mystream 1640995200000-0

# Read range of messages
XRANGE mystream - +
XRANGE mystream 1640995200000 1640995300000
```

#### 3. Consumer Groups

```bash
# Create consumer group
XGROUP CREATE mystream mygroup $ MKSTREAM

# Read as consumer
XREADGROUP GROUP mygroup consumer1 COUNT 1 STREAMS mystream >

# Acknowledge message
XACK mystream mygroup 1640995200000-0

# Check pending messages
XPENDING mystream mygroup
```

#### 4. Python Example

```python
import redis

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Add messages
r.xadd('user_events', {
    'user_id': '123',
    'event': 'page_view',
    'page': '/dashboard',
    'timestamp': '2024-01-01T10:00:00Z'
})

# Create consumer group
try:
    r.xgroup_create('user_events', 'analytics_group', id='0', mkstream=True)
except redis.ResponseError:
    pass  # Group already exists

# Consume messages
while True:
    messages = r.xreadgroup(
        'analytics_group',
        'consumer_1',
        {'user_events': '>'},
        count=1,
        block=1000
    )
    
    for stream, msgs in messages:
        for msg_id, fields in msgs:
            print(f"Processing: {msg_id} -> {fields}")
            # Process message
            r.xack('user_events', 'analytics_group', msg_id)
```

#### 5. Node.js Example

```javascript
const redis = require('redis');
const client = redis.createClient();

// Add message
await client.xAdd('orders', '*', {
  order_id: '12345',
  customer_id: '67890',
  amount: '150.00',
  status: 'pending'
});

// Create consumer group
try {
  await client.xGroupCreate('orders', 'order_processors', '$', {
    MKSTREAM: true
  });
} catch (err) {
  // Group already exists
}

// Consume messages
while (true) {
  const messages = await client.xReadGroup(
    'order_processors',
    'processor_1',
    [{ key: 'orders', id: '>' }],
    { COUNT: 1, BLOCK: 1000 }
  );

  for (const message of messages) {
    console.log('Processing:', message);
    // Acknowledge message
    await client.xAck('orders', 'order_processors', message.id);
  }
}
```

### Best Practices

1. **Message ID Strategy**
   - Use auto-generated IDs for most cases
   - Use custom IDs only when you need specific ordering

2. **Consumer Groups**
   - Use consumer groups for load balancing
   - Implement proper error handling and retry logic
   - Monitor pending messages (PEL)

3. **Memory Management**
   - Set MAXLEN to limit stream size
   - Use XTRIM to remove old messages
   - Consider using approximate trimming (~) for performance

4. **Error Handling**
   - Implement dead letter queues
   - Handle consumer failures gracefully
   - Monitor consumer lag

### Common Use Cases

- **Event Sourcing**: Store all events that change application state
- **Activity Feeds**: Real-time user activity tracking
- **IoT Data Processing**: Handle sensor data streams
- **Log Aggregation**: Centralized logging system
- **Message Queues**: Reliable message processing
- **Real-time Analytics**: Process data streams in real-time

### Useful Resources

- [Redis Streams Documentation](https://redis.io/topics/streams-intro)
- [Redis Streams Tutorial](https://redis.io/topics/streams-tutorial)
- [Redis Streams Best Practices](https://redis.io/topics/streams-intro#streams-basics)

---

## 3. Helm

### Overview and Why It Matters

Helm is the package manager for Kubernetes, often called "the apt/yum for Kubernetes." It helps you manage Kubernetes applications through Helm Charts, which are packages of pre-configured Kubernetes resources.

**Benefits:**
- **Package Management**: Install, upgrade, and manage applications easily
- **Templating**: Reuse configurations across environments
- **Dependency Management**: Handle application dependencies
- **Release Management**: Track and rollback deployments
- **Community Charts**: Access thousands of pre-built charts

### Key Concepts

- **Chart**: A Helm package containing Kubernetes resource definitions
- **Release**: An instance of a chart running in a Kubernetes cluster
- **Repository**: A place where charts are stored and shared
- **Values**: Configuration parameters that customize chart behavior
- **Templates**: Kubernetes manifests with templating syntax
- **Hooks**: Scripts that run at specific points in the release lifecycle

### Getting Started / Installation

#### Install Helm

```bash
# Linux/macOS
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Windows (Chocolatey)
choco install kubernetes-helm

# Verify installation
helm version
```

#### Add Helm Repositories

```bash
# Add official stable repository
helm repo add stable https://charts.helm.sh/stable

# Add bitnami repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
helm repo update

# List repositories
helm repo list
```

### Basic Usage Examples

#### 1. Installing Charts

```bash
# Search for charts
helm search repo nginx

# Install a chart
helm install my-nginx bitnami/nginx

# Install with custom values
helm install my-nginx bitnami/nginx \
  --set service.type=LoadBalancer \
  --set replicaCount=3

# Install from values file
helm install my-nginx bitnami/nginx -f values.yaml
```

#### 2. Managing Releases

```bash
# List releases
helm list

# Get release info
helm get all my-nginx

# Upgrade release
helm upgrade my-nginx bitnami/nginx --set replicaCount=5

# Rollback release
helm rollback my-nginx 1

# Uninstall release
helm uninstall my-nginx
```

#### 3. Creating a Chart

```bash
# Create new chart
helm create my-app

# Chart structure
my-app/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration values
├── templates/          # Kubernetes manifest templates
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl   # Template helpers
└── charts/            # Dependencies
```

#### 4. Chart.yaml Example

```yaml
apiVersion: v2
name: my-app
description: A Helm chart for my application
version: 0.1.0
appVersion: "1.0"
dependencies:
  - name: redis
    version: "17.3.7"
    repository: https://charts.bitnami.com/bitnami
    condition: redis.enabled
keywords:
  - web
  - application
maintainers:
  - name: Your Name
    email: your.email@example.com
```

#### 5. values.yaml Example

```yaml
# Default values for my-app
replicaCount: 2

image:
  repository: nginx
  tag: "1.21"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  className: ""
  annotations: {}
  hosts:
    - host: my-app.local
      paths:
        - path: /
          pathType: Prefix
  tls: []

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 100
  targetCPUUtilizationPercentage: 80

redis:
  enabled: true
  auth:
    enabled: false
```

#### 6. Deployment Template Example

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "my-app.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "my-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "my-app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
```

#### 7. Testing and Validating Charts

```bash
# Lint chart
helm lint my-app

# Dry run installation
helm install my-app ./my-app --dry-run --debug

# Template rendering
helm template my-app ./my-app

# Test release
helm test my-release
```

### Best Practices

1. **Chart Design**
   - Use semantic versioning
   - Provide sensible defaults
   - Make charts configurable but not complex
   - Include proper documentation

2. **Values Structure**
   - Use nested values for organization
   - Provide examples in comments
   - Use consistent naming conventions
   - Validate required values

3. **Templates**
   - Use template functions and helpers
   - Implement proper labels and annotations
   - Handle edge cases gracefully
   - Use conditionals wisely

4. **Security**
   - Never hardcode secrets
   - Use Kubernetes secrets properly
   - Implement RBAC when needed
   - Validate user inputs

5. **Testing**
   - Test with different value combinations
   - Implement chart tests
   - Use CI/CD for chart validation
   - Test upgrades and rollbacks

### Common Use Cases

- **Application Deployment**: Deploy complex applications with dependencies
- **Environment Management**: Manage different environments (dev/staging/prod)
- **CI/CD Integration**: Automate deployments in pipelines
- **Microservices**: Deploy and manage microservice architectures
- **Database Deployment**: Deploy databases and data services
- **Monitoring Stack**: Deploy monitoring and logging solutions

### Useful Resources

- [Helm Documentation](https://helm.sh/docs/)
- [Helm Charts Repository](https://artifacthub.io/)
- [Helm Best Practices](https://helm.sh/docs/chart_best_practices/)
- [Bitnami Charts](https://github.com/bitnami/charts)

---

## 4. Infrastructure as Code (IaC)

### Overview and Why It Matters

Infrastructure as Code (IaC) is the practice of managing and provisioning computing infrastructure through machine-readable definition files, rather than through manual hardware configuration or interactive configuration tools.

**Benefits:**
- **Consistency**: Identical infrastructure across environments
- **Version Control**: Track infrastructure changes over time
- **Automation**: Reduce manual errors and deployment time
- **Scalability**: Easily replicate and scale infrastructure
- **Cost Management**: Better resource optimization and tracking
- **Disaster Recovery**: Quickly recreate infrastructure

### Key Concepts

- **Declarative vs Imperative**: Describe desired state vs step-by-step instructions
- **Idempotency**: Running the same configuration multiple times produces the same result
- **State Management**: Tracking current infrastructure state
- **Drift Detection**: Identifying changes made outside of IaC
- **Modules/Components**: Reusable infrastructure components
- **Plan/Preview**: See changes before applying them

### Tools Comparison

| Tool | Language | Cloud Support | State Management | Learning Curve |
|------|----------|---------------|------------------|----------------|
| **Terraform** | HCL | Multi-cloud | Local/Remote | Medium |
| **Pulumi** | Multiple (Python, JS, Go) | Multi-cloud | Automatic | Medium-High |
| **CloudFormation** | JSON/YAML | AWS Only | AWS Managed | Medium |
| **CDK** | Multiple (TypeScript, Python) | Multi-cloud | Automatic | Medium-High |
| **Ansible** | YAML | Multi-cloud | Stateless | Low-Medium |

### Getting Started Examples

#### 1. Terraform Example

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
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Subnet
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
  }
}

# EC2 Instance
resource "aws_instance" "app" {
  count                  = var.instance_count
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public[count.index % length(aws_subnet.public)].id
  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = templatefile("${path.module}/user_data.sh", {
    app_name = var.project_name
  })

  tags = {
    Name = "${var.project_name}-app-${count.index + 1}"
  }
}
```

#### 2. Pulumi Example (Python)

```python
import pulumi
import pulumi_aws as aws

# Configuration
config = pulumi.Config()
vpc_cidr = config.get("vpc_cidr", "10.0.0.0/16")
instance_type = config.get("instance_type", "t3.micro")

# VPC
vpc = aws.ec2.Vpc("main-vpc",
    cidr_block=vpc_cidr,
    enable_dns_hostnames=True,
    enable_dns_support=True,
    tags={
        "Name": "main-vpc",
        "Environment": pulumi.get_stack()
    }
)

# Internet Gateway
igw = aws.ec2.InternetGateway("main-igw",
    vpc_id=vpc.id,
    tags={"Name": "main-igw"}
)

# Subnet
subnet = aws.ec2.Subnet("public-subnet",
    vpc_id=vpc.id,
    cidr_block="10.0.1.0/24",
    map_public_ip_on_launch=True,
    tags={"Name": "public-subnet"}
)

# Security Group
security_group = aws.ec2.SecurityGroup("app-sg",
    vpc_id=vpc.id,
    description="Allow HTTP and SSH",
    ingress=[
        {"protocol": "tcp", "from_port": 80, "to_port": 80, "cidr_blocks": ["0.0.0.0/0"]},
        {"protocol": "tcp", "from_port": 22, "to_port": 22, "cidr_blocks": ["0.0.0.0/0"]}
    ],
    egress=[
        {"protocol": "-1", "from_port": 0, "to_port": 0, "cidr_blocks": ["0.0.0.0/0"]}
    ]
)

# EC2 Instance
instance = aws.ec2.Instance("app-instance",
    instance_type=instance_type,
    ami="ami-0c55b159cbfafe1d0",  # Amazon Linux 2
    subnet_id=subnet.id,
    vpc_security_group_ids=[security_group.id],
    tags={"Name": "app-instance"}
)

# Exports
pulumi.export("vpc_id", vpc.id)
pulumi.export("instance_ip", instance.public_ip)
pulumi.export("instance_dns", instance.public_dns)
```

#### 3. AWS CDK Example (TypeScript)

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc,
      containerInsights: true,
    });

    // Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyTaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    taskDefinition.addContainer('MyContainer', {
      image: ecs.ContainerImage.fromRegistry('nginx:latest'),
      portMappings: [{
        containerPort: 80,
        protocol: ecs.Protocol.TCP,
      }],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'MyApp',
      }),
    });

    // ECS Service
    const service = new ecs.FargateService(this, 'MyService', {
      cluster: cluster,
      taskDefinition: taskDefinition,
      desiredCount: 2,
    });

    // Load Balancer
    const lb = new elbv2.ApplicationLoadBalancer(this, 'MyALB', {
      vpc: vpc,
      internetFacing: true,
    });

    const listener = lb.addListener('MyListener', {
      port: 80,
      open: true,
    });

    listener.addTargets('MyTargets', {
      port: 80,
      targets: [service],
      healthCheckPath: '/',
    });

    // Output
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: lb.loadBalancerDnsName,
    });
  }
}
```

#### 4. CloudFormation Example

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Simple web application infrastructure'

Parameters:
  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues: [t3.micro, t3.small, t3.medium]
  
  Environment:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, prod]

Resources:
  # VPC
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-vpc'

  # Internet Gateway
  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-igw'

  # Attach IGW to VPC
  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  # Public Subnet
  PublicSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-public-subnet'

  # Security Group
  SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow HTTP and SSH
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

  # EC2 Instance
  Instance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      ImageId: ami-0c55b159cbfafe1d0
      SubnetId: !Ref PublicSubnet
      SecurityGroupIds:
        - !Ref SecurityGroup
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-instance'
        - Key: Environment
          Value: !Ref Environment

Outputs:
  InstanceId:
    Description: Instance ID
    Value: !Ref Instance
    Export:
      Name: !Sub '${AWS::StackName}-InstanceId'
  
  PublicIP:
    Description: Public IP address
    Value: !GetAtt Instance.PublicIp
    Export:
      Name: !Sub '${AWS::StackName}-PublicIP'
```

### Best Practices

1. **Code Organization**
   - Use modules/components for reusability
   - Separate environments with different configurations
   - Follow consistent naming conventions
   - Keep configurations DRY (Don't Repeat Yourself)

2. **State Management**
   - Use remote state storage (S3, Azure Storage)
   - Enable state locking
   - Regular state backups
   - Never manually edit state files

3. **Security**
   - Store secrets in secure vaults
   - Use IAM roles and policies properly
   - Enable encryption at rest and in transit
   - Regular security audits

4. **Version Control**
   - Version your infrastructure code
   - Use branching strategies
   - Code reviews for infrastructure changes
   - Tag releases

5. **Testing**
   - Validate syntax and formatting
   - Test in isolated environments
   - Implement integration tests
   - Use policy as code tools

### Common Use Cases

- **Multi-Environment Deployment**: Consistent dev/staging/prod environments
- **Disaster Recovery**: Quickly recreate infrastructure
- **Auto Scaling**: Dynamic resource provisioning
- **Compliance**: Ensure consistent security and compliance policies
- **Cost Optimization**: Automated resource lifecycle management
- **CI/CD Integration**: Infrastructure changes through pipelines

### Useful Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [Infrastructure as Code Patterns](https://www.oreilly.com/library/view/infrastructure-as-code/9781491924334/)

---

## 5. AWS ECS

### Overview and Why It Matters

Amazon Elastic Container Service (ECS) is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications. ECS eliminates the need to install and operate your own container orchestration software.

**Benefits:**
- **Fully Managed**: No control plane management required
- **