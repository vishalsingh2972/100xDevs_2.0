# Deploying on AWS

## What is AWS & Why is it better?

In simple words, it is a cloud services provider. We can get a remote server from here.

The main benefit which matters for us is that we can deploy a express app here which was not possible on Cloudflare workers.

## 1. How to get the EC2 instance?

1. Create an account on AWS. (a credit card is required).
2. Search EC2 in the search bar.
   <br><img width="500" alt="Screenshot 2024-02-11 at 7 12 12 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/fd415157-0679-4568-a4be-2741dbc427f2">

4. Once in the dashboard, Click on "Launch Instance" button.
   <br><img width="500" alt="Screenshot 2024-02-11 at 7 13 09 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/81bde222-46a6-480a-aa7b-d7cda1b9a180">

5. Fill in the fields:

   - Give a name to the instance
     <br><img width="500" alt="Screenshot 2024-02-11 at 7 13 49 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3003dc0c-edf1-4dcc-a170-dd5b7bd4c5c3">

   - Choose an Amazon Machine Image (AMI). Here we are selecting `Amazon Linux 2023 AMI` (eligible for free tier)
     <br><img width="500" alt="Screenshot 2024-02-11 at 7 14 20 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/e630a508-74a1-4f8f-a7b8-5201714ee056">

   - Choose an Instance Type (Default is: t2.micro for minimum cost)
     <br><img width="500" alt="Screenshot 2024-02-11 at 7 14 34 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/71f1f401-b8e7-4527-983b-66225c058082">

   - Create your seperate key pair (download the .pem file). This is used for a secure connection between your computer and the server.
     <br><img width="500" alt="Screenshot 2024-02-11 at 7 15 13 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/d1391c23-c9fd-4e62-95db-d18193fda08e">

   - Inside Network Settings, we create a security group with following settings:

     - Allow SSH (port 22) from anywhere
     - Allow HTTP (port 80) for everyone
     - Allow HTTPS (port 3000) for everyone
       <br><img width="500" alt="Screenshot 2024-02-11 at 7 28 33 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/1bb5d555-b1f6-4ff2-8cea-79d041b4a860">

   - Review and Launch
      <br><img width="500" alt="Screenshot 2024-02-11 at 7 35 13 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/c9cc637f-e57e-4393-836f-9016194a7b53">
      <br><img width="500" alt="Screenshot 2024-02-11 at 7 35 19 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/fa67e340-001a-480c-9d30-ef04c1b0c376">
      <br><img width="500" alt="Screenshot 2024-02-11 at 7 35 24 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/48bc3126-8fba-4185-8a4f-17d835238733">


6. Check back on the EC2 dashboard, you will see your instance running.
   <br><img width="500" alt="Screenshot 2024-02-11 at 7 36 02 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/45055ee4-2c72-4fae-897f-8c5c51eba1f0">

## 2. How to connect to the EC2 instance?

1. Open your terminal and navigate to the directory where your .pem file is located.
   <br>
