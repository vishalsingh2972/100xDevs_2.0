## Which Scaling method should we use?

- If we have multi-core machines, vertical scaling doesn't make sesnse.
- If we want to implement Load Balancers and distribute the load, we should **go for horizontal scaling**.
- Horizontal scaling is more cost-effective and efficient. We can **autoscale the servers based on the traffic**.
- Today's session is to understand how to implement horizontal scaling using AutoScaling Groups.

---

## Types of Auto Scaling Implementation Design

1. **Adhoc Scaling**: In these systems, we own the logic for autoscaling.

   <img width="300" alt="Screenshot 2024-04-28 at 7 13 57 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/f6954648-ac66-4272-a213-368ef9cf6595">

2. **Queue Based Scaling**: In these systems, we scale based on size of the queue.

   <img width="500" alt="Screenshot 2024-04-28 at 7 17 35 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/ced3b874-b008-49cb-a515-7765aa554a30">

### Some Things to Consider

- Today Autoscaling usually happens using containers.
- AWS calls this service as **Auto Scaling Groups (ASGs)**.
- This machine needs to have the code to run the server.

### Some BUZZ Words

- **AMI**: Amazon Machine Image

    <img width="600" alt="Screenshot 2024-04-28 at 7 22 56 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/6aff2734-6be8-476d-ad71-e0919c89df7d">

  - It is a snapshot of the machine.
  - From this, we can create multiple instances.
  - This snapshot is what we give to the ASGs.

<br>

- **Load Balancers**:

  - They distribute the load across multiple servers.
  - They are the entry point for the traffic.
  - The hold the logic to route the traffic to the various machines.
  - We can also do the proxy service method if we want, but we usually would want to defer this to AWS Load Balancers from scaling perspective.

    <img width="600" alt="Screenshot 2024-04-28 at 7 26 32 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/fa170f4e-713e-42ba-8835-80d4b91bbaee">

<br>

- **Target Groups**:

  - AWS Specific service.
  - It is a group of servers that are behind the Load Balancer.
  - The Load Balancer routes the traffic to the Target Groups.

<br>

- **Launch Templates**:

  - It is a template to launch new instances.
  - **Diff b/w image and template**: It has the configuration of the instance while Image only stores the code snapshot of the machine.

    <img width="600" alt="Screenshot 2024-04-28 at 7 29 04 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/c7240905-26cf-451f-a58b-437fcac78ab3">

    <br>

  - We can specify the AMI, instance type, security groups, keypair, launch commands etc.

**Note**: Make sure to delete the ASG created and not just the instances as they will get restarted if the ASG is still there.

---

## Deploying ASGs

