# AWS ECS (Elastic Container Service)

## What is AWS ECS?

Amazon ECS is a **fully managed container orchestration service** that runs Docker containers on AWS. It's like a simpler alternative to Kubernetes for teams already in the AWS ecosystem.

### ECS vs EKS vs Fargate

| Service | What | When to Use |
|---------|------|-------------|
| **ECS** | AWS-native container orchestration | Simple workloads, AWS-first teams |
| **EKS** | Managed Kubernetes | Complex workloads, K8s expertise |
| **Fargate** | Serverless compute for ECS/EKS | No server management needed |

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Task Definition** | Blueprint for your container (image, CPU, memory, ports) |
| **Task** | A running instance of a Task Definition (1+ containers) |
| **Service** | Maintains a desired number of tasks running |
| **Cluster** | Logical grouping of EC2 instances or Fargate tasks |
| **Launch Type** | EC2 (you manage servers) or Fargate (serverless) |

## Task Definition Example

```json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "web",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "essential": true,
      "portMappings": [
        { "containerPort": 3000, "protocol": "tcp" }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## ECS with Terraform

```hcl
# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "my-app-cluster"
}

# Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "my-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512

  container_definitions = jsonencode([{
    name      = "web"
    image     = "${aws_ecr_repository.app.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 3000
      protocol      = "tcp"
    }]
  }])
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "my-app-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.private[*].id
    security_groups = [aws_security_group.ecs.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "web"
    container_port   = 3000
  }
}
```

## ECS with Load Balancer

```
Internet → ALB (port 80/443) → Target Group → ECS Tasks (port 3000)
```

### Setting up ALB with ECS

1. Create ALB with listener on port 80
2. Create Target Group (target type: `ip` for Fargate)
3. Configure ECS Service to register with Target Group
4. Add security group rules for ALB → ECS traffic

## Useful CLI Commands

```bash
# List clusters
aws ecs list-clusters

# List services
aws ecs list-services --cluster my-cluster

# List running tasks
aws ecs list-tasks --cluster my-cluster --service-name my-service

# Get task details
aws ecs describe-tasks --cluster my-cluster --tasks <task-arn>

# Update service (force new deployment)
aws ecs update-service --cluster my-cluster --service my-service --force-new-deployment

# View logs
aws logs tail /ecs/my-app --follow
```

## Auto Scaling

```hcl
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70
  }
}
```

## Best Practices

1. **Use Fargate** unless you need GPU or custom AMIs
2. **Use ECR** for container images ( integrates with IAM)
3. **Use ALB** for HTTP services (health checks, routing)
4. **Use Parameter Store or Secrets Manager** for secrets
5. **Enable auto-scaling** based on CPU/memory
6. **Use AWS CloudMap** for service discovery
7. **Tag everything** for cost tracking
8. **Use CI/CD** — Build image → Push to ECR → Update ECS service
