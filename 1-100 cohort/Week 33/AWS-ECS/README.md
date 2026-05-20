# AWS ECS (Elastic Container Service)

## What is ECS?

AWS ECS is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications.

### Key Concepts

- **Cluster** - Logical grouping of tasks or services
- **Task Definition** - Blueprint for your application
- **Task** - Running instance of a task definition
- **Service** - Maintains desired count of tasks
- **Container Instance** - EC2 instance running ECS agent

## Launch Types

### Fargate
- Serverless
- No infrastructure management
- Pay per use
- Best for most workloads

### EC2
- More control
- Custom AMIs
- Reserved instances
- Best for large workloads

## Task Definition

```json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "my-app",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
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

## CLI Commands

```bash
# Create cluster
aws ecs create-cluster --cluster-name my-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-def.json

# Create service
aws ecs create-service \
  --cluster my-cluster \
  --service-name my-service \
  --task-definition my-app:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"

# List tasks
aws ecs list-tasks --cluster my-cluster

# Describe task
aws ecs describe-tasks --cluster my-cluster --tasks arn:aws:ecs:...
```

## Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/my-cluster/my-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/my-cluster/my-service \
  --policy-name my-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

## Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [ECS Pricing](https://aws.amazon.com/ecs/pricing/)
