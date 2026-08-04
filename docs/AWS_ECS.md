# AWS ECS

Managed container orchestration (Fargate/EC2).

```bash
aws ecs create-cluster --cluster-name my-cluster
aws ecs create-service --cluster my-cluster --service-name my-svc --task-definition my-task --desired-count 2 --launch-type FARGATE
```

ECS: AWS-only, simpler. EKS: Kubernetes, portable.