2. Run the following command to change the permissions of the .pem file:

   ```bash
    chmod 700 your-key-pair.pem
   ```

   > **For Windows**, check this [discussion](https://superuser.com/questions/1296024/windows-ssh-permissions-for-private-key-are-too-open) or install [putty](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html).

   <details>
    <summary>Explaining the above command</summary>

   - `chmod` is a command used to change the permissions of a file or directory.

   - `700` is the permission code. It means that the owner can **read, write and execute** the file, but no one else can do anything with it.
   </details>
   <br>

3. Now, you can connect to the instance using the following command:

   ```bash
    ssh -i "your-key-pair.pem" xxxxxxxx@xxxxxxxxxxxxxx
   ```

   where `your-key-pair.pem` is the name of your .pem file and xxxxxxxxx@xxxxxxxxxxxxxxx is the public DNS of your instance.

   **To see the public DNS**

   - Click on your instance in the EC2 dashboard.

   - Click on `Connect` button on top.
     <br><img width="500" alt="Screenshot 2024-02-11 at 8 20 34 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/276d3d27-08a2-41c4-87be-f9fb2ca6c6f8">


   - Navigate to the `SSH Client` tab. There you will see the example command, either copy the whole command or just the public DNS part.
     <br><img width="500" alt="Screenshot 2024-02-11 at 7 44 51 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3f8085aa-f02d-4d23-bb54-436d9e37ccb3">


## 3. How to deploy your application on the EC2 instance?

1. Once you are connected to the instance, run the following commands:

   ```bash
    sudo yum update -y
    sudo yum install git -y
    git clone https://github.com/its-id/100x-Cohort-Programs.git
    cd 100x-Cohort-Programs/Week\ 11/Programs/Week\ 11.2
    sudo yum install nodejs -y
    sudo yum install npm -y
    npm install
    node index.js
   ```
   
   where `https://github.com/its-id/100x-Cohort-Programs.git` is the url of this repository, you can replace it with your own repository url and cd into your own directory.

2. Check if your app is running by visiting your public DNS in the browser.

   **Route**: `http://your-public-dns:8080/todos`
   <br><img width="1582" alt="Screenshot 2024-02-11 at 8 36 58 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/36d44393-d6e8-4762-981d-af62d520f7f4">

> **Note**: Since we are running the app on port 8080, we need to add the port number as a custom TCP rule in the security group settings.
>
> <details>
>    <summary>Steps 👇</summary>
> 1. In your instance details page in the EC2 dashboard.
> <br>2. Click on *Security* tab.
>      <br><img width="500" alt="Screenshot 2024-02-11 at 8 20 34 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/aa24e718-95ff-49b2-a09c-d7dfb003f0ca">
> <br>3. Click on the security group name.
>       <br><img width="500" alt="Screenshot 2024-02-11 at 8 20 56 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/45e36bb8-3dff-4144-aa06-beae703a3a17">
> <br>4. Click on *Edit inbound rules*.
>       <br><img width="500" alt="Screenshot 2024-02-11 at 8 21 06 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/2d0ffac0-9e89-4c59-bc79-b17f11b1ea2a">
> <br>5. Click on *Add rule*. Add the port number under *Port range* and select *Custom TCP* from the dropdown. Also select *Anywhere from ipv4* under *Source*.
>       <br><img width="500" alt="Screenshot 2024-02-11 at 8 21 31 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/13274fa3-c0fb-4f36-8657-7aa7ea06c295">
> <br>6. Click on `Save rules`.

</details>

**Congratulations! You made it!** 🎉

---

## 4. How to enable Reverse Proxy?

### What it does?

Basically helps you rent a single server and host multiple websites on it. Best way to make one web server handle multiple domains (if you are cheap like me 😅).

1. Install nginx:

   ```bash
   sudo yum install -y nginx
   ```

2. Create a reverse proxy:

   - While in the aws instance terminal, open the nginx configuration file:

     ```bash
     sudo vi /etc/nginx/nginx.conf
     ```

   - Replace the contents of the file with the following:

     ```bash
     events {
         # Event directives...
     }

     # for pointing to multiple domains
        http {
            server {
            listen 80;
            server_name [YOUR_CUSTOM_DOMAIN_1];

                location / {
                    proxy_pass http://localhost:8080;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
                }
            }

            server {
            listen 80;
            server_name [YOUR_CUSTOM_DOMAIN_2];

                location / {
                    proxy_pass http://localhost:8080;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
                }
            }
        }
     ```

     > Make sure to replace `[YOUR_CUSTOM_DOMAIN_1]` and `[YOUR_CUSTOM_DOMAIN_2]` with your own domain names.

   - Save and exit the file by pressing `esc` and then `:wq` and then `enter`.
     <br>

3. Restart nginx:

   ```bash
   sudo service nginx restart
   ```

4. Add the the subdomains in the DNS settings of your domain provider.

   - Go to the DNS settings of your domain provider and add an A record for your subdomain pointing to your public DNS.
      <br><img width="500" alt="Screenshot 2024-02-11 at 8 42 20 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/25b257e9-728c-45d5-8530-e7f9653f42b6">

   - For example, if you want to point `api.yourdomain.com` to your server, add an A record with the name `api` and value as your public DNS.

   - Also, add a CNAME record with the name `www` and value as your domain name.

   - It will take some time to reflect the changes.
     <br><img width="500" alt="Screenshot 2024-02-11 at 8 42 45 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/19fd15c2-b22c-46a6-a2fd-e76c93d06c96">

5. Now, you can visit your subdomains in the browser and see your app running.
   <br><img width="500" alt="Screenshot 2024-02-11 at 8 43 40 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3cc5e730-74aa-4d3d-ac93-f99df04d3236">

<details>
    <summary> If you want to point a domain to your own machine (For ex: pointing "google.com" to your machine's server, for fooling your friends 🤓)</summary>

Note: Only works for your local machine.

1. Open the hosts file:

   - For Windows, open `C:\Windows\System32\drivers\etc\hosts` in a text editor with admin privileges using command:
     ```bash
     notepad C:\Windows\System32\drivers\etc\hosts
     ```
   - For Mac and Linux, open `/etc/hosts` in a text editor with sudo privileges using command:
     ```bash
     sudo vi /etc/hosts
     ```

2. Add the following line at the end of the file:

   ```bash
   [YOUR_PUBLIC_IP] [YOUR_CUSTOM_DOMAIN]
   ```

   Replace `[YOUR_PUBLIC_IP]` with your public IP and `[YOUR_CUSTOM_DOMAIN]` with your custom domain name.

   > Get your public ip by searching "what is my ip" in the browser.

3. Save and exit the file.

4. Now, you can visit your custom domain in the browser and see your app running.

</details>