1. Go to AWS and create an instance using instructions [here](https://github.com/vishalsingh2972/100xDevs_2.0/tree/main/0-1%20cohort/Week%2011/11.2).

<br>

2. Change the permissions using the following command:

   ```bash
   chmod 700 <key.pem>
   ```

   <br>

3. SSH into the instance using the following command:

   ```bash
   ssh -i <key.pem> ec2-user@<public-ip>
   ```

<br>

4. Clone the repository using the following command:

   ```bash
   git clone https://github.com/its-id/100x-Cohort-Programs
   ```

<br>

5. Install Node.js in the instance using nvm ([here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04#option-3-installing-node-using-the-node-version-manager)).

   > Note: Make sure to install v22.0.0 for later steps.

<br>

6. Go to `/Week 22/Week 22.2/node-app` and run the following command:

   ```bash
   cd Week\ 22/Week\ 22.2/node-app/
   npm install
   ```

<br>

7. Go to the Instance Listing, select the Instance and click on `Actions` -> `Image and Templates` -> `Create Image`.

   <img width="700" alt="Screenshot 2024-04-28 at 7 56 40 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/92b61c93-3203-498e-9c48-8557f5655aa4">

   <img width="700" alt="Screenshot 2024-04-28 at 7 46 50 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/b71a3bc6-99a7-4b37-8b2c-4de5ac5c6cb2">

<br>

8. Go to `Security Groups` and add a new rule for `Custom TCP` with port `3000`.
   <img width="700" alt="Screenshot 2024-04-28 at 8 00 26 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/ab5dab31-c0be-422f-b6bb-06af23fec016">

<br>

9. Next, we create the **Launch Template** so that we can launch the instances using the template next time without having to configure it again.

   - Go to `Launch Templates` and click on `Create Launch Template`.
   - Give it a name and description.
   - Choose the AMI created.
   - Choose the instance type.
   - Choose the keypair.

     <img width="700" alt="Screenshot 2024-04-28 at 8 03 16 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/ace52994-4d5d-48d4-89fc-ededdd076644">

    <br>

   - Select the security group.
   - Now, we need to add the User Data. This is the script that will run when the instance is launched.

     <img width="700" alt="Screenshot 2024-04-28 at 7 53 45 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/f69af076-077b-496a-834e-ccb1a783ea3f">

   - Add the following script:

     ```bash
     #!/bin/bash
     export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v22.0.0/bin/
     echo "hi there before"
     echo "hi there after"
     npm install -g pm2
     cd /home/ubuntu/week-22
     pm2 start index.js
     pm2 save
     pm2 startup
     ```

     <img width="700" alt="Screenshot 2024-04-28 at 8 05 50 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/8c398ca4-7731-429a-8c8d-300fd88532d4">

     <br>

     You can check if above version of Node.js is in path using below command:

     ```bash
     ls /home/ubuntu/.nvm/versions/node/v22.0.0/
     ```

   - Click on `Create Launch Template`.

   <br>

   <p align="center"><b>Congratulations 🎉! You have created the Launch Template. Summary of steps so far:</b></p>
   <p align="center"><img width="698" alt="Screenshot 2024-04-28 at 8 14 51 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/a50dc64f-f553-4900-9afb-825b21a5f956"></p>

   <br>

10. Now, we create the Auto Scaling Group.

    - Go to `Auto Scaling Groups` and click on `Create Auto Scaling Group`.

      <img width="400" alt="Screenshot 2024-04-28 at 7 31 17 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/130955fe-dcbb-424b-a13f-0275649b8e59">

      <br>

    - Give it a name and description.

      <img width="500" alt="Screenshot 2024-04-28 at 7 31 43 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/6d330cbe-7287-4510-b38c-954195b98272">

      <br>

      > **Note**: We can setup versions in ASGs too with edits in image, launch template based on changes in the instances and rollback if needed.

    - Choose the Launch Template created.

    - Choose the VPC and Subnet. You can select multiple subnets to launch the instances in different availability zones but should stick to one because of termination issues.

    - Choose the Load Balancer. In our case, we do need one since its an HTTP request.
      - Choose the option `Attach to a new load balancer`.
      - Choose type `Application Load Balancer`.
      - Choose Load Balancer Scheme as `Internet-facing`.
      - We will be needing a target group to whom Load Balancer will send the traffic.
      - Choose `Create a target group` if don't already have one.
      ![image](https://github.com/user-attachments/assets/b8bcb3b4-3f3e-462d-b95a-ee552f368485)
      - Rest of the settings can be left as default.
    - Review and Click on `Create Auto Scaling Group`.

<p align="center"><b>Congratulations 🎉! you have created the Auto Scaling Group. You can check the instances running in the `Instance Management` tab.</b></p>

<p align="center">Check a sample deployed ASG Load Balancer 👉  <a href="http://lb.100xdevs.com/api/1">here.</a></p>

<br>

**Note**: To fix the issue of target groups showing `unhealthy`, this may be probably because of wrong PORT issues.

- Check the Security Groups associated with the instance and add the default ports (443 & 80).
  <img width="700" alt="Screenshot 2024-04-28 at 8 34 22 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/d7df9dfa-bd6d-40a3-8673-51717ebe6da5">

    <br>

- Try creating a new Target Group, this time with the correct port (3000).
  <img width="700" alt="Screenshot 2024-04-28 at 8 38 11 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/a35f457b-12f4-4542-8cba-5e44d3a970a1">

    <br>

- Go to your Auto Scaling Group created -> under `Load Balancing` section -> update the target group to the new target group created.
  <img width="700" alt="Screenshot 2024-04-28 at 8 42 33 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/59c0f758-be79-4136-b9ff-fb13506d1aa3">
  <img width="700" alt="Screenshot 2024-04-28 at 8 42 57 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/030e0483-95ee-4dab-84cb-fe13ed68edac">

    <br>

- Do the same for Load Balancer. Go to Load Balancer created -> select the `Listener` with wrong port mapping -> `Edit rule` -> Update the target group.

  <img width="700" alt="Screenshot 2024-04-28 at 8 44 00 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/bbc6856f-3845-45f6-9973-0013e8502a3e">
  <img width="700" alt="Screenshot 2024-04-28 at 8 44 11 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/731d9239-7c0d-4804-96e7-0861f2595c5e">
  <img width="700" alt="Screenshot 2024-04-28 at 8 44 30 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/637cf94e-562b-4414-91c8-2e0cd7fa00cf">
  <img width="700" alt="Screenshot 2024-04-28 at 8 51 54 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3ee962ce-32ce-4e2a-b70d-ac7e089a9ddc">

<br>

> More Formal Tutorial on deploying ASGs can be found [here](https://docs.aws.amazon.com/codedeploy/latest/userguide/tutorials-auto-scaling-group.html)

---

## Mapping the Load Balancer to the Domain

1. Go to your Load Balancer you created.

2. Go to the `Listeners` tab and check the port mapping.

3. Go to the `Target Groups` tab and check the target group.

4. To map the Load Balancer to the domain, we need to get a certificate for the Load Balancer URL. We can get a free certificate from [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/)

5. Go to the AWS Certificate Manager and click on `Request a certificate`.

6. Add the domain name you want to map to the Load Balancer.

7. Choose the validation method as `DNS Validation`.

8. Click on `Review` and `Confirm and request`.

9. Go to the `Description` tab and copy the `DNS Name`.

10. Go to your domain provider and create a new `CNAME` record with the `DNS Name` copied.

---

### Experimening with the ASG

1. To apply autoscaling based on the traffic, we can use:

   - Play the desired capacity and the minimum and maximum capacity in the ASG settings.
   
     <img width="700" alt="Screenshot 2024-04-28 at 8 30 57 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/5460d05d-6a92-4428-852f-e5f2b614eb19">
     <img width="700" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/6cbe032a-5089-4a20-8137-af538c9a6e7f">

    <br>

   - Dynamic Scaling Policies.

     <img width="700" alt="image" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/2601ac3d-a5f3-431e-a1ac-341db7a9b7f2">

    <br>
       
     **Quick Hack**: In order to get the latest changes from Github on your ASG, First Decrease the desired capacity to 0, then increase it back to the desired capacity.

   <br>

1. Simulate a scale up by running a CPU intensive task in your node.js app:

   ```js
   while (1) {
     console.log('running');
   }
   ```

   <br>

1. To check the logs of the automating scaling events, go to the `Activity` tab in the ASG.

---

## Cleanup in following order

1. Delete the Auto Scaling Group which automatically deletes all the connected Ec2 instances/copies.
2. Delete the Load Balancer.
3. Delete the Launch Template.
4. Delete the Target Group.
5. Delete the AMI.
6. Delete the primary Ec2 Instance.
7. Delete your VPC.